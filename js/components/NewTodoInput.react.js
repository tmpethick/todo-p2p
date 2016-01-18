import React from 'react';
import TodoItemModel from '../model/TodoItem';


export default class NewTodoInput extends React.Component {

  constructor(props) {
    super();
    this.tupleSpace = props.tupleSpace;
    this.state = {newTodoInput: ''};
  }

  handleInputChange(event) {
    this.setState({newTodoInput: event.target.value});
  }

  createTodoItem() {
    const content = this.state.newTodoInput;
    if (!content)
      return;
    
    const todoItem = TodoItemModel.create({content: content});

    this.tupleSpace.put(todoItem.toTuple());

    this.setState({newTodoInput: ''});    
  }

  handleKeyDown(event) {
    if (event.keyCode == 13) {
      this.createTodoItem();
    }
  }

  render() {
    return (
      <input className="new-todo" 
        value={this.state.newTodoInput}
        onChange={this.handleInputChange.bind(this)}
        placeholder="What needs to be done?"
        onKeyDown={this.handleKeyDown.bind(this)} />
    );
  }
}
