import { NextResponse } from 'next/server';
import { generateMeditationScript } from '@/lib/gemini';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('API Request Body:', body);
        const { mood, detailedMood, type, duration } = body;

        // Auth Check
        console.log('Checking auth...');
        const sessionData = await getSession();
        console.log('Session Data:', sessionData);

        if (!sessionData?.user) {
            console.error('Unauthorized: No user in session');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = sessionData.user.id;

        // Fetch User Context
        console.log(`Fetching user ${userId}...`);
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            console.error('User not found in DB');
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!mood || !duration) {
            console.error('Missing fields:', { mood, duration });
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Generate Script with Context
        console.log(`Generating script for ${user.name} (Mood: ${mood})`);

        // Enhance context with user profile
        const context = `User Profile: Name is ${user.name}. 
                         General State: ${user.moodSource}. 
                         Sleep Quality: ${user.sleepQuality}. 
                         Main Stressor: ${user.stressSource}. 
                         Goal: ${user.primaryGoal}.
                         Current Request: ${detailedMood || ''}.`;

        let script = 'Default meditation script...';
        try {
            script = await generateMeditationScript(mood, context, type || 'Guided', duration);
            console.log('Script generated successfully');
        } catch (scriptError) {
            console.error('Gemini Error:', scriptError);
            // Optionally fail or fallback? For now let's fail to see the error.
            return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
        }

        // 2. Save to DB with Relation
        console.log('Saving session to DB...');
        const session = await prisma.session.create({
            data: {
                moodBefore: mood,
                moodDetailed: detailedMood,
                duration: parseInt(duration),
                type: type || 'Guided',
                script: script,
                userId: userId,
            },
        });
        console.log(`Session created: ${session.id}`);

        return NextResponse.json({
            sessionId: session.id,
            script: session.script,
        });

    } catch (error) {
        console.error('API Crashing Error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Internal Server Error',
            details: String(error)
        }, { status: 500 });
    }
}
