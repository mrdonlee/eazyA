'use client'
import { usePolkadot } from '@/components/providers/polkadot'

export default function Home() {
    const { uploadDatasetMutation } = usePolkadot()

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        uploadDatasetMutation()
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">WEDD: Data Platform</h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-3xl">
                    Manage your datasets and models with ease. Upload, analyze, and deploy your data science projects in
                    one place.
                </p>
            </div>
        </div>
    )
}
