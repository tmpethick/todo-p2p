import React from 'react';
import ReactDOM from 'react-dom';
import Promise from 'bluebird';
import TupleSpace from "./TupleSpace";
import Network from './Network2';
import App from './App.react';


Promise.longStackTraces();

var network = new Network();

var tupleSpace = new TupleSpace(network);
tupleSpace.load();
window.onunload = tupleSpace.save;

// Make sure network is only joined when interface is ready
const start = () => tupleSpace.join();

// for testing
window.tupleSpace = tupleSpace;

ReactDOM.render(
  <App tupleSpace={tupleSpace} onReady={start} />, 
  document.getElementById('app')
);
