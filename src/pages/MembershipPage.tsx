import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const MembershipPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasMembership, setHasMembership] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(true);

  const plan = {
    id: 'monthly',
    name: 'Monthly',
    description: 'Full access for one month',
    price: 299, 
    features: [
      'Full workout programs',
      'Personalized diet plans',
      'Progress tracking',
      'Priority support',
    ],
    duration: '1 month',
  };

  useEffect(() => {
    async function checkUserAndMembership() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          
          // Check if user has an active membership
          const { data: memberships, error } = await supabase
            .from('user_memberships')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching membership:', error);
            toast({
              title: "Error",
              description: "Failed to load membership status",
              variant: "destructive",
            });
          }
          
          setHasMembership(!!memberships);
          setMembershipLoading(false);
        } else {
          setMembershipLoading(false);
        }
      } catch (err) {
        console.error('Error checking user and membership:', err);
        setMembershipLoading(false);
        toast({
          title: "Error",
          description: "Failed to check membership status",
          variant: "destructive",
        });
      }
    }
    
    checkUserAndMembership();
  }, [toast]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase a membership",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Load Razorpay SDK
      const res = await loadRazorpay();
      if (!res) {
        throw new Error("Razorpay SDK failed to load");
      }
      
      // Get Razorpay key_id and subscription_id from backend
      const { data: { session } } = await supabase.auth.getSession();
      
      try {
        const response = await fetch(`${window.location.origin}/functions/v1/create-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({
            planId: plan.id,
            userId: userId
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to get payment details");
        }
        
        const data = await response.json();
        
        // Configure Razorpay options using the provided template
        const options = {
          key: data.key_id || "rzp_live_AFBMj1SG3UGbjg", // Use key from backend or fallback to provided key
          subscription_id: data.subscription_id || "sub_QWQa9T4oiAELdz", // Use from backend or fallback
          name: "Consist Fitness",
          description: "Monthly Membership",
          image: "/placeholder.svg", // App logo
          prefill: {
            name: "Fitness User",
            email: "",
          },
          notes: {
            user_id: userId,
            plan_type: "monthly"
          },
          theme: {
            color: "#8B5CF6"
          },
          handler: function(response: any) {
            try {
              console.log("Payment successful:", response);
              
              // Record successful payment
              toast({
                title: "Payment Successful!",
                description: `Your ${plan.name} membership is now active.`,
              });
              setHasMembership(true);
            } catch (err: any) {
              console.error("Payment error:", err);
              toast({
                title: "Error",
                description: err.message || "Something went wrong with the payment",
                variant: "destructive",
              });
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              console.log("Payment modal dismissed");
            }
          }
        };

        // Open Razorpay checkout
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error: any) {
        console.error("Error setting up payment:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to set up payment",
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({
        title: "Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (membershipLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 bg-white dark:bg-black min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p>Loading membership information...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (hasMembership) {
    return (
      <AppLayout>
        <div className="space-y-6 bg-white dark:bg-black min-h-screen">
          <Card>
            <CardHeader>
              <CardTitle>Active Membership</CardTitle>
              <CardDescription>
                Your membership is currently active
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Thank You for Being a Member!</h2>
                <p className="text-muted-foreground mb-6">
                  You have full access to all premium features and content.
                </p>
                <div className="w-full max-w-md mx-auto p-4 border border-border rounded-lg bg-muted/50">
                  <h3 className="font-medium mb-3">Your Benefits Include:</h3>
                  <ul className="space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Full workout programs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Personalized diet plans</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Premium support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 bg-white dark:bg-black min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Membership Plan</CardTitle>
            <CardDescription>
              Get full access to all features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 max-w-md mx-auto">
              <Card className="overflow-hidden border-2 border-purple-500">
                <div className="bg-purple-500 text-white text-center py-1 text-xs font-medium">
                  BEST VALUE
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                      Recommended
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.duration.split(' ')[1]}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={handlePayment}
                    disabled={loading}
                    id="rzp-button1"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MembershipPage;
