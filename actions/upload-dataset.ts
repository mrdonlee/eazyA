'use server'
import { Storage } from '@google-cloud/storage'

const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
})

export const uploadDataset = async (file: File): Promise<string> => {
    return new Promise((resolve, _reject) => {
        setTimeout(() => {
            resolve('Dataset uploaded successfully!')
        }, 2000)
    })
}
