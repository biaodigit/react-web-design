import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Notice, { NoticeProps } from './Notice'

type NoticeFunc = (noticeProps: NoticeContent) => void

export interface NotificationInstance {
  notice: NoticeFunc
  removeNotice: (key: React.Key) => void
  destroy: () => void
}

interface NotificationProps {
  prefixCls?: string
  className?: string
}

interface NotificationState {
  notices: { notice: NoticeContent }[]
}

export interface NoticeContent extends Omit<NoticeProps, 'prefixCls' | 'noticeKey' | 'onClose'> {
  prefixCls?: string
  duration?: number
  key?: React.Key
  onClose?: () => void;
}

let noticeNumber = 0

const getUuid = () => {
  return `notification${new Date().getTime()}-${noticeNumber++}`
}

class Notification extends React.Component<
  NotificationProps,
  NotificationState
> {
  static newInstance: (
    properties: NotificationProps,
    callback: (instance: NotificationInstance) => void
  ) => void

  static defaultProps = {
    prefixCls: 'notification'
  }

  constructor(props) {
    super(props)
    this.state = {
      notices: []
    }
  }
  public add(originNotice: NoticeContent) {
    const key = originNotice.key || getUuid()
    const notice: NoticeContent = {
      ...originNotice,
      key
    }

    this.setState((prevState) => {
      const { notices } = prevState
      const idx = notices.map((v) => v.notice.key).indexOf(key)
      const updateNotices = notices.concat()
      if (idx !== -1) {
        updateNotices.splice(idx, 1, { notice })
      } else {
        updateNotices.push({ notice })
      }
      return { notices: updateNotices }
    })
  }

  public remove (removeKey: React.Key) {
    this.setState(({ notices }) => ({
      notices: notices.filter(({ notice: { key } }) => key !== removeKey)
    }))
  }

  private getNoticeDom() {
    const { notices } = this.state
    const { prefixCls } = this.props
    return notices.map(({ notice }) => {
      const { key } = notice 

      const noticeProps = {
        ...notice,
        prefixCls,
        noticeKey: key,
        onClose: (key: React.Key) => {
          this.remove(key)
          notice.onClose?.()
        }
      } as NoticeProps

      return <Notice {...noticeProps}/>
    })
  }

  public render() {
    const { prefixCls } = this.props
    const classes = classNames(prefixCls)
    return <div className={classes}>{this.getNoticeDom()}</div>
  }
}

Notification.newInstance = (properties, callback) => {
  const { ...props } = properties
  const div = document.createElement('div')
  document.body.appendChild(div)

  let called = false
  function ref(notification: Notification) {
    if (called) return

    called = true
    callback({
      notice(noticeProps) {
        notification.add(noticeProps)
      },
      removeNotice(key) {
        notification.remove(key)
      },
      destroy () {
        console.log('destroy')
        ReactDOM.unmountComponentAtNode(div)
        if (div.parentNode) {
          div.parentNode.removeChild(div)
        }
      }
    })
  }

  ReactDOM.render(<Notification {...props} ref={ref} />, div)
}

export default Notification
