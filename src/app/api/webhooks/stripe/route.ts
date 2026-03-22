export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import sgMail from '@sendgrid/mail';

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2026-02-25.clover' });
  if (process.env.SENDGRID_API_KEY) { sgMail.setApiKey(process.env.SENDGRID_API_KEY); }
  const { prisma } = await import('@/lib/prisma');
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Create the Order in DB
    const order = await prisma.order.create({
      data: {
        userId: session.metadata!.userId,
        eventId: session.metadata!.eventId,
        ticketTierId: session.metadata!.ticketTierId,
        quantity: 1,
        totalAmount: (session.amount_total || 0) / 100,
        status: 'PAID',
        stripeSessionId: session.id,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${session.id}` // Placeholder QR service
      },
      include: {
         user: true,
         event: true,
         ticketTier: true
      }
    });

    // Send confirmation email via SendGrid
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key_here') {
       try {
         await sgMail.send({
           to: order.user.email,
           from: 'tickets@eventhub.test', // Requires verified sender in SendGrid
           subject: `Your ticket for ${order.event.title} is confirmed!`,
           html: `
             <h1>Payment Successful</h1>
             <p>Hi ${order.user.name}, your ticket for <strong>${order.event.title}</strong> is confirmed.</p>
             <p>Ticket Type: ${order.ticketTier.name}</p>
             <p>Show this QR Code at the entrance:</p>
             <img src="${order.qrCodeUrl}" alt="QR Ticket" />
             <br/>
             <a href="http://localhost:3000/dashboard">View My Tickets</a>
           `
         });
       } catch (mailErr) {
         console.error('Failed to send SendGrid email:', mailErr);
       }
    }
  }

  return NextResponse.json({ received: true });
}
