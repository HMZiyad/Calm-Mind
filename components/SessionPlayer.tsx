'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Play, Pause, X, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Using placeholders for demo
const AMBIENT_SOUNDS: Record<string, string> = {
    'Rain': 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
    'Ocean': 'https://actions.google.com/sounds/v1/water/waves_crashing.ogg',
    'None': '',
};

export default function SessionPlayer({ session }: { session: any }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const soundType = searchParams.get('sound') || 'None';

    const [timeLeft, setTimeLeft] = useState(session.duration * 60); // Seconds
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const [rating, setRating] = useState(0);
    const [moodAfter, setMoodAfter] = useState('');

    const ambientRef = useRef<HTMLAudioElement>(null); // Background
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Initialize Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const [currentSentence, setCurrentSentence] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // New state for sequencing
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [isPlayingSentence, setIsPlayingSentence] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 1. Split script into clean sentences
    useEffect(() => {
        if (session.script) {
            // Split by punctuation followed by space or end of string, keeping the delimiter
            const regex = /([^.!?]+[.!?]+)(\s+|$)/g;
            const matches = [...session.script.matchAll(regex)];
            let msgs: string[] = [];

            if (matches.length > 0) {
                msgs = matches.map(m => m[0].trim());
            } else {
                msgs = [session.script];
            }

            setMessages(msgs);
            setCurrentSentenceIndex(0); // Reset index on new script
        }
    }, [session.script]);

    // 2. Main Sequencer Effect (The "Show then Speak" logic)
    useEffect(() => {
        // If paused or unmounted, cancel everything
        if (!isActive) {
            window.speechSynthesis.cancel();
            setIsPlayingSentence(false);
            return;
        }

        // Check if finished
        if (currentSentenceIndex >= messages.length && messages.length > 0) {
            handleComplete();
            return;
        }

        const textToSpeak = messages[currentSentenceIndex];
        if (!textToSpeak) return;

        // A. Update Display Immediately
        setCurrentSentence(textToSpeak);

        let utterance: SpeechSynthesisUtterance;
        let timer: NodeJS.Timeout;

        // B. Define Speak Function
        const speak = () => {
            if (!isActive) return; // Double check

            utterance = new SpeechSynthesisUtterance(textToSpeak);
            (window as any).currentUtterance = utterance; // GC prevention

            utterance.rate = 0.85;
            utterance.pitch = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v =>
                v.name.includes('Google US English') ||
                v.name.includes('Samantha') ||
                v.name.includes('Neural')
            );
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.onend = () => {
                setIsPlayingSentence(false);
                // Move to next sentence automatically
                setCurrentSentenceIndex(prev => prev + 1);
            };

            utterance.onerror = (e) => {
                if (e.error !== 'canceled' && e.error !== 'interrupted') {
                    console.error("TTS Error", e);
                }
                setIsPlayingSentence(false);
                // Try move next anyway to avoid stuck state
                setCurrentSentenceIndex(prev => prev + 1);
            };

            window.speechSynthesis.speak(utterance);
            setIsPlayingSentence(true);
        };

        // C. Wait 1000ms then Speak
        timer = setTimeout(() => {
            speak();
        }, 1000); // 1 second delay for reading

        return () => {
            clearTimeout(timer);
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [isActive, currentSentenceIndex, messages]);

    // 3. Ensure voices are loaded (Chrome quirk)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loadVoice = () => {
                window.speechSynthesis.getVoices();
            };
            loadVoice();
            window.speechSynthesis.onvoiceschanged = loadVoice;
        }
    }, []);

    // 4. Handle Ambient Sound Play/Pause independently
    useEffect(() => {
        if (isActive) {
            ambientRef.current?.play().catch(e => console.log('Ambient play error', e));
        } else {
            ambientRef.current?.pause();
        }
    }, [isActive]);

    const handleComplete = () => {
        setIsActive(false);
        setIsCompleted(true);
    };

    const submitReview = async () => {
        try {
            await fetch(`/api/meditation/${session.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, moodAfter }),
            });
            router.push('/progress');
        } catch (e) {
            console.error(e);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (isCompleted) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.8)', zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div className="card" style={{ width: '90%', maxWidth: '400px', textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '1rem' }}>
                    <h2 style={{ marginBottom: '1rem', color: '#0F172A' }}>Session Complete</h2>
                    <p style={{ marginBottom: '2rem', color: '#64748B' }}>Congratulations! How do you feel now?</p>

                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={32}
                                fill={star <= rating ? '#FBBF24' : 'none'}
                                color={star <= rating ? '#FBBF24' : '#94A3B8'}
                                cursor="pointer"
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <p style={{ marginBottom: '0.5rem', color: '#64748B' }}>Mood after session:</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                            {['Excellent', 'Good', 'Average', 'Bad', 'Worst'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => setMoodAfter(m)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '1rem',
                                        backgroundColor: moodAfter === m ? '#0EA5E9' : '#F1F5F9',
                                        color: moodAfter === m ? 'white' : '#1E293B',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        className="btn"
                        onClick={submitReview}
                        disabled={!rating || !moodAfter}
                        style={{ width: '100%', backgroundColor: '#0EA5E9', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
                    >
                        Save Progress
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            height: '100vh',
            background: 'linear-gradient(180deg, #E0F2FE 0%, #FFFFFF 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '20px'
        }}>
            {/* Audio Element for Ambient Only */}
            {AMBIENT_SOUNDS[soundType] && (
                <audio
                    ref={ambientRef}
                    src={AMBIENT_SOUNDS[soundType]}
                    loop
                />
            )}

            {/* Close Button */}
            <button
                onClick={() => router.back()}
                style={{
                    position: 'absolute', top: '2rem', right: '2rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#64748B',
                    zIndex: 10
                }}
            >
                <X size={32} />
            </button>

            {/* Main Timer Display */}
            <div style={{
                width: '150px', height: '150px',
                borderRadius: '50%',
                border: '4px solid white',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.3)',
                marginBottom: '1.5rem',
                transition: 'all 0.5s ease'
            }}>
                <span style={{
                    fontSize: '2.5rem',
                    fontWeight: '200',
                    color: '#0EA5E9',
                    fontVariantNumeric: 'tabular-nums'
                }}>
                    {formatTime(timeLeft)}
                </span>
            </div>

            <h2 style={{ marginBottom: '1rem', color: '#64748B', fontWeight: 'normal' }}>
                {isActive ? 'Details...' : (timeLeft === session.duration * 60 ? 'Ready?' : 'Paused')}
            </h2>

            <button
                onClick={() => setIsActive(!isActive)}
                style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    backgroundColor: '#0EA5E9', color: 'white',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    marginBottom: '2rem'
                }}
            >
                {isActive ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" style={{ marginLeft: '4px' }} />}
            </button>

            {/* Subtitle / Script Display with Animation */}
            <div style={{
                width: '100%',
                maxWidth: '700px',
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem',
                position: 'relative'
            }}>
                <AnimatePresence mode='wait'>
                    <motion.p
                        key={currentSentence}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            fontSize: '1.5rem',
                            lineHeight: '1.6',
                            color: '#334155',
                            fontWeight: '500',
                        }}
                    >
                        {currentSentence}
                    </motion.p>
                </AnimatePresence>
            </div>

            <p style={{ marginTop: '2rem', color: '#94A3B8', fontSize: '0.75rem' }}>
                Spoken by {isMounted ? 'Device Voice' : 'Browser'}
            </p>
        </div>
    );
}
