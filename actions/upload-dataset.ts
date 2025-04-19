'use server'
import { Storage } from '@google-cloud/storage'
import { GoogleAuth } from 'google-auth-library'

// Choose ONE authentication method:
// Method 1: Service account with email and private key
const auth = new GoogleAuth({
  credentials: {
    client_email: `gcp-user@ai-env-polkadot.iam.gserviceaccount.com`, // Replace with actual email
    private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDP2SvUYtUptGa0\nhrKUDDrhq8aVLN8iztR6BxrQsRj6QfE9CTf+sI6p48PuNq79dzn6wRv+9GFuFQnS\nW1hyjoFmpo9+AtrwweoEICzMHi99cDl7r1DLYvZQ3StO38sN/P2vHSx28VafgHE7\nex6cKhZE6DeTVFkqHQBvQMBC81MmCRf/ZDoqccDajXCPdyBPUJfMx7hItZegEzZb\nhRniuY/V6uAPfJJvQBGrQ8fr2tVSEnIzxIIXO2+3L06PlWcwWByTuqZlmCPddiSw\nSDt+n03SAGSBFmr7HmzQ31xPG3yJ3ml5UrEYZGi/mbhbfH03rylK6n7+Y6xaTEDg\nzz48I7UXAgMBAAECggEACn1X2G6qemHX4xl/LriVSilcqs+qbTvJ/mSYZlrhu1OT\npLRv5oMrmAheLYoF99XKD80qKApWVnNqXPruMk3d2vvh9waW3Rq0QEQNbrnBRM/i\nnsrgxXr3mmonEuJ5gXm4pdtPkKsqZ39Yd5uFlnULTav4jg9uNpFjIbo/WcGk+yDY\nAm+GDK1ofo8IJbhXFgky50FZpr925nvbmFHM9tLF8fIotNVWEe91Ibg04gYwl1z/\njbwYZueGk+TOWk4bUb+Iuko8QdW3iDboYLNxSRMsFw8FKYog+xtxAnwsAtezlkml\nX/Scdk2SUyo1ZU/qLh85x22CPBe6SlkxwWjAnOiH1QKBgQD5Lf6NdpCxV7dUkmNQ\n0F0/Y2WULmlwXMI/4YColocEr3++vVKsL5aJMSIfm++6rWG52OD3pG6fLmqBFTKt\nTo8Kq8L3ZcSsKtNEjU4389bUJ5sswreAbJ6q8HrIn+li6BQteqKF1DiX/k/sE/Me\n+Tig/yznegdkLX2vtb+L9Dx17QKBgQDViZFKY6hQLmQfQjJISbdTk+Ub2h/AyiB3\nN7GaT1o6mTusGXcJLHcGRt3Y5sPaeYhwoEQp+DRMsJmYLf7BKzXlYEnXAnWrVCyj\n31fS0UwycJuc3KZ4h0SnS53GktnUvzj7ID34zuhj6Zxq6Ki3NlfjxUZYRgSO6aAA\nxVGP3Tw2kwKBgFKsX/ivjfJJGBqHN0xo1YdigyFXBMSzAgAP4ZAN4V48nDW8uuFG\nKLv8AUZbhn55aCMxQfLoK4vE6rFJRzcZCXyQ4G8U5Nv6mX31JC6MSIq7WVDQifGi\nGEK+5v4JkHWwaoFsXt/oOZ60UfAR7mgoaBGCmHN0mV8zeLADrTnSHv1BAoGAMt1p\nEXo5rpfOW6/OAHAmzi7NhVvo8mhzYVKP6Lz8NjcoAq+yLio8U+9viuo1PwZyHLng\nYsrv0lDC1YAnTeY4GWJdVG0OkHglhgd+iQY4C0/NkYjx0oYOMXeOpq12W/oM3azp\ndin7K0mLa9/tyG6Wcvgb8I0FKvG1nlliO02suScCgYEAhrtAWn+AuTxNb6vacUfW\nwAwinZlspjtYT9XQc+HzNA0eze2X/nncnN9pj3FS3PQARMEph9gSB2w9P7/XLn2C\noNYfrJiSVp+AH/xAkD9i7/35mG+MikwAImaA8+tbdDr74UmdjfeTx/QUMBKNy1BI\n5BvRmcUFYvmK5/gFFuziEAI=\n-----END PRIVATE KEY-----\n`.replace(/\\n/g, '\n'), // Store this in environment variable
  },
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
})

const storage = new Storage({ authClient: auth })

// Bucket name
const bucketName = 'polkadot-dataset-bucket'

export const uploadDataset = async (file: File): Promise<string> => {
  try {
    const bucket = storage.bucket(bucketName)
    
    // Generate a unique filename to avoid collisions
    const uniqueFilename = `${Date.now()}-${file.name}`
    const fileBlob = bucket.file(uniqueFilename)
    
    // Convert File to Uint8Array
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Upload the file to Google Cloud Storage
    await new Promise<void>((resolve, reject) => {
      const blobStream = fileBlob.createWriteStream({
        resumable: false,
        contentType: file.type,
        highWaterMark: 1024 * 1024 // Set highWaterMark to 1MB
      })
      
      blobStream.on('error', (error: Error) => {
        reject(new Error(`Upload failed: ${error.message}`))
      })
      
      blobStream.on('finish', () => {
        resolve()
      })
      
      // Write Uint8Array to the stream and end it
      blobStream.end(uint8Array)
    })
    
    // Generate a public URL for the file
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFilename}`
    
    return publicUrl
  } catch (error) {
    console.error('Error uploading to Google Cloud Storage:', error)
    throw new Error(`Failed to upload dataset: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}