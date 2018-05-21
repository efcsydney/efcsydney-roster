import _ from 'lodash';
import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';

const ItemTypes = {
  ROLE: 'role'
};

const sourceSpec = {
  beginDrag(props) {
    return {
      no: props.no
    };
  }
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const targetSpec = {
  drop(props, monitor) {
    // dispatch action here
    const sourceNo = monitor.getItem() ? monitor.getItem().no : null;
    const targetNo = props.no;
    props.onSwitchPosition(sourceNo, targetNo);
  }
};

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

export const DraggableItem = _.flow([
  DragSource(ItemTypes.ROLE, sourceSpec, collectSource),
  DropTarget(ItemTypes.ROLE, targetSpec, collectTarget)
])(
  class DraggableItem extends Component {
    render() {
      const {
        connectDragSource,
        connectDropTarget,
        isDragging,
        isOver,
        canDrop
      } = this.props;

      let isDragEntering = false;
      if (isOver && canDrop) {
        isDragEntering = true;
      }

      return connectDropTarget(
        connectDragSource(
          <div>
            {React.cloneElement(this.props.children, {
              isDragging: isDragging,
              isDragEntering: isDragEntering
            })}
          </div>
        )
      );
    }
  }
);

export default DraggableItem;
