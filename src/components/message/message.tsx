import React from 'react'
import classNames from 'classnames'
import Notification, {
    NotificationInstance,
    NoticeContent
} from '../notification/Notification'
import Icon from '../icon/Icon'

type ConfigContent = React.ReactNode | string
type ConfigDuration = number | (() => void)
type ConfigOnClose = () => void
type JoinContent = ConfigContent | ArgProps

type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading'
type IconType = 'info-circle' | 'check-circle' | 'times-circle' | 'exclamation-circle' | 'spinner'


const localPrefixCls = 'web-message'
let messageNotification: NotificationInstance | null
let key = 1

const typeToIcon = {
    info: 'info-circle',
    success: 'check-circle',
    error: 'times-circle',
    warning: 'exclamation-circle',
    loading: 'spinner'
}

interface ArgProps {
    content: React.ReactNode | string
    type: NoticeType
    duration?: number
    prefixCls?: string
    key?: string | number
    onClose?: () => void
}

interface MessageType extends PromiseLike<any> {
    (): void
}

interface MessageInstance {
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
    destroy(messageKey?: React.Key): void
}

interface MessageApi extends MessageInstance {
    warn(
        content: JoinContent,
        duration?: ConfigDuration,
        onClose?: ConfigOnClose
    ): MessageType
}

export interface ThenableArgument {
    (val: any): void
}

function isArgsProps(content: JoinContent): content is ArgProps {
    return (
        Object.prototype.toString.call(content) === '[object Object]' &&
        !!(content as ArgProps).content
    )
}

const getNotificationInstance = (
    args: ArgProps,
    cb: (info: { prefixCls: string; instance: NotificationInstance }) => void
) => {
    let prefixCls = args.prefixCls || localPrefixCls
    if (messageNotification) {
        cb({ prefixCls, instance: messageNotification })
        return
    }

    Notification.newInstance(
        {
            prefixCls
        },
        (instance) => cb && cb({ prefixCls, instance })
    )
}

const getNoticeProps = (args: ArgProps, prefixCls: string): NoticeContent => {
    const duration = args.duration !== undefined ? args.duration : 3000
    const icon = typeToIcon[args.type] as IconType
    const classes = classNames(`${prefixCls}-content`, {
        [`${prefixCls}-${args.type}`]: args.type
    })
    return {
        key: args.key,
        duration,
        className: "move-up",
        content: (
            <div className={classes}>
                <Icon icon={icon} spin={args.type === 'loading'} />
                <span>{args.content}</span>
            </div>
        ),
        onClose: args.onClose
    }
}

const notice = (args: ArgProps) => {
    const target = args.key || key++
    const closePromise = new Promise((resolve) => {
        const callback = () => {
            if (typeof args.onClose === 'function') {
                args.onClose()
            }
            resolve(true)
        }

        getNotificationInstance(args, ({ prefixCls, instance }) => {
            messageNotification = instance
            instance.notice(
                getNoticeProps({ ...args, key: target, onClose: callback }, prefixCls)
            )
        })
    })

    const result = () => {
        if (messageNotification) {
            messageNotification.removeNotice(target)
        }
    }

    result.then = (filled: ThenableArgument, rejected: ThenableArgument) =>
        closePromise.then(filled, rejected)
    return result
}

const api: any = {
    open: notice,
    destroy: (messageKey?: React.Key) => {
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
            return originApi.open(content)
        }

        if (typeof duration === 'function') {
            onClose = duration
            duration = undefined
        }

        return originApi.open({ content, duration, onClose, type })
    }
}

    ;['info', 'success', 'warning', 'error', 'loading'].forEach((type) =>
        attachTypeApi(api, type)
    )

api.warn = api.warning

export default api as MessageApi
