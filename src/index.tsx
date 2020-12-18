// export { default as Button } from './components/button';
import React from 'react'
import ReactDOM from 'react-dom'
import Button from './components/button/Button'
import Message from './components/message/Message'
import './styles/index.scss'

const App = () => {
  return (
    <div style={{ margin: '200px 600px' }}>
      <Button type="primary" onClick={() => Message.info('message', 0)}>message</Button>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
