import _ from 'lodash';
import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import IconBar from 'react-icons/lib/fa/bars';
import styled from 'styled-components';

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

export const DraggableItem = _.flow([
  DragSource(ItemTypes.ROLE, sourceSpec, collectSource),
  DropTarget(ItemTypes.ROLE, targetSpec, collectTarget)
])(
  class DraggableItem extends Component {
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

      let isDragEntering;
      if (isOver && canDrop) {
        isDragEntering = true;
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
              isDragging={isDragging}
              isDragEntering={isDragEntering}
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

const StyleInput = styled.input`
  opacity: ${props => (props.isDragging ? 0.5 : 1)};
  background-color: ${props => (props.isDragEntering ? '#c1c1c1' : '#fff')};
  width: 90%;
  display: inline-block;
  background-color: '#fff';
  border: solid 1px #c1c1c1;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  color: #333;
  padding: 9px;
  &.extra-space-for-addon {
    padding-left: 48px;
  }
  &:hover {
    border-color: #8b8b8b;
  }
  &:focus {
    border-color: #64b8dc;
    box-shadow: none;
    outline: 0;
  }
  &[disabled] {
    background: #e5e5e5;
    border-color: #c1c1c1;
    box-shadow: none;
  }
  &::-webkit-input-placeholder {
    color: #999;
  }
  &:-moz-placeholder {
    color: #999;
  }
  &::-moz-placeholder {
    color: #999;
  }
  &:-ms-input-placeholder {
    color: #999;
  }
`;
StyleInput.displayName = 'StyleInput';

export default DraggableItem;
