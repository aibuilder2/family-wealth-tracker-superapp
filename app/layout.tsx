import type { Metadata } from 'next';
import './globals.css';
import { FamilyProvider } from '@/lib/store/familyStore';
import { UserScopedStorageInit } from '@/components/storage/UserScopedStorageInit';

export const metadata: Metadata = {
  title: 'Family Wealth App — Parivar Finance & Vault',
  description: 'Single app to track family wealth, expenses, udhar, documents, and medical history.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className="min-h-screen bg-[#E7E1D2] antialiased">
        <UserScopedStorageInit />
        <FamilyProvider>
          {children}
        </FamilyProvider>
      </body>
    </html>
  );
}
