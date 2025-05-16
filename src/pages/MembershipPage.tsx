
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const MembershipPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasMembership, setHasMembership] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(true);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      description: 'Access all features for a month',
      price: 999,
      features: [
        'Full workout programs',
        'Personalized diet plans',
        'Progress tracking',
        'Priority support',
      ],
      duration: '1 month',
      popular: false,
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      description: 'Save 15% with quarterly billing',
      price: 2499,
      features: [
        'All monthly features',
        'Advanced analytics',
        'Video consultations',
        'Free fitness e-book',
      ],
      duration: '3 months',
      popular: true,
    },
    {
      id: 'yearly',
      name: 'Yearly',
      description: 'Best value with annual billing',
      price: 7999,
      features: [
        'All quarterly features',
        'Personal trainer sessions',
        'Custom meal plans',
        'Fitness community access',
      ],
      duration: '1 year',
      popular: false,
    },
  ];

  useEffect(() => {
    async function checkUserAndMembership() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        // Check if user has an active membership
        const { data: memberships } = await supabase
          .from('user_memberships')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();
          
        setHasMembership(!!memberships);
        setMembershipLoading(false);
      }
    }
    
    checkUserAndMembership();
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan: any) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase a membership",
        variant: "destructive",
      });
      return;
    }

    setLoading(plan.id);
    
    const res = await loadRazorpay();
    if (!res) {
      toast({
        title: "Error",
        description: "Razorpay SDK failed to load. Please check your internet connection.",
        variant: "destructive",
      });
      setLoading(null);
      return;
    }
    
    try {
      // Create payment order through our edge function
      const createOrderResponse = await fetch(`${window.location.origin}/functions/v1/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          planId: plan.id,
          userId: userId
        })
      });
      
      const orderData = await createOrderResponse.json();
      
      if (orderData.error) {
        throw new Error(orderData.error);
      }

      const options = {
        key: "rzp_test_YOUR_KEY_ID", // Replace with your Razorpay key
        amount: orderData.amount * 100, // Amount in paise
        currency: orderData.currency,
        name: "Consist Fitness",
        description: `${orderData.planName} Membership`,
        order_id: orderData.orderId,
        handler: async function(response: any) {
          try {
            // Verify payment through our edge function
            const verifyResponse = await fetch(`${window.location.origin}/functions/v1/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                user_id: userId
              })
            });
            
            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              toast({
                title: "Payment Successful!",
                description: `Your ${plan.name} membership is now active.`,
              });
              setHasMembership(true);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (err: any) {
            toast({
              title: "Verification Error",
              description: err.message || "Failed to verify payment",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: "Fitness User",
        },
        theme: {
          color: "#8B5CF6",
        },
        modal: {
          ondismiss: function() {
            setLoading(null);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setLoading(null);
    }
  };

  if (membershipLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 bg-white dark:bg-black min-h-screen flex items-center justify-center">
          <p>Loading membership information...</p>
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
            <CardTitle>Membership Plans</CardTitle>
            <CardDescription>
              Choose the best plan for your fitness journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`overflow-hidden ${
                    plan.popular ? 'border-purple-500 border-2' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-purple-500 text-white text-center py-1 text-xs font-medium">
                      MOST POPULAR
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      {plan.popular && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                          Best Value
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">₹{(plan.price / 100).toFixed(0)}</span>
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
                      className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                      onClick={() => handlePayment(plan)}
                      disabled={loading === plan.id}
                    >
                      {loading === plan.id ? (
                        "Processing..."
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Subscribe Now
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MembershipPage;
