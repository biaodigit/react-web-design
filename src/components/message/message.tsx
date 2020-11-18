import React from 'react'
import classNames from 'classnames'
import Notification, { NotificationInstance } from './Notification'

let messageNotification: NotificationInstance | null

const getNotificationInstance = (
  cb: (notification: NotificationInstance) => void
) => {
  if (messageNotification) {
    cb(messageNotification)
    return
  }

  Notification.newInstance(
    {},
    (instance: NotificationInstance) => cb && cb(instance)
  )
}

const getNoticeProps = () => {
  
}

const notice = (
  type: string,
  content: React.ReactNode,
  duration?: number,
  onClose?: () => void
) => {
  console.log(content)
  getNotificationInstance((instance: NotificationInstance) => {
    messageNotification = instance
    instance.notice({
      content,
      duration,
      onClose() {
        onClose && onClose()
        instance.destroy()
        messageNotification = null
      }
    })
  })
}

export default {
  info: (content: React.ReactNode, duration?: number, onClose?: () => void) => {
    notice('info', content, duration, onClose)
  },
  success: (
    content: React.ReactNode,
    duration?: number,
    onClose?: () => void
  ) => {
    notice('success', content, duration, onClose)
  },
  warning: (
    content: React.ReactNode,
    duration?: number,
    onClose?: () => void
  ) => {
    notice('warning', content, duration, onClose)
  },
  hide: () => {
    messageNotification && messageNotification.destroy()
  }
}
