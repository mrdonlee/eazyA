import { NextRequest, NextResponse } from 'next/server';
import { uploadDataset } from '@/actions/upload-dataset';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { error: 'File is required' },
                { status: 400 }
            );
        }

        // Call the upload function directly
        const publicUrl = await uploadDataset(file);

        // Return response with CORS headers
        return new NextResponse(
            JSON.stringify({
                success: true,
                message: 'File uploaded successfully',
                data: { url: publicUrl }
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                }
            }
        );

    } catch (error) {
        console.error('Upload error:', error);
        return new NextResponse(
            JSON.stringify({
                error: 'File upload failed',
                details: (error as Error).message
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                }
            }
        );
    }
}

// Add OPTIONS handler for preflight requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}