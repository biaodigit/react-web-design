import React from 'react';
import classNames from 'classnames'

export interface NoticeProps {
  content: React.ReactNode
  duration?: number
  prefixCls: string
  className?: string
  onClose?: () => void
}

interface NoticeState {
  shouldClose: boolean
}

class Notice extends React.Component<NoticeProps, NoticeState> {
  private timer?: number
  private closeTimer?: number | null

  static defaultProps = {
    duration: 3000
  }

  constructor (props:NoticeProps) {
    super(props)
    this.state = {
      shouldClose: false
    }
  }
  
  public componentDidMount () {
   this.startCloseTimer()
  }

  private close () {
    this.clearCloseTimer()

    this.timer = window.setTimeout(() => {
      if (this.props.onClose) {
        this.props.onClose()
      }
      clearTimeout(this.timer)
    } ,300)
  }

  private startCloseTimer () {
    if (this.props.duration) {
      this.closeTimer = window.setTimeout(() => {
         this.close()
       }, this.props.duration - 300)
    }
  }

  private clearCloseTimer () {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer)
      this.closeTimer = null
    }
  }

  public render () {
    const { prefixCls, className } = this.props
    const classes = classNames(`${prefixCls}-notice`, className)
    return <div className={classes}>
      {this.props.content}
    </div>
  }

  public componentWillUnmount () {
    this.clearCloseTimer()
  }
}

export default Notice;
