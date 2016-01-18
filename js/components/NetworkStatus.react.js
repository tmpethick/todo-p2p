import React from 'react';

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
    return (
      <li>
        {this.state.isOffline ? <a href="#" onClick={location.reload.bind(location)}>Refresh</a> : ''}
      </li>
    );
  }
}
