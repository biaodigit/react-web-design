// export { default as Button } from './components/button';
import React from 'react'
import ReactDOM from 'react-dom'
import Button from './components/button/Button'
import Message from './components/message/Message'
import './styles/index.scss'

const App = () => {
  const handleMessage = () => {
   Message.info('message', 2000)
    // setTimeout(() => {
    //   hide()
    // }, 2000)
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
