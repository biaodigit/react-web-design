// export { default as Button } from './components/button';
import React from 'react'
import ReactDOM from 'react-dom'
import Button from './components/button/Button'
import message from './components/message/Message'
import './styles/index.scss'

const App = () => {
  const handleMessage = () => {
    // Message.info('message', 3000).then().then(() => {
    //   console.log(1)
    // })
    message.loading('web loading', 2000).then(() => {
      message.success('web success', 0)
    })
  }
  return (
    <div style={{ margin: '200px 600px' }}>
      <Button type="primary" onClick={handleMessage}>
        message
      </Button>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
