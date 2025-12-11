import { prisma } from '@/lib/db';
import { Calendar, Clock, Smile } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
    const sessions = await prisma.session.findMany({
        orderBy: { createdAt: 'desc' },
        // Show all sessions that were at least started
    });

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <header style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Your Journey</h1>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sessions.length === 0 ? (
                    <p style={{ color: 'var(--color-text-light)', textAlign: 'center' }}>No sessions yet.</p>
                ) : (
                    sessions.map((session) => (
                        <div key={session.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 600 }}>{session.moodBefore}</span>
                                    {session.moodDetailed && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>({session.moodDetailed})</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={12} /> {new Date(session.createdAt).toLocaleDateString()}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={12} /> {session.duration}m
                                    </span>
                                </div>
                            </div>

                            {session.rating && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#FEF3C7', padding: '4px 8px', borderRadius: '12px' }}>
                                    <span style={{ color: '#D97706', fontWeight: 'bold' }}>{session.rating}</span>
                                    <Smile size={16} color="#D97706" />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
