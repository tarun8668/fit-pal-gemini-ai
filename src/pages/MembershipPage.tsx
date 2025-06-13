import React, { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMembership } from '@/context/MembershipContext';
import { SubscriptionStatusBar } from '@/components/membership/SubscriptionStatusBar';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const MembershipPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { hasMembership, isLoading: membershipLoading, checkMembership, isExpired } = useMembership();

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
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
      } catch (err) {
        console.error('Error getting user:', err);
      }
    }
    
    getUser();
  }, []);

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
        title: "Authentication Required",
        description: "Please log in to purchase a membership",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const res = await loadRazorpay();
      if (!res) {
        throw new Error("Razorpay SDK failed to load");
      }

      const options = {
        key: 'rzp_live_AFBMj1SG3UGbjg',
        amount: plan.price * 100,
        currency: "INR",
        name: "Consist Fitness",
        description: "Monthly Premium Membership",
        image: "https://consistfitness.com/logo.png",
        prefill: {
          name: "Fitness User",
          email: "test@example.com",
          contact: "9999999999"
        },
        notes: {
          user_id: userId,
          plan_type: "monthly"
        },
        theme: {
          color: "#8B5CF6"
        },
        handler: async function(response: any) {
          console.log('Razorpay payment successful:', response);
          
          try {
            // Call the new verify-membership-payment edge function
            const { data, error } = await supabase.functions.invoke('verify-membership-payment', {
              body: {
                payment_id: response.razorpay_payment_id,
                user_id: userId,
                amount: plan.price,
                plan_type: 'monthly',
                duration_months: 1
              }
            });

            if (error) {
              console.error('Payment verification error:', error);
              throw new Error(error.message || 'Payment verification failed');
            }

            console.log('Payment verification successful:', data);

            toast({
              title: "Payment Successful!",
              description: "Congratulations! You are now a premium member with access to all features.",
            });

            // Force refresh membership status
            await checkMembership();
            
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if payment was deducted. We'll resolve this quickly.",
              variant: "destructive",
            });
          }
          setLoading(false);
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setLoading(false);
          },
          escape: true,
          backdropclose: true
        }
      };

      const rzp1 = new window.Razorpay(options);
      
      rzp1.on('payment.failed', function (response: any) {
        console.error('Razorpay payment failed:', response.error);
        toast({
          title: "Payment Failed",
          description: response.error.description || "Payment failed. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      });

      rzp1.open();
      
    } catch (err) {
      console.error("Payment initialization error:", err);
      toast({
        title: "Payment Error",
        description: err instanceof Error ? err.message : "Failed to initialize payment",
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

  if (hasMembership && !isExpired) {
    return (
      <AppLayout>
        <div className="space-y-6 bg-white dark:bg-black min-h-screen">
          <SubscriptionStatusBar onUpgrade={handlePayment} />
          <Card>
            <CardHeader>
              <CardTitle>🎉 Premium Member</CardTitle>
              <CardDescription>
                You have full access to all premium features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Premium!</h2>
                <p className="text-muted-foreground mb-6">
                  You now have unlimited access to all features including AI chat, diet plans, activity tracking, and more.
                </p>
                <div className="w-full max-w-md mx-auto p-4 border border-border rounded-lg bg-muted/50">
                  <h3 className="font-medium mb-3">Your Premium Benefits:</h3>
                  <ul className="space-y-2 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Unlimited AI chat sessions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Advanced activity tracking</span>
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
        <SubscriptionStatusBar onUpgrade={handlePayment} />
        <Card>
          <CardHeader>
            <CardTitle>{isExpired ? 'Renew Your Premium' : 'Upgrade to Premium'}</CardTitle>
            <CardDescription>
              {isExpired ? 'Your subscription has expired. Renew to continue enjoying premium features.' : 'Unlock all features and get unlimited access'}
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
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Unlimited AI chat sessions</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    id="rzp-button1"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        {isExpired ? 'Renew Now' : 'Pay Now'}
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
