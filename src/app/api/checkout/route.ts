export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2026-02-25.clover' });
  const { prisma } = await import('@/lib/prisma');
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Please log in to purchase tickets.' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_here');
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const { eventId, ticketTierId } = await req.json();

    const ticketTier = await prisma.ticketTier.findUnique({ where: { id: ticketTierId }, include: { event: true }});
    if (!ticketTier) return NextResponse.json({ error: 'Ticket tier not found' }, { status: 404 });

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your_key_here') {
      return NextResponse.json({ error: 'Platform not configured for live payments yet.' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${ticketTier.event.title} - ${ticketTier.name}`,
            },
            unit_amount: Math.round(ticketTier.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/events/${eventId}?canceled=true`,
      metadata: {
        userId,
        eventId,
        ticketTierId
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
