import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Component } from 'react';

const DragDropZone = DragDropContext(HTML5Backend)(
  class DragDropZone extends Component {
    render() {
      return this.props.children;
    }
  }
);

export default DragDropZone;
