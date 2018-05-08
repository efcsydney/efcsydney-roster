/**
 * Example Usage
 *
 * <Popup
 *     data={selectedData}
 *     mode={mode}
 *     isLoading={isLoading}
 *     onSave={this.handlePopupSave}
 *     onClose={this.handlePopupClose}/>
 */
import _ from 'lodash';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { LoadingIndicator, Modal, StateButton, Input } from 'components';
import styled from 'styled-components';
import dotProp, { set } from 'dot-prop-immutable';
import IconMinusCircle from 'react-icons/lib/fa/minus-circle';
import Select from 'react-select';
import { DragSource, DropTarget } from "react-dnd";
import {ItemTypes} from "../../../constants/ReactDndItemTypes";


export default class Popup extends Component {
  static propTypes = {
    data: PropTypes.object,
    mode: PropTypes.oneOf(['new', 'edit']).isRequired,
    isLoading: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func
  };
  static defaultProps = {
    data: {},
    isLoading: false,
    onClose: () => {},
    onSave: () => {}
  };
  constructor(props) {
    super(props);

    const { data } = props;
    this.state = { data, enableSaveButton: false };
  }
  componentWillReceiveProps(nextProps) {
    const { data: prevData } = this.props;
    const { data: nextData } = nextProps;

    if (_.isEmpty(prevData) && !_.isEmpty(nextData)) {
      this.setState({ data: nextData });
    }
  }
  handleChange = change => {
    let data = _.clone(this.state.data);

    _.forOwn(change, (change, key) => {
      data = set(data, key, change);
    });

    const label = _.get(data, 'label', '');
    const footnoteLabel = _.get(data, 'footnoteLabel', '');
    const enable = label && footnoteLabel;

    this.setState({
      data,
      enableSaveButton: enable
    });
  };
  handleSwitch = (sourceNo, targetNo) => {
    const {data: {positions}} = this.state;
    const target = positions[targetNo];
    const source = positions[sourceNo];

    this.handleChange({
      [`positions.${sourceNo}.name`]: target.name,
      [`positions.${targetNo}.name`]: source.name,
    });
  }
  handlePositionAdd = () => {
    let { data, data: { positions } } = this.state;

    data = set(data, `positions.${positions.length}`, {
      name: '',
      order: positions.length + 1
    });

    this.setState({
      data
    });
  };
  handlePositionDelete = offset => {
    let { data } = this.state;
    data = dotProp.delete(data, `positions.${offset}`);

    this.setState({
      data
    });
  };
  handleSubmit = e => {
    const { onSave } = this.props;
    const { data, data: { positions } } = this.state;

    e.preventDefault();

    onSave({
      ...data,
      positions: _.filter(
        positions,
        position => !_.isEmpty(position.name.trim())
      )
    });
  };
  renderForm() {
    const { data } = this.state;
    const frequency = _.get(data, 'frequency', '');
    const label = _.get(data, 'label', '');
    const footnoteLabel = _.get(data, 'footnoteLabel', '');
    const positions = _.get(data, 'positions', []);

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Label required>Frequency</Label>
          <span>
            <StyleSelect
              value={frequency}
              disabled={true}
              clearable={false}
              options={[
                { value: 'Sunday', label: 'Sunday' },
                { value: 'Saturday', label: 'Saturday' },
                { value: 'Month', label: 'Month' }
              ]}
              onChange={e =>
                this.handleChange({
                  frequency: e.value
                })
              }
            />
          </span>
        </Row>
        <Row>
          <Label required>Service Title</Label>
          <span>
            <Input
              data-hj-whitelist
              type="text"
              value={label}
              maxLength={30}
              onChange={e => this.handleChange({ label: e.target.value })}
            />
          </span>
        </Row>
        <Row>
          <Label required>Description Label</Label>
          <span>
            <Input
              data-hj-whitelist
              type="text"
              value={footnoteLabel}
              maxLength={30}
              onChange={e =>
                this.handleChange({ footnoteLabel: e.target.value })
              }
            />
          </span>
        </Row>
        <Row style={{ alignItems: 'flex-start' }}>
          <Label style={{ paddingTop: '10px' }}>Positions</Label>
          <span>
            <PositionList>
              {positions.map(({ id, name, order }, i) => {
                return (
                  <PositionItem key={i} value={order}>
                    <NumberInput
                      data-hj-whitelist
                      type="number"
                      value={order}
                      onChange={e =>
                        this.handleChange({
                          [`positions.${i}.order`]: parseInt(e.target.value, 10)
                        })
                      }
                    />
                    <DraggableInput
                      no={i} 
                      name={name}
                      handleChange={e =>
                        this.handleChange({
                          [`positions.${i}.name`]: e.target.value
                        })
                      }
                      switchPosition={(sourceNo, targetNo) => this.handleSwitch(sourceNo, targetNo)}
                    />
                    {!id && (
                      <IconDelete
                        onClick={this.handlePositionDelete.bind(this, i)}
                      />
                    )}
                  </PositionItem>
                );
              })}
              <PositionItem>
                <AddPositionLink onClick={this.handlePositionAdd}>
                  Add New Position
                </AddPositionLink>
              </PositionItem>
            </PositionList>
          </span>
        </Row>
        <Row align="center">
          <StateButton type="submit" disabled={!this.state.enableSaveButton}>
            Save
          </StateButton>
        </Row>
      </Form>
    );
  }
  renderLoading() {
    return <LoadingIndicator active={true} height="200px" />;
  }
  render() {
    const { isLoading, mode, onClose } = this.props;
    const title = mode === 'new' ? 'Create Service' : 'Edit Service';

    return (
      <Modal isOpen={true} title={title} onClose={onClose}>
        {isLoading ? this.renderLoading() : this.renderForm()}
      </Modal>
    );
  }
}

const Form = styled.form`
  display: table;
  margin: 0 auto;
  position: relative;
`;
Form.displayName = 'Form';

const Row = styled.div`
  align-items: center;
  display: flex;
  min-height: 50px;
  &:last-child {
    text-align: center;
    padding: 20px 0;
  }
  justify-content: ${props => props.align || 'flex-start'};
`;
Row.displayName = 'Row';

const Label = styled.label`
  display: inline-block;
  font-weight: bold;
  padding-right: 15px;
  position: relative;
  text-align: right;
  width: 125px;
  ${props =>
    props.required &&
    `
    &:after {
      content: '*';
      color: #c00;
      position: absolute;
      right: 7px;
    }
  `};
`;
Label.displayName = 'Label';

const PositionList = styled.ol`
  background: #eee;
  border-radius: 4px;
  padding: 5px;
`;
PositionList.displayName = 'PositionList';

const PositionItem = styled.li`
  align-items: center;
  display: flex;
  margin-bottom: 4px;
  &:last-child {
    margin-bottom: 0;
  }
`;
PositionItem.displayName = 'PositionItem';

const NumberInput = Input.extend.attrs({
  readOnly: "true"
})`
  min-width: 50px;
  margin-right: 4px;
  text-align: center;
  width: 50px;
`;
NumberInput.displayName = 'NumberInput';

const AddPositionLink = styled.a`
  cursor: pointer;
  display: block;
  font-size: 12px;
  text-align: right;
  width: 100%;
`;
AddPositionLink.displayName = 'AddPositionLink';

const IconDelete = styled(IconMinusCircle)`
  color: #a00;
  font-size: 20px;
  margin-left: 4px;
`;
IconDelete.displayName = 'IconDelete';

const StyleSelect = styled(Select)`
  width: 165px;
`;
StyleSelect.displayName = 'StyleSelect';

const positionSource = {
  beginDrag(props) {
      return {
          no: props.no
      };
  },
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

const positionTarget = {
  canDrop(props) {
    return true;
  },
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

const DraggableInput = 
_.flow([
  DragSource(ItemTypes.ROLE, positionSource, collectSource),
  DropTarget(ItemTypes.ROLE, positionTarget, collectTarget)
])(  class DraggableInput extends Component {
  render() {
    const {name, handleChange, connectDragSource, connectDropTarget, isDragging, isOver, canDrop} = this.props;
    const opacity = isDragging ? .5 : 1;

    let bgColor;
    if (isOver && canDrop) {
      bgColor = "greenyellow";
    }
    else if (!isOver && canDrop) {
      bgColor = "#FFFF99";
    }
    else if (isOver && !canDrop) {
      bgColor = "red";
    }
    
    return connectDropTarget(connectDragSource(
      <div>
        <Input 
          data-hj-whitelist
          type="text"
          value={name}
          onChange={handleChange}
          opacity={opacity}
          bgColor={bgColor}>
          {this.props.children}
        </Input>
      </div>
    ))
  }
})
