import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class NetworkStatus extends React.Component {
  constructor(props) {
    super();
    this.state = {isOffline: !navigator.onLine};
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
    this.setState({isOffline: true});
    console.log('offline')
  };

  onOnline = () => {
    this.setState({isOffline: false});
    console.log('online')
  };

  render() {
    console.log(this.state.isOffline)
    return (
      <ReactCSSTransitionGroup transitionName="offline-button" 
        transitionEnterTimeout={1000} 
        transitionLeaveTimeout={1000}>
        {this.state.isOffline ? (
          <a key="offline" href="#" className="offline-button" onClick={location.reload.bind(location)}>
            You were disconnected. Click to reload.
          </a>
        ) : <span key="online"/>}
      </ReactCSSTransitionGroup>
    );
  }
}
