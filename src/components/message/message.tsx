import React from 'react'
import classNames from 'classnames'
import Notification, { NotificationInstance, NoticeContent } from './Notification'

type ConfigContent = React.ReactNode | string
type ConfigDuration = number | (() => void)
type ConfigOnClose = () => void
type JoinContent = ConfigContent | ArgProps

interface ArgProps {
  content: React.ReactNode
  duration: number | null
  prefixCls?:string
  onClose?: () => void 
}

interface MessageApi {
  info (content: JoinContent, duration?: ConfigDuration, onClose?: ConfigOnClose): void 
  success (content: JoinContent, duration?: ConfigDuration, onClose?: ConfigOnClose): void 
  warning (content: JoinContent, duration?: ConfigDuration, onClose?: ConfigOnClose): void 
  error (content: JoinContent, duration?: ConfigDuration, onClose?: ConfigOnClose): void 
  loading (content: JoinContent, duration?: ConfigDuration, onClose?: ConfigOnClose): void 
  open (args: ArgProps): void
  destroy(messageKey:React.Key):void
}

let messageNotification: NotificationInstance | null

function isArgsProps (content: JoinContent): content is ArgProps {
  return (Object.prototype.toString.call(content) === '[object Object]' && !!(content as ArgProps).content)
}

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


const api = {
  open: notice,
  destroy: (messageKey:React.Key) => {
    if (messageNotification) {
      if (messageKey) {
        messageNotification.removeNotice(messageKey)
      } else {
        messageNotification.destroy()
        messageNotification = null
      }
    }
  }
}

const attachTypeApi = (originApi:any,type:string) => {
  originApi[type] = (content: JoinContent, duration?: ConfigDuration, onClose?: ConfigOnClose) => {
    if (isArgsProps(content)) {
      originApi.open(content)
    }

    if (typeof duration === 'function') {
      onClose = duration
      duration = undefined
    }

    originApi.open({content,duration,onClose})
  }
}

['info','success','warning','loading'].forEach(type => attachTypeApi(api,type))

export default api as MessageApi