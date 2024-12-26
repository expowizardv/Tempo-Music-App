import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import Stripe from 'https://esm.sh/stripe@13.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Record the event
    await supabase
      .from('stripe_events')
      .insert({ id: event.id, type: event.type });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.payment_status === 'paid') {
          await supabase
            .from('profiles')
            .update({
              subscription_tier: 'premium',
              subscription_status: 'active',
              subscription_period_end: null // Lifetime access
            })
            .eq('id', session.client_reference_id);
        }
        break;
      }
    }

    // Update event status
    await supabase
      .from('stripe_events')
      .update({ status: 'processed' })
      .eq('id', event.id);

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    );
  }
});