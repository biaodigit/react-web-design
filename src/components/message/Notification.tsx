import React from 'react';
import ReactDOM from 'react-dom';

interface NotificationProps {}

interface NotificationState {}

class Notification extends React.Component<
  NotificationProps,
  NotificationState
> {
  static newInstance: () => void;
  public render() {
    return null;
  }
}

Notification.newInstance = () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(<Notification ref={() => {}} />, div);
};

export default Notification;
