import React from 'react';
import Button from './components/button';
import './styles/index.scss';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <Button disabled>hello</Button>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              console.log(1);
            }}
          >
            primary large
          </Button>
          <Button type="danger">danger</Button>
          <Button type="link" disabled href="https://www.baidu.com">
            hello
          </Button>
        </header>
      </div>
    );
  }
}

export default App;
