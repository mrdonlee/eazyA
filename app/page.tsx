'use client'
import { Button } from '@/components/ui/button'
import { usePolkadot } from '@/components/providers/polkadot'
import { useRef } from 'react'

export default function Home() {
    const { uploadDatasetMutation } = usePolkadot()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const file = fileInputRef.current?.files?.[0]
        if (!file) {
            alert('Please select a file.')
            return
        }

        uploadDatasetMutation(file)
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={onSubmit}>
                <h1 className="text-2xl font-bold mb-4">Upload Dataset</h1>
                <input ref={fileInputRef} type="file" accept=".csv, .json" className="mb-4" />
                <Button type="submit">Upload</Button>
            </form>
        </div>
    )
}
