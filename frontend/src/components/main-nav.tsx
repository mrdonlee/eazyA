import type React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                Home
            </Link>
            <Link to="/datasets" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Datasets
            </Link>
            <Link to="/models" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Models
            </Link>
            <Link to="/profile" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Profile
            </Link>
        </nav>
    )
}
