import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
    const sessions = await prisma.session.findMany({});

    // 1. Calculate Mood Frequency (Before)
    const moodBeforeCounts: Record<string, number> = {};
    sessions.forEach(s => {
        moodBeforeCounts[s.moodBefore] = (moodBeforeCounts[s.moodBefore] || 0) + 1;
    });

    // Sort by count desc
    const sortedMoodBefore = Object.entries(moodBeforeCounts)
        .sort(([, a], [, b]) => b - a);

    const maxCountBefore = Math.max(...Object.values(moodBeforeCounts), 1);

    // 2. Calculate Mood After Frequency
    const moodAfterCounts: Record<string, number> = {};
    sessions.forEach(s => {
        if (s.moodAfter) {
            moodAfterCounts[s.moodAfter] = (moodAfterCounts[s.moodAfter] || 0) + 1;
        }
    });

    // Order: Excellent, Good, Average, Bad, Worst
    const moodOrder = ['Excellent', 'Good', 'Average', 'Bad', 'Worst'];
    const maxCountAfter = Math.max(...Object.values(moodAfterCounts), 1);

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <header style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Progress</h1>
            </header>

            {/* Mood Before Chart */}
            <section className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Moods Checked-in</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sortedMoodBefore.map(([mood, count]) => (
                        <div key={mood}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                                <span>{mood}</span>
                                <span style={{ color: 'var(--color-text-light)' }}>{count}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${(count / maxCountBefore) * 100}%`,
                                    height: '100%',
                                    background: 'var(--color-primary)',
                                    borderRadius: '4px'
                                }} />
                            </div>
                        </div>
                    ))}
                    {sortedMoodBefore.length === 0 && <p>No data yet.</p>}
                </div>
            </section>

            {/* Mood After Chart */}
            <section className="card">
                <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>How you felt after</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {moodOrder.map((mood) => {
                        const count = moodAfterCounts[mood] || 0;
                        if (count === 0 && sessions.length < 5) return null; // Hide empty if few sessions, else show 0

                        return (
                            <div key={mood}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                                    <span>{mood}</span>
                                    <span style={{ color: 'var(--color-text-light)' }}>{count}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(count / maxCountAfter) * 100}%`,
                                        height: '100%',
                                        background: mood === 'Excellent' || mood === 'Good' ? '#34D399' : (mood === 'Average' ? '#FBBF24' : '#F87171'),
                                        borderRadius: '4px'
                                    }} />
                                </div>
                            </div>
                        );
                    })}
                    {Object.keys(moodAfterCounts).length === 0 && <p>No data yet.</p>}
                </div>
            </section>
        </div>
    );
}
