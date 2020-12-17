import React, { useEffect } from 'react';
import classNames from 'classnames'

export interface NoticeProps {
  content: React.ReactNode
  duration?: number | null
  prefixCls: string
  className?: string
  onClose?: () => void
}

const Notice: React.FC<NoticeProps> = (props) => {
  const { content, prefixCls, duration = 3000, onClose } = props
  let timer: number = 0
  let closeTimer: number | null = null

  useEffect(() => {
    startCloserTimer()
    return () => {
      clearCloseTimer()
    }
  })

  const startCloserTimer = () => {
    if (duration) {
      closeTimer = window.setTimeout(() => {
        close()
      }, duration - 300)
    }
  }

  const close = () => {
    clearCloseTimer()

    timer = window.setTimeout(() => {
      if (onClose) {
        onClose()
      }
      clearTimeout(timer)
    }, 300)
  }

  const clearCloseTimer = () => {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  const classes = classNames(`${prefixCls}-notice`)
  return <div className={classes}>{content}</div>
}

export default Notice;
