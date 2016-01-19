import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class NetworkStatus extends React.Component {
  constructor(props) {
    super();
    this.state = {isOffline: !navigator.onLine,
                  reconnect : false};
  }

  componentDidMount() {
    window.addEventListener('offline', this.onOffline);
    window.addEventListener('online', this.onOnline);
  }

  componentWillUnmount() {
    window.removeEventListener('offline', this.onOffline);
    window.removeEventListener('online', this.onOnline);
  }

  onOffline = () => {
    this.state.reconnect = false;
    this.setState({isOffline: true});
    console.log('offline')
  };

  onOnline = () => {
    this.state.isOffline ? this.state.reconnect = true : this.state.reconnect = false;
    this.setState({isOffline: false});
    console.log('online')
  };

  render() {
    console.log(this.state.isOffline)
    return (
      <div>
        <ReactCSSTransitionGroup transitionName="offline-button" 
          transitionEnterTimeout={50}
          transitionLeaveTimeout={1000}>
          {this.state.isOffline ? (
            <a key="offline" className="offline-button">
              You were disconnected.
            </a>
          ) : <span key="online"/>}
        </ReactCSSTransitionGroup>

        <ReactCSSTransitionGroup transitionName="reconnect-button" 
          transitionEnterTimeout={50}
          transitionLeaveTimeout={1000}>
          {this.state.reconnect ? (
            <a key="reconnect" href="#" className="reconnect-button" onClick={location.reload.bind(location)}>
              You’re online. Press to sync changes.
            </a>
          ) : <span key="online"/>}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
