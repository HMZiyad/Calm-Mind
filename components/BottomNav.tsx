'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, History } from 'lucide-react';
import styles from './BottomNav.module.css';

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className={styles.nav}>
            <Link href="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}>
                <Home size={24} />
                <span>Home</span>
            </Link>
            <Link href="/progress" className={`${styles.link} ${pathname === '/progress' ? styles.active : ''}`}>
                <BarChart2 size={24} />
                <span>Progress</span>
            </Link>
            <Link href="/history" className={`${styles.link} ${pathname === '/history' ? styles.active : ''}`}>
                <History size={24} />
                <span>History</span>
            </Link>
        </nav>
    );
}
