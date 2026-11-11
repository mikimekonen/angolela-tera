import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import {
  getSystemNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  createSystemNotification,
} from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const url = new URL(req.url)
    const unreadOnly = url.searchParams.get('unread') === 'true'
    const notifications = getSystemNotifications(unreadOnly)

    const unreadCount = notifications.filter((n) => !n.isRead).length
    const criticalCount = notifications.filter((n) => n.severity === 'CRITICAL' && !n.isRead).length

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      criticalCount,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  const { errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const body = await req.json()
    const { action, id } = body

    if (action === 'MARK_ALL_READ') {
      const count = markAllNotificationsRead()
      return NextResponse.json({
        success: true,
        message: `${count} notifications marked as read`,
      })
    }

    if (id) {
      const success = markNotificationRead(id)
      return NextResponse.json({
        success,
        message: success ? 'Notification marked as read' : 'Notification not found',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid parameters' },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update notification' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const { session, errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const body = await req.json()
    const { title, message, severity, category } = body

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'Title and message are required' },
        { status: 400 }
      )
    }

    const notif = createSystemNotification({
      title,
      message,
      severity: severity || 'INFO',
      category: category || 'SYSTEM',
      metadata: { createdBy: session.email },
    })

    return NextResponse.json({
      success: true,
      notification: notif,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create notification' },
      { status: 500 }
    )
  }
}
