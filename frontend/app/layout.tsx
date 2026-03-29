import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { ToastProvider } from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
  title: 'NEXUS — Autonomous Multi-Agent PM',
  description: 'AI-powered project management with autonomous agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LoadingOverlay />
        <ToastProvider />
        <Navbar />
        <div style={{ display: 'flex', paddingTop: '60px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          <Sidebar />
          <main style={{ flex: 1, marginLeft: '56px', padding: '24px', overflowY: 'auto' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
