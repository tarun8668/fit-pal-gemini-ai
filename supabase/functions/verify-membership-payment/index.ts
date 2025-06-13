
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
    console.log("Verify membership payment function started");
    
    // Create a Supabase client using service role key for admin operations
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

    console.log('Verify membership payment request:', requestBody);

    const { 
      payment_id, 
      user_id,
      amount,
      plan_type = 'monthly',
      duration_months = 1
    } = requestBody;

    // Validate the request
    if (!payment_id || !user_id) {
      console.error('Missing required parameters:', { payment_id, user_id });
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: payment_id and user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Payment verification starting for user:', user_id);

    // Calculate expiration date based on plan type
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + duration_months);

    // Check if user already has an active membership
    const { data: existingMembership, error: membershipError } = await supabaseClient
      .from('user_memberships')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (membershipError && membershipError.code !== 'PGRST116') {
      console.error('Error checking existing membership:', membershipError);
      return new Response(
        JSON.stringify({ error: 'Failed to check existing membership' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If user has existing membership, extend the expiration date
    let finalExpiresAt = expiresAt;
    if (existingMembership && existingMembership.expires_at) {
      const currentExpiry = new Date(existingMembership.expires_at);
      // If current membership hasn't expired, extend from current expiry date
      if (currentExpiry > now) {
        finalExpiresAt = new Date(currentExpiry);
        finalExpiresAt.setMonth(finalExpiresAt.getMonth() + duration_months);
      }
    }

    console.log('Final expiration date calculated:', finalExpiresAt);

    // Create or update user membership
    const membershipData = {
      user_id,
      status: 'active',
      payment_id,
      expires_at: finalExpiresAt.toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: upsertError } = await supabaseClient
      .from('user_memberships')
      .upsert(membershipData, {
        onConflict: 'user_id'
      });

    if (upsertError) {
      console.error('Error updating membership:', upsertError);
      return new Response(
        JSON.stringify({ error: 'Failed to update membership' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Membership activated successfully for user:', user_id);

    // Optional: Create an order record for tracking
    if (amount) {
      const orderData = {
        user_id,
        payment_id,
        amount: parseInt(amount),
        currency: 'INR',
        plan_id: plan_type,
        status: 'completed',
        order_id: `order_${Date.now()}_${user_id.slice(0, 8)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: orderError } = await supabaseClient
        .from('orders')
        .insert(orderData);

      if (orderError) {
        console.error('Error creating order record:', orderError);
        // Don't fail the whole operation for order tracking issues
      } else {
        console.log('Order record created successfully');
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment verified and membership activated',
        membership: {
          status: 'active',
          expires_at: finalExpiresAt.toISOString(),
          plan_type
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
