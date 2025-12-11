import { prisma } from '@/lib/db';
import SessionPlayer from '@/components/SessionPlayer';

// Force dynamic rendering since we fetch user data
export const dynamic = 'force-dynamic';

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const session = await prisma.session.findUnique({
        where: { id: id }
    });

    if (!session) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Session not found</h1>
                <p>Could not load session {id}</p>
            </div>
        );
    }

    // Serialize dates/etc for client component if needed (Prisma date objects are Date, ok for Client Components usually but simpler to pass JSON-serializable)
    // Actually we can pass the session object directly to Client Component in Next.js

    return <SessionPlayer session={session as any} />;
}
