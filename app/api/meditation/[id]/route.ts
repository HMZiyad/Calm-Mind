import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const { moodAfter, rating } = await request.json();

        const session = await prisma.session.update({
            where: { id },
            data: {
                moodAfter,
                rating: parseInt(rating),
            },
        });

        return NextResponse.json(session);

    } catch (error) {
        console.error('Update Session Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
