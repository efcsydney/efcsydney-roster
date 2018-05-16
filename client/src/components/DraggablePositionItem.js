import _ from 'lodash';
import React, { Component } from 'react';
import { Input } from 'components';
import { DragSource, DropTarget } from 'react-dnd';
import IconBar from 'react-icons/lib/fa/bars';
import styled from 'styled-components';

const ItemTypes = {
  ROLE: 'role'
};

const positionSource = {
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

const positionTarget = {
  drop(props, monitor) {
    // dispatch action here
    const sourceNo = monitor.getItem() ? monitor.getItem().no : null;
    const targetNo = props.no;
    props.switchPosition(sourceNo, targetNo);
  }
};

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

export const DraggablePositionItem = _.flow([
  DragSource(ItemTypes.ROLE, positionSource, collectSource),
  DropTarget(ItemTypes.ROLE, positionTarget, collectTarget)
])(
  class DraggablePositionItem extends Component {
    render() {
      const {
        name,
        onChange,
        connectDragSource,
        connectDropTarget,
        isDragging,
        isOver,
        canDrop
      } = this.props;
      const opacity = isDragging ? 0.5 : 1;

      let bgColor;
      if (isOver && canDrop) {
        bgColor = 'greenyellow';
      } else if (!isOver && canDrop) {
        bgColor = '#FFFF99';
      } else if (isOver && !canDrop) {
        bgColor = 'red';
      }

      return connectDropTarget(
        connectDragSource(
          <div>
            <StyleIconBar />
            <StyleInput
              data-hj-whitelist
              type="text"
              value={name}
              onChange={onChange}
              opacity={opacity}
              bgColor={bgColor}
            />
          </div>
        )
      );
    }
  }
);

const StyleIconBar = styled(IconBar)`
  cursor: move;
  width: calc(10% - 5px);
  margin-right: 5px;
`;
StyleIconBar.displayName = 'StyleIconBar';

const StyleInput = styled(Input)`
  width: 90%;
  display: inline-block;
`;
StyleInput.displayName = 'StyleInput';
