import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateSpeech } from '../../../../../lib/elevenlabs';

// Dynamic route handler
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await prisma.session.findUnique({
            where: { id },
        });

        if (!session || !session.script) {
            return NextResponse.json({ error: 'Session or script not found' }, { status: 404 });
        }

        console.log(`Generating audio for session: ${id}`);
        const audioBuffer = await generateSpeech(session.script);

        return new Response(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error('Audio Generation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
