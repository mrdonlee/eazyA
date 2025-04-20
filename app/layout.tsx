'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import './globals.css'
import { MainNav } from '@/components/main-nav'
import { UserNav } from '@/components/user-nav'

export const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const PolkadotProvider = dynamic(() => import('@/components/providers/polkadot'), {
    ssr: false,
})

const queryClient = new QueryClient()

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-inter antialiased dark`}>
                <header className="sticky top-0 z-50 border-b bg-background">
                    <div className="flex h-16 items-center px-4 md:px-6">
                        <MainNav />
                        <div className="ml-auto flex items-center space-x-4">
                            <UserNav />
                        </div>
                    </div>
                </header>
                <main className="flex-1">
                    <QueryClientProvider client={queryClient}>
                        <PolkadotProvider>{children}</PolkadotProvider>
                    </QueryClientProvider>
                </main>
            </body>
        </html>
    )
}
