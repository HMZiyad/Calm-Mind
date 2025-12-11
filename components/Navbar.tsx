'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', // Center the container
            zIndex: 100,
            transition: 'all 0.3s ease',
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%'
            }}>
                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>C</div>
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: 'var(--color-text-main)',
                        letterSpacing: '-0.02em'
                    }}>Calm Mind</span>
                </Link>

                {/* Links */}
                <div style={{ display: 'flex', gap: '2rem' }}>
                    {['/', '/meditate', '/progress', '/history'].map((path) => {
                        const label = path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2);
                        const active = isActive(path);
                        return (
                            <Link key={path} href={path} style={{
                                textDecoration: 'none',
                                color: active ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                fontWeight: active ? '600' : '500',
                                fontSize: '0.95rem',
                                transition: 'color 0.2s',
                                padding: '0.5rem 0',
                                borderBottom: active ? '2px solid var(--color-primary)' : '2px solid transparent'
                            }}>
                                {label}
                            </Link>
                        );
                    })}
                </div>

                {/* Profile / CTAs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--color-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-main)',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        border: '1px solid var(--color-border)'
                    }}>
                        MB
                    </div>

                    <button
                        onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            window.location.href = '/login';
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
