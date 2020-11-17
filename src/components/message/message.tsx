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

  Notification.newInstance({}, (instance: NotificationInstance) => cb && cb(instance))
}

const notice = (type: string, content: React.ReactNode, duration?: number, onClose?:() => void) => {
  getNotificationInstance((instance: NotificationInstance) => {
    messageNotification = instance
    instance.notice({
      content,
      duration,
      onClose () {
        onClose && onClose()
        instance.destroy()
        messageNotification = null
      }
    })
   })
}

export default {
  info: (content: React.ReactNode, duration?:number) => {
    notice('info', content, duration)
  },
  success: (content: React.ReactNode, duration?:number) => {
    notice('success', content, duration)
  },
  warning: (content: React.ReactNode) => {},
  hide: () => {
    messageNotification && messageNotification.destroy()
  }
}
