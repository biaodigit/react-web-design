// export { default as Button } from './components/button';
import React from 'react'
import ReactDOM from 'react-dom'
import Button from './components/button/Button'
import message from './components/message'
import Menu from './components/menu'
import './styles/index.scss'

const App = () => {
  const handleMessage = () => {
    // Message.info('message', 3000).then().then(() => {
    //   console.log(1)
    // })
    // message.loading('web loading', 2000).then(() => {
    //   message.success('web success', 2000)
    // })
    message.success('web success', 2000)
  }
  return (
    <div style={{ margin: '200px 600px' }}>
      <Button type="primary" onClick={handleMessage}>
        message
      </Button>
      <Menu
        defaultIndex="0"
        onSelect={() => console.log('selected!')}
        mode="vertical"
      >
        <Menu.Item>cool link</Menu.Item>
        <Menu.Item>cool link 2</Menu.Item>
        <Menu.SubMenu title="点击下拉选项">
          <Menu.Item>下拉选项一</Menu.Item>
          <Menu.Item>下拉选项二</Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
