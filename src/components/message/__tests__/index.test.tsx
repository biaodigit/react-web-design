import message from '../Message'

const noticeCls = '.web-message-notice'
describe('test Message component', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    message.destroy()
  })

  it('render snapshot', () => {
    message.info('message', 0)
    const element = document.querySelector(noticeCls)
    expect(element).toMatchSnapshot()
  })
  it('should render default message', () => {
    message.info('message', 0)
    const element = document.querySelector(noticeCls)
    expect(element).toBeInTheDocument()
    expect(element?.querySelector('svg')).toHaveClass('fa-info-circle')
    expect(element?.querySelector('span')?.innerHTML).toEqual('message')
    message.destroy()
    expect(element).not.toBeInTheDocument()
  })

  it('should be hidden after default time', async () => {
    message.info('message')
    expect(document.querySelector(noticeCls)).toBeInTheDocument()
    jest.runAllTimers()
    expect(document.querySelector(noticeCls)).not.toBeInTheDocument()
  })

  it('should be able to hide manually', () => {
    const hide1 = message.info('message', 0)
    const hide2 = message.info('message', 0)
    expect(document.querySelectorAll(noticeCls).length).toBe(2)
    hide1()
    jest.runAllTimers();
    expect(document.querySelectorAll(noticeCls).length).toBe(1)
    hide2()
    jest.runAllTimers();
    expect(document.querySelectorAll(noticeCls).length).toBe(0)
  })

  it('should be able to destroy globally', () => {
    message.info('message')
    const element = document.querySelector(noticeCls)
    expect(element).toBeInTheDocument()
    message.destroy()
    expect(element).not.toBeInTheDocument()
  })

  it('should render different type message', () => {
    message.info('info',0)
    message.success('success', 0)
    message.error('error', 0)
    message.warning('warning', 0)
    expect(document.querySelectorAll(noticeCls).length).toBe(4)
    expect(document.querySelectorAll('.web-message-info').length).toBe(1)
    expect(document.querySelectorAll('.web-message-success').length).toBe(1)
    expect(document.querySelectorAll('.web-message-error').length).toBe(1)
    expect(document.querySelectorAll('.web-message-warning').length).toBe(1)
    message.destroy()
    jest.runAllTimers();
    expect(document.querySelectorAll(noticeCls).length).toBe(0)
  })

  it('should be called like promise', (done) => {
    jest.useRealTimers();
    const defaultDuration = 3;
    const now = Date.now();
    message.info('message').then(() => {
      const duration = Math.round((Date.now() - now) / 1000);
      expect(duration).toBe(defaultDuration)
      done()
    })
  })
})
