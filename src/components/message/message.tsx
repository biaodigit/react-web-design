import React from 'react'
import classNames from 'classnames'
import Notification, {
  NotificationInstance,
  NoticeContent
} from './Notification'

type ConfigContent = React.ReactNode | string
type ConfigDuration = number | (() => void)
type ConfigOnClose = () => void
type JoinContent = ConfigContent | ArgProps

const localPrefixCls = 'web-message'
let key = 1;

interface ArgProps {
  content: React.ReactNode
  duration?: number
  prefixCls?: string
  key?:string | number
  onClose?: () => void
}

interface MessageType {
  ():void
}

interface MessageApi {
  info(
    content: JoinContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose
  ): MessageType
  success(
    content: JoinContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose
  ): MessageType
  warning(
    content: JoinContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose
  ): MessageType
  error(
    content: JoinContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose
  ): MessageType
  loading(
    content: JoinContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose
  ): MessageType
  open(args: ArgProps): MessageType
  destroy(messageKey: React.Key): void
}

let messageNotification: NotificationInstance | null

function isArgsProps(content: JoinContent): content is ArgProps {
  return (
    Object.prototype.toString.call(content) === '[object Object]' &&
    !!(content as ArgProps).content
  )
}

const getNotificationInstance = (
  args: ArgProps,
  cb: (prefixCls: string, instance: NotificationInstance) => void
) => {
  let prefixCls = args.prefixCls || localPrefixCls
  if (messageNotification) {
    cb(prefixCls, messageNotification)
    return
  }

  Notification.newInstance(
    {
      prefixCls
    },
    (instance: NotificationInstance) => cb && cb(prefixCls, instance)
  )
}

const getNoticeProps = (args: ArgProps, prefixCls: string): NoticeContent => {
  const duration = args.duration !== undefined ? args.duration : 3000
  const classes = classNames(`${prefixCls}-content`, {})
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

const notice = (args: ArgProps) => {
  const target = args.key || key++
  const closePromise = new Promise(resolve => {
    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose()
      }
      resolve(true)
    }
  })
  getNotificationInstance(args, (prefixCls, instance) => {
    messageNotification = instance
    instance.notice({ ...getNoticeProps(args, prefixCls), key: target })
  })

  const result = () => {
    if (messageNotification) {
      messageNotification.removeNotice(target)
    }
  }

  return result
}

const api = {
  open: notice,
  destroy: (messageKey: React.Key) => {
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

const attachTypeApi = (originApi: any, type: string) => {
  originApi[type] = (
    content: JoinContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose
  ) => {
    if (isArgsProps(content)) {
      originApi.open(content)
    }

    if (typeof duration === 'function') {
      onClose = duration
      duration = undefined
    }

    return originApi.open({ content, duration, onClose })
  }
}

;['info', 'success', 'warning', 'loading'].forEach((type) =>
  attachTypeApi(api, type)
)

export default api as MessageApi
