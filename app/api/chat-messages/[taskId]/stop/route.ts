import type { NextRequest } from 'next/server'
import { getInfo } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ taskId: string }> }
) {
    const { taskId } = await params
    const { user } = getInfo(request)

    const baseUrl = API_URL || 'https://api.dify.ai/v1'

    try {
        const response = await fetch(`${baseUrl}/chat-messages/${taskId}/stop`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return Response.json(
                { error: errorData.message || 'Failed to stop responding' },
                { status: response.status }
            )
        }

        const data = await response.json()
        return Response.json(data)
    }
    catch (error: any) {
        return Response.json(
            { error: error.message || 'Failed to stop responding' },
            { status: 500 }
        )
    }
}
