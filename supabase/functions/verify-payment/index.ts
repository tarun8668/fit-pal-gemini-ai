
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts";

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
    console.log("Verify payment function started");
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get the request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body parsed successfully');
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Verify payment request:', requestBody);

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      user_id
    } = requestBody;

    // Validate the request
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !user_id) {
      console.error('Missing required parameters:', { razorpay_payment_id, razorpay_order_id, razorpay_signature, user_id });
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the Razorpay signature to ensure the payment is valid
    const secretKey = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';
    if (!secretKey) {
      console.error('Razorpay secret key not configured');
      return new Response(
        JSON.stringify({ error: 'Payment verification configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = razorpay_order_id + "|" + razorpay_payment_id;
    const hmac = createHmac("sha256", secretKey);
    hmac.update(payload);
    const generatedSignature = hmac.digest("hex");
    const isSignatureValid = generatedSignature === razorpay_signature;

    console.log('Signature verification:', { 
      isValid: isSignatureValid, 
      provided: razorpay_signature, 
      generated: generatedSignature 
    });

    if (!isSignatureValid) {
      console.error('Invalid signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Signature valid, updating order and membership');

    // Get order details to determine subscription details
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .select('plan_id, amount')
      .eq('order_id', razorpay_order_id)
      .eq('user_id', user_id)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Order data retrieved:', orderData);

    // Update order status in the database
    const { error: updateOrderError } = await supabaseClient
      .from('orders')
      .update({ 
        status: 'completed', 
        payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', razorpay_order_id)
      .eq('user_id', user_id);

    if (updateOrderError) {
      console.error('Error updating order:', updateOrderError);
      return new Response(
        JSON.stringify({ error: 'Failed to update order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order updated successfully');

    // Create or update user membership
    const { error: membershipError } = await supabaseClient
      .from('user_memberships')
      .upsert([
        {
          user_id,
          status: 'active',
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          updated_at: new Date().toISOString()
        }
      ], {
        onConflict: 'user_id'
      });

    if (membershipError) {
      console.error('Error updating membership:', membershipError);
      return new Response(
        JSON.stringify({ error: 'Failed to update membership' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Membership activated successfully');

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment verified and membership activated',
        membership: {
          status: 'active',
          plan_id: orderData.plan_id,
          amount: orderData.amount
        }
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
