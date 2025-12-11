import './globals.css';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Navbar from '../components/Navbar';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Calm Mind',
    description: 'AI-assisted personalized meditation',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={outfit.className} style={{ margin: 0, padding: 0, backgroundColor: '#F8FAFC' }}>
                <Navbar />
                <main style={{ paddingTop: '80px', minHeight: '100vh', width: '100%' }}>
                    {children}
                </main>
            </body>
        </html>
    );
}
