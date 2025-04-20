'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import './globals.css'

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
            <body className={`${inter.variable} font-inter antialiased`}>
                <QueryClientProvider client={queryClient}>
                    <PolkadotProvider>{children}</PolkadotProvider>
                </QueryClientProvider>
            </body>
        </html>
    )
}
