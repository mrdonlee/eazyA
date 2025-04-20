'use server'
import { Storage } from '@google-cloud/storage'
import { GoogleAuth } from 'google-auth-library'

const auth = new GoogleAuth({
    credentials: {
        client_email: `gcp-user@ai-env-polkadot.iam.gserviceaccount.com`,
        private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
})

const storage = new Storage({ authClient: auth })

const bucketName = 'polkadot-dataset-bucket'

export const uploadDataset = async (file: File): Promise<string> => {
    try {
        const bucket = storage.bucket(bucketName)
        const uniqueFilename = `${Date.now()}-${file.name}`
        const fileBlob = bucket.file(uniqueFilename)

        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        await new Promise<void>((resolve, reject) => {
            const blobStream = fileBlob.createWriteStream({
                resumable: false,
                contentType: file.type,
                highWaterMark: 1024 * 1024,
            })

            blobStream.on('error', (error: Error) => {
                reject(new Error(`Upload failed: ${error.message}`))
            })

            blobStream.on('finish', () => {
                resolve()
            })

            blobStream.end(uint8Array)
        })

        const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFilename}`

        return publicUrl
    } catch (error) {
        console.error('Error uploading to Google Cloud Storage:', error)
        throw new Error(`Failed to upload dataset: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}
