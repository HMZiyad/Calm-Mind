'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Wind, Moon, Sun, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const [userName, setUserName] = useState('Friend');

    // In a real app, we'd fetch the user profile here
    useEffect(() => {
        // Check if we have a session cookie roughly by verifying if we can access protected routes
        // Or just check if name is in localStorage (simple hack for now) or fetch from API
        // For now, let's just assume we are logged in or redirect
    }, []);

    const timeOfDay = () => {
        const hr = new Date().getHours();
        if (hr < 12) return 'Good morning';
        if (hr < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text-main)' }}>
            {/* Hero Section */}
            <section style={{
                background: '#F0FDF4', // Very light mint/green tint
                padding: '8rem 0 6rem',
                borderBottom: '1px solid var(--color-border)'
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem' }}>
                    <div style={{ maxWidth: '600px' }}>
                        <h1 style={{
                            fontSize: '4rem',
                            fontWeight: '700',
                            color: 'var(--color-text-main)',
                            marginBottom: '1.5rem',
                            lineHeight: '1.1',
                            letterSpacing: '-0.04em'
                        }}>
                            {timeOfDay()}, {userName}.<br />
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.6em', fontWeight: '400', display: 'block', marginTop: '1rem' }}>
                                Find your clarity today.
                            </span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                            Your mind is a sky. Clouds pass, but the sky remains. We help you find the blue sky behind the clouds through personalized meditation.
                        </p>
                        <button
                            onClick={() => router.push('/meditate')}
                            className="btn btn-primary"
                            style={{
                                fontSize: '1.1rem',
                                padding: '1rem 2rem',
                                boxShadow: '0 10px 15px -3px rgba(4, 102, 69, 0.2)'
                            }}
                        >
                            <Play size={20} style={{ marginRight: '0.5rem' }} /> Start Daily Session
                        </button>
                    </div>

                    {/* Abstract Illustration Placeholder */}
                    <div style={{
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle at center, #D1FAE5 0%, transparent 70%)',
                        borderRadius: '50%',
                        opacity: 0.8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            width: '300px',
                            height: '400px',
                            background: '#046645',
                            borderRadius: '200px 200px 20px 20px',
                            opacity: 0.1
                        }} />
                    </div>
                </div>
            </section>

            {/* Recommended for You */}
            <section className="section">
                <div className="container">
                    <h2 style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '2rem' }}>Recommended for you</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Card 1: Quick Calm */}
                        <div
                            onClick={() => router.push('/meditate?mood=Anxious&type=Guided&duration=5')}
                            style={{
                                background: 'white', padding: '2rem', borderRadius: '1rem',
                                cursor: 'pointer', transition: 'all 0.2s',
                                border: '1px solid var(--color-border)',
                                display: 'flex', flexDirection: 'column', height: '100%'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#D97706' }}>
                                <Sun size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Daily De-stress</h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', flex: 1 }}>Reduce anxiety and find focus in just 5 minutes.</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                                Start Now <Play size={16} />
                            </div>
                        </div>

                        {/* Card 2: Sleep Prep */}
                        <div
                            onClick={() => router.push('/meditate?mood=Tired&type=Guided&duration=15')}
                            style={{
                                background: 'white', padding: '2rem', borderRadius: '1rem',
                                cursor: 'pointer', transition: 'all 0.2s',
                                border: '1px solid var(--color-border)',
                                display: 'flex', flexDirection: 'column', height: '100%'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#4F46E5' }}>
                                <Moon size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Deep Sleep</h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', flex: 1 }}>Wind down your mind and body for a restful night.</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                                Start Now <Play size={16} />
                            </div>
                        </div>

                        {/* Card 3: Breathwork */}
                        <div
                            onClick={() => router.push('/meditate?mood=Stressed&type=Breathwork&duration=3')}
                            style={{
                                background: 'white', padding: '2rem', borderRadius: '1rem',
                                cursor: 'pointer', transition: 'all 0.2s',
                                border: '1px solid var(--color-border)',
                                display: 'flex', flexDirection: 'column', height: '100%'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#16A34A' }}>
                                <Wind size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Quick Breathwork</h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', flex: 1 }}>Reset your nervous system with box breathing.</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                                Start Now <Play size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats & Quote Section (Two Columns) */}
            <section className="section section-alt">
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>

                    {/* Stats */}
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>Your Journey</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '1rem',
                                border: '1px solid var(--color-border)'
                            }}>
                                <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>12</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: '500' }}>Sessions Completed</div>
                            </div>
                            <div style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '1rem',
                                border: '1px solid var(--color-border)'
                            }}>
                                <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>145</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: '500' }}>Mindful Minutes</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <Link href="/history" className="btn btn-outline">View Full History</Link>
                        </div>
                    </div>

                    {/* Daily Insight */}
                    <div style={{
                        background: '#FFF7ED',
                        padding: '3rem',
                        borderRadius: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            fontSize: '10rem',
                            color: '#FFEDD5',
                            opacity: 0.5,
                            fontFamily: 'serif'
                        }}>”</div>

                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#9A3412', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Insight</h2>
                        <p style={{ fontStyle: 'italic', color: '#431407', fontSize: '1.5rem', lineHeight: '1.4', marginBottom: '2rem', zIndex: 1 }}>
                            "Peace comes from within. Do not seek it without."
                        </p>
                        <p style={{ marginTop: 'auto', textAlign: 'right', fontWeight: '600', color: '#9A3412' }}>— Buddha</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
