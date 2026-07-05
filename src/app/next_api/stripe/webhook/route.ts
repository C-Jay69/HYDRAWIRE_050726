import { NextResponse } from 'next/server';
import { stripe } from '@zoerai/integration';
import type { WebhookVerificationResult } from '@zoerai/integration';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // If Stripe webhook secret is not configured, skip verification in demo mode
    if (!webhookSecret || webhookSecret === 'your_stripe_webhook_secret') {
      console.log('Webhook secret not configured - demo mode');
      return NextResponse.json({ received: true, demo: true });
    }

    const payload = await request.text();

    const verifyResult: WebhookVerificationResult = await stripe.verifyWebhook({
      webhookSecret,
      request: {
        payload,
        signature,
        webhookSecret,
      },
    });

    if (!verifyResult.success) {
      console.error('Webhook verification failed:', verifyResult.error);
      return NextResponse.json(
        { error: 'Webhook verification failed' },
        { status: 400 }
      );
    }

    const event = verifyResult.data;

    if (!event) {
      return NextResponse.json({ received: true });
    }

    console.log(`Received webhook: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data?.object;
        if (!session) break;
        console.log('Checkout completed:', session.id);

        // Handle successful payment
        // In a real app, you would:
        // 1. Update database with order/payment status
        // 2. Grant credits or update subscription
        // 3. Send confirmation email

        const metadata = (session as any).metadata || {};
        if (metadata.credits) {
          console.log(`Granting ${metadata.credits} credits to user`);
          // await grantCredits(metadata.user_id, parseInt(metadata.credits));
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data?.object;
        if (!subscription) break;
        console.log(`Subscription ${event.type}:`, (subscription as any).id);

        // Update subscription status in database
        // await updateSubscription(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data?.object;
        if (!subscription) break;
        console.log('Subscription cancelled:', (subscription as any).id);

        // Mark subscription as cancelled in database
        // await cancelSubscription(subscription.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data?.object;
        if (!invoice) break;
        console.log('Invoice paid:', (invoice as any).id);

        // Record payment and extend subscription period
        // await recordPayment(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data?.object;
        if (!invoice) break;
        console.log('Invoice payment failed:', (invoice as any).id);

        // Handle failed payment - notify user
        // await handleFailedPayment(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
