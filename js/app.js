import Network from './Network';
import TupleSpace from "./TupleSpace";
import React from 'react';
import ReactDOM from 'react-dom';

export default class App extends React.Component {
  render() {
    return (
       <div>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <input className="new-todo" placeholder="What needs to be done?" autofocus />
          </header>

          <section className="main">
            <input className="toggle-all" type="checkbox" />
            <ul className="todo-list">

              <li className="completed">
                <div className="view">
                  <input className="toggle" type="checkbox" checked />
                  <label>Learn JavaScript</label>
                </div>
                <input className="edit" value="Create a TodoMVC template" />
              </li>

              <li>
                <div className="view">
                  <input className="toggle" type="checkbox" />
                  <label>Make todo</label>
                </div>
                <input className="edit" value="Rule the web" />
              </li>

            </ul>
          </section>
          <footer className="footer"></footer>
        </section>
       </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
