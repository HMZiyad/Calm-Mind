'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
// import { Users, Moon, Zap, Target } from "lucide-react"; // Icons if needed

// Psychologically grounded questions
const STEPS = [
    {
        id: 'moodSource',
        question: "How have you been feeling lately?",
        subtitle: "There is no wrong answer. Be honest with yourself.",
        options: [
            { label: "Calm & Centered", value: "calm" },
            { label: "Anxious or Worried", value: "anxious" },
            { label: "Low Energy / Sad", value: "low_energy" },
            { label: "Overwhelmed / Stressed", value: "overwhelmed" },
        ]
    },
    {
        id: 'sleepQuality',
        question: "How would you rate your sleep?",
        subtitle: "Sleep is the foundation of mental health.",
        options: [
            { label: "Restful & Consistent", value: "good" },
            { label: "Difficulty falling asleep", value: "onset_insomnia" },
            { label: "Waking up tired", value: "poor_quality" },
            { label: "Insomnia / Disrupted", value: "insomnia" },
        ]
    },
    {
        id: 'stressSource',
        question: "What is currently occupying your mind?",
        subtitle: "Identifying the source is the first step to release.",
        options: [
            { label: "Work / Career", value: "work" },
            { label: "Relationships / Family", value: "relationships" },
            { label: "Health / Body", value: "health" },
            { label: "Future Uncertainty", value: "future" },
            { label: "Just General Noise", value: "general" },
        ]
    },
    {
        id: 'primaryGoal',
        question: "What brings you here today?",
        subtitle: "Let's set an intention for your journey.",
        options: [
            { label: "Reduce Stress & Anxiety", value: "reduce_stress" },
            { label: "Improve Focus & Clarity", value: "focus" },
            { label: "Better Sleep", value: "sleep" },
            { label: "Process Emotions", value: "emotions" },
            { label: "Just Curious", value: "curiosity" },
        ]
    },
    {
        id: 'signup',
        question: "Create your Account",
        subtitle: "Save your profile to track your progress.",
        isForm: true
    }
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        moodSource: '',
        sleepQuality: '',
        stressSource: '',
        primaryGoal: '',
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const stepData = STEPS[currentStep];

    const handleOptionSelect = (value: string) => {
        setFormData({ ...formData, [stepData.id]: value });
        if (currentStep < STEPS.length - 1) {
            setTimeout(() => setCurrentStep(prev => prev + 1), 300); // Slight delay for effect
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Signup failed');

            // Redirect to Dashboard
            router.push('/');
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Outfit", sans-serif' }}>
            <div style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {!stepData.isForm ? (
                            <div style={{ textAlign: 'center' }}>
                                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#0F172A', fontWeight: '600' }}>{stepData.question}</h1>
                                <p style={{ fontSize: '1.2rem', color: '#64748B', marginBottom: '3rem' }}>{stepData.subtitle}</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                    {stepData.options?.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleOptionSelect(opt.value)}
                                            style={{
                                                padding: '1.5rem',
                                                borderRadius: '1rem',
                                                border: '2px solid transparent',
                                                background: 'white',
                                                color: '#334155',
                                                fontSize: '1.2rem',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                                transition: 'all 0.2s',
                                                textAlign: 'left',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.borderColor = '#0EA5E9';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'none';
                                                e.currentTarget.style.borderColor = 'transparent';
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Signup Form Step
                            <div style={{ background: 'white', padding: '3rem', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#0F172A' }}>{stepData.question}</h2>
                                <p style={{ color: '#64748B', marginBottom: '2rem' }}>{stepData.subtitle}</p>

                                {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}

                                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569' }}>Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '1rem' }}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569' }}>Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '1rem' }}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569' }}>Password</label>
                                        <input
                                            type="password"
                                            required
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '1rem' }}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            marginTop: '1rem',
                                            padding: '1rem',
                                            borderRadius: '0.5rem',
                                            background: '#0EA5E9',
                                            color: 'white',
                                            border: 'none',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            opacity: loading ? 0.7 : 1
                                        }}
                                    >
                                        {loading ? 'Creating Account...' : 'Start My Journey'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                {!stepData.isForm && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                        {STEPS.map((_, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: '8px', height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: idx === currentStep ? '#0EA5E9' : '#CBD5E1',
                                    transition: 'background-color 0.3s'
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
