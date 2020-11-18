// export { default as Button } from './components/button';
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <div>app</div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);