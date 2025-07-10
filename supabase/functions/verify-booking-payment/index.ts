import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();

    if (!session_id) {
      throw new Error("Session ID is required");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      throw new Error("Session not found");
    }

    // Find the booking by session ID
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('*')
      .eq('stripe_session_id', session_id)
      .single();

    if (bookingError || !booking) {
      throw new Error("Booking not found");
    }

    // Update booking status based on payment status
    let bookingStatus = booking.booking_status;
    let paymentStatus = booking.payment_status;

    if (session.payment_status === 'paid') {
      bookingStatus = 'confirmed';
      paymentStatus = 'paid';
    } else if (session.payment_status === 'unpaid') {
      paymentStatus = 'failed';
    }

    // Update the booking
    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update({
        booking_status: bookingStatus,
        payment_status: paymentStatus,
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .eq('id', booking.id);

    if (updateError) {
      throw new Error(`Failed to update booking: ${updateError.message}`);
    }

    // Get updated booking with room details
    const { data: updatedBooking } = await supabaseClient
      .from('bookings')
      .select(`
        *,
        rooms (
          name,
          description,
          image_url
        )
      `)
      .eq('id', booking.id)
      .single();

    return new Response(JSON.stringify({
      booking: updatedBooking,
      payment_status: session.payment_status,
      session
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error in verify-booking-payment:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});