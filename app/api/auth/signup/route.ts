import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, login } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, moodSource, sleepQuality, stressSource, primaryGoal } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                moodSource,
                sleepQuality,
                stressSource,
                primaryGoal,
            },
        });

        // Auto-login after signup
        await login({ id: newUser.id, email: newUser.email, name: newUser.name });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Signup Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
