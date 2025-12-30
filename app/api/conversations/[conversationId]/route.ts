import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function DELETE(request: NextRequest, { params }: {
    params: Promise<{ conversationId: string }>
}) {
    const { conversationId } = await params
    const { user } = getInfo(request)

    try {
        await client.deleteConversation(conversationId, user)
        // DELETE 成功通常返回 204 No Content，这里返回一个成功标识
        return new NextResponse(null, { status: 204 })
    }
    catch (error: any) {
        return NextResponse.json({
            error: error.message,
        }, { status: 500 })
    }
}
