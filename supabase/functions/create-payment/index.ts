
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
    // Get the Razorpay keys from environment variables
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay keys not configured');
      return new Response(
        JSON.stringify({ error: 'Razorpay keys not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get the request body
    const requestBody = await req.json();
    const { planId, userId } = requestBody;

    console.log('Create payment request:', { planId, userId });

    // Validate the request
    if (!planId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Plan ID and User ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get plan details - we now only have the monthly plan at ₹399
    const plans = {
      'monthly': { name: 'Monthly', amount: 399, currency: 'INR', duration: '1 month' },
    };

    const selectedPlan = plans[planId as keyof typeof plans];
    
    if (!selectedPlan) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a Razorpay order using their API
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
      },
      body: JSON.stringify({
        amount: selectedPlan.amount * 100, // Razorpay expects amount in paise
        currency: selectedPlan.currency,
        receipt: `receipt_${userId.slice(0, 8)}`,
        notes: {
          plan_id: planId,
          user_id: userId
        }
      })
    });

    if (!razorpayResponse.ok) {
      const razorpayError = await razorpayResponse.text();
      console.error('Razorpay API error:', razorpayError);
      return new Response(
        JSON.stringify({ error: `Failed to create Razorpay order: ${razorpayError}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const razorpayData = await razorpayResponse.json();
    const orderId = razorpayData.id;

    console.log('Razorpay order created:', orderId);

    // Store order information in the database
    const { error } = await supabaseClient
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
        planName: selectedPlan.name,
        key_id: razorpayKeyId
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
