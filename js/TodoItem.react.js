import React from 'react';
import ReactDOM from 'react-dom';


export default class TodoItem extends React.Component {

  constructor(props) {
    super();
    this.state = {
      editing: false,
      editTodoInput: props.todo.data.content
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({editTodoInput: nextProps.todo.data.content});
  }

  handleInputChange(event) {
    this.setState({editTodoInput: event.target.value});
  }

  toggleCompleted(event) {
    var newItem = this.props.todo.copy({
      isComplete: !this.props.todo.data.isComplete,
    }).toTuple();
    this.props.tupleSpace.put(newItem);
  }
  
  blockCompleted(event) {
    var newItem = this.props.todo.copy({
      isBlocked: true,
    }).toTuple();
    this.props.tupleSpace.put(newItem);
  }
  
  editCompleted(event) {
    const content = this.state.editTodoInput;
    if (!content)
      return;
      
    var newItem = this.props.todo.copy({
      content: content,
      isBlocked: false,
    }).toTuple();
    this.props.tupleSpace.put(newItem);
  }
  
  removeCompleted(event) {
    var newItem = this.props.todo.copy({
      isRemoved: true,
    }).toTuple();
    this.props.tupleSpace.put(newItem);
  }
  
  focusEditField(event) {
    if (this.props.todo.data.isBlocked)
      return;
    this.blockCompleted();
    this.setState({editing: true});
    setTimeout(() => {
      ReactDOM.findDOMNode(this.refs.edit).focus();
    });
  };

  blurEditField(event) {
    this.setState({editing: false});
    this.editCompleted();
  };
  
  
  handleKeyDown(event) {
    if (event.keyCode == 13) {
      this.blurEditField();
    }
  }

  render() {
    const {isComplete, isRemoved, isBlocked, content} = this.props.todo.data;
    return (
      <li className={(this.state.editing ? 'editing' : '') + (isComplete ? " completed" : "")  + (isRemoved ? " removed" : "") + (isBlocked ? " blocked" : "")}>
        <div className="view">
          <input className="toggle" type="checkbox"
            onChange={this.toggleCompleted.bind(this)} 
            checked={isComplete} 
            disabled={(isBlocked ? 'disabled' : '')} />
          <label onDoubleClick={this.focusEditField.bind(this)}>{content}</label>
          <button className="destroy" 
            onClick={this.removeCompleted.bind(this)}
            disabled={(isBlocked ? 'disabled' : '')} ></button>
        </div>
        <input 
          className="edit" 
          value={this.state.editTodoInput} 
          onChange={this.handleInputChange.bind(this)} 
          onBlur={this.blurEditField.bind(this)} 
          onKeyDown={this.handleKeyDown.bind(this)} 
          ref="edit" />
      </li>
    );
  }
}