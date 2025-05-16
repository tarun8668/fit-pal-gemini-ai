
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the request body
    const { planId, userId } = await req.json();

    // Validate the request
    if (!planId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Plan ID and User ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get plan details - in a real app, you'd fetch this from a database
    const plans = {
      'monthly': { name: 'Monthly', amount: 999, currency: 'INR', duration: '1 month' },
      'quarterly': { name: 'Quarterly', amount: 2499, currency: 'INR', duration: '3 months' },
      'yearly': { name: 'Yearly', amount: 7999, currency: 'INR', duration: '1 year' },
    };

    const selectedPlan = plans[planId as keyof typeof plans];
    
    if (!selectedPlan) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // In a real app, you would use the Razorpay API to create an order
    // For demo purposes, we're creating a mock order ID
    const orderId = 'order_' + Math.floor(Math.random() * 1000000);

    // Store order information in the database
    const { data, error } = await supabaseClient
      .from('orders')
      .insert([
        {
          order_id: orderId,
          user_id: userId,
          plan_id: planId,
          amount: selectedPlan.amount,
          currency: selectedPlan.currency,
          status: 'created'
        }
      ]);

    if (error) {
      console.error('Error storing order:', error);
      
      // Return a generic error to the client
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return the order information to the client
    return new Response(
      JSON.stringify({
        orderId,
        amount: selectedPlan.amount,
        currency: selectedPlan.currency,
        planName: selectedPlan.name
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
