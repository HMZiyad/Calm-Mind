'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Clock, Music, User, Play, Loader2 } from 'lucide-react';

const DURATIONS = [5, 10, 15, 20];
const SOUNDS = ['None', 'Rain', 'Ocean'];
const TYPES = ['Guided', 'Breathwork', 'Body Scan'];

function MeditateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlMood = searchParams.get('mood');
    const detailedMood = searchParams.get('detail');
    const urlType = searchParams.get('type');
    const urlDuration = searchParams.get('duration');

    const [mood, setMood] = useState(urlMood || '');
    const [duration, setDuration] = useState(urlDuration ? parseInt(urlDuration) : 10);
    const [sound, setSound] = useState('Rain');
    const [type, setType] = useState(urlType || 'Guided');
    const [loading, setLoading] = useState(false);

    // Update state if URL changes
    useEffect(() => {
        if (urlMood) setMood(urlMood);
        if (urlType) setType(urlType);
        if (urlDuration) setDuration(parseInt(urlDuration));
    }, [urlMood, urlType, urlDuration]);

    const handleStartSession = async () => {
        if (!mood) {
            alert('Please select how you are feeling.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/meditation/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mood,
                    detailedMood,
                    duration,
                    type,
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || errData.details || 'Failed to generate session');
            }

            const data = await res.json();
            router.push(`/session/${data.sessionId}?sound=${sound}`);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Failed to start session');
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <header style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Customize Session</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                    {mood ? `For ${mood.toLowerCase()}` : 'How are you feeling today?'} {detailedMood ? `(${detailedMood.toLowerCase()})` : ''}
                </p>
            </header>

            {/* Mood Selector (Only if not provided in URL) */}
            {!urlMood && (
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                        <User size={20} color="var(--color-primary)" /> Current Mood
                    </h3>
                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                        {['Stressed', 'Anxious', 'Tired', 'Happy', 'Neutral', 'Focus'].map(m => (
                            <button
                                key={m}
                                onClick={() => setMood(m)}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: 'var(--radius)',
                                    border: mood === m ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                    backgroundColor: mood === m ? '#F0FDF4' : 'transparent',
                                    color: mood === m ? 'var(--color-primary)' : 'var(--color-text-main)',
                                    cursor: 'pointer',
                                    fontWeight: mood === m ? '600' : '400',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                    <Clock size={20} color="var(--color-primary)" /> Duration
                </h3>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                    {DURATIONS.map(d => (
                        <button
                            key={d}
                            onClick={() => setDuration(d)}
                            style={{
                                padding: '0.6rem 1.2rem',
                                borderRadius: 'var(--radius)',
                                border: duration === d ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                backgroundColor: duration === d ? '#F0FDF4' : 'transparent', // Light green tint
                                color: duration === d ? 'var(--color-primary)' : 'var(--color-text-main)',
                                cursor: 'pointer',
                                fontWeight: duration === d ? '600' : '400',
                                transition: 'all 0.2s'
                            }}
                        >
                            {d} min
                        </button>
                    ))}
                </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                    <Music size={20} color="var(--color-primary)" /> Background Sound
                </h3>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                    {SOUNDS.map(s => (
                        <button
                            key={s}
                            onClick={() => setSound(s)}
                            style={{
                                padding: '0.6rem 1.2rem',
                                borderRadius: 'var(--radius)',
                                border: sound === s ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                backgroundColor: sound === s ? '#F0FDF4' : 'transparent',
                                color: sound === s ? 'var(--color-primary)' : 'var(--color-text-main)',
                                cursor: 'pointer',
                                fontWeight: sound === s ? '600' : '400',
                                transition: 'all 0.2s'
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                    <User size={20} color="var(--color-primary)" /> Meditation Type
                </h3>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                    {TYPES.map(t => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            style={{
                                padding: '0.6rem 1.2rem',
                                borderRadius: 'var(--radius)',
                                border: type === t ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                backgroundColor: type === t ? '#F0FDF4' : 'transparent',
                                color: type === t ? 'var(--color-primary)' : 'var(--color-text-main)',
                                cursor: 'pointer',
                                fontWeight: type === t ? '600' : '400',
                                transition: 'all 0.2s'
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <button
                className="btn btn-primary"
                onClick={handleStartSession}
                disabled={loading}
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" style={{ marginRight: '8px' }} />
                        Creating your session...
                    </>
                ) : (
                    <>
                        <Play style={{ marginRight: '8px' }} />
                        Start Session
                    </>
                )}
            </button>
        </div>
    );
}

export default function MeditatePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MeditateContent />
        </Suspense>
    );
}
