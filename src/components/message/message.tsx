import React from 'react'
import classNames from 'classnames'
import Notification, { NotificationInstance, NoticeContent } from './Notification'

interface ArgProps {
  content: React.ReactNode
  duration: number | null
  prefixCls?:string
  onClose?: () => void 
}

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

const getNoticeProps = (args:ArgProps):NoticeContent => {
  const duration = args.duration !== undefined ? args.duration : 3000
  const classes = classNames('notification-content',{})
  return {
    duration,
    content: (
      <div className={classes}>
        <span>{args.content}</span>
      </div>
    ),
    onClose: args.onClose
  }
}

const notice = (args:ArgProps) => {
  getNotificationInstance((instance: NotificationInstance) => {
    messageNotification = instance
    instance.notice(getNoticeProps(args))
  })
}

export default {
  info: (content: React.ReactNode, duration?: number, onClose?: () => void) => {
    // notice('info', content, duration, onClose)
  },
  success: (
    content: React.ReactNode,
    duration?: number,
    onClose?: () => void
  ) => {
    // notice('success', content, duration, onClose)
  },
  warning: (
    content: React.ReactNode,
    duration?: number,
    onClose?: () => void
  ) => {
    // notice('warning', content, duration, onClose)
  },
  hide: () => {
    messageNotification && messageNotification.destroy()
  }
}
