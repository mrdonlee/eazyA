'use client'
import { Button } from '@/components/ui/button'
import { usePolkadot } from '@/components/providers/polkadot'

export default function Home() {
    const { uploadDatasetMutation } = usePolkadot()

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        uploadDatasetMutation()
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={onSubmit}>
                <h1 className="text-2xl font-bold mb-4">Upload Dataset</h1>
                <input type="file" accept=".csv, .json" className="mb-4" />
                <Button type="submit">Upload</Button>
            </form>
        </div>
    )
}
