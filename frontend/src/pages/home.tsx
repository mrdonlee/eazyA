import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Data Platform</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-3xl">
                Manage your datasets and models with ease. Upload, analyze, and deploy your data science projects in one place.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                    <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link to="/signup">Sign Up</Link>
                </Button>
            </div>
        </div>
    )
}
