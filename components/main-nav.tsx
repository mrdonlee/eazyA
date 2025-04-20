import type React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav className={cn('flex items-center space-x-4 lg:space-x-6 mx-4', className)} {...props}>
            <Link
                href="/datasets"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Datasets
            </Link>
            <Link
                href="/models"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Models
            </Link>
        </nav>
    )
}
