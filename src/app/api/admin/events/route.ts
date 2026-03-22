export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function POST(req: NextRequest) {
  const { prisma } = await import('@/lib/prisma');
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_here');
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, description, location, date, ticketTiers } = await req.json();

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        organizerId: payload.userId as string,
        ticketTiers: {
          create: ticketTiers.map((tier: any) => ({
             name: tier.name,
             price: parseFloat(tier.price),
             capacity: parseInt(tier.capacity)
          }))
        }
      },
      include: { ticketTiers: true }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Event Creation Error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
