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
import {
  Form,
  FormGroup,
  FormRow,
  LoadingIndicator,
  Modal,
  StateButton,
  Input,
  DraggableItem,
  DragDropZone
} from 'components';
import styled from 'styled-components';
import dotProp, { set } from 'dot-prop-immutable';
import IconMinusCircle from 'react-icons/lib/fa/minus-circle';
import Select from 'react-select';
import IconBar from 'react-icons/lib/fa/bars';
import { withResource } from 'resource';

const FREQUENCY_OPTIONS = [
  { value: 'Sunday', label: 'Sunday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Month', label: 'Month' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Monday', label: 'Monday' },
  { value: 'Everyday', label: 'Everyday' }
];

class Popup extends Component {
  static propTypes = {
    data: PropTypes.object,
    mode: PropTypes.oneOf(['new', 'edit']).isRequired,
    isLoading: PropTypes.bool,
    hasCompleted: PropTypes.bool,
    hasInitialized: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func
  };
  static defaultProps = {
    data: {},
    isLoading: false,
    hasCompleted: false,
    hasInitialized: false,
    onClose: () => {},
    onSave: () => {}
  };
  constructor(props) {
    super(props);

    const { data } = props;
    this.state = { data };
  }
  componentDidUpdate(prevProps, prevState) {
    const { data: prevData } = prevState;
    const { data, hasInitialized, hasCompleted, onClose } = this.props;
    const isReceivingInitData = hasInitialized && _.isEmpty(prevData);

    if (isReceivingInitData) {
      this.setState({ data });
    }

    if (hasCompleted) {
      setTimeout(onClose, 500);
    }
  }
  handleChange = change => {
    let data = _.clone(this.state.data);

    _.forOwn(change, (change, key) => {
      data = set(data, key, change);
    });

    this.setState({ data });
  };
  handleSwitch = (sourceNo, targetNo) => {
    const { data: { positions } } = this.state;
    const target = positions[targetNo];
    const source = positions[sourceNo];

    this.handleChange({
      [`positions.${sourceNo}.name`]: target.name,
      [`positions.${targetNo}.name`]: source.name
    });
  };
  handlePositionAdd = () => {
    let { data, data: { positions } } = this.state;

    data = set(data, `positions.${positions.length}`, {
      name: '',
      order: positions.length + 1
    });

    this.setState({ data });
  };
  handlePositionDelete = offset => {
    let { data } = this.state;
    data = dotProp.delete(data, `positions.${offset}`);

    this.setState({ data });
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
    const { isSaving, hasCompleted } = this.props;
    const frequency = _.get(data, 'frequency', '');
    const label = _.get(data, 'label', '');
    const footnoteLabel = _.get(data, 'footnoteLabel', '');
    const positions = _.get(data, 'positions', []);
    const { mode } = this.props;
    const isNew = mode === 'new';
    const isButtonEnabled = frequency && label && footnoteLabel;
    const buttonKind =
      (isSaving && 'loading') || (hasCompleted && 'success') || 'default';

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup label="Frequency" isRequired={true}>
          <StyleSelect
            value={frequency}
            disabled={!isNew}
            clearable={false}
            options={FREQUENCY_OPTIONS}
            onChange={e =>
              this.handleChange({
                frequency: e.value
              })
            }
          />
        </FormGroup>
        <FormGroup label="Service Title" isRequired={true}>
          <Input
            data-hj-whitelist
            type="text"
            value={label}
            maxLength={30}
            onChange={e => this.handleChange({ label: e.target.value })}
          />
        </FormGroup>
        <FormGroup label="Descripiton Label" isRequired={true}>
          <Input
            data-hj-whitelist
            type="text"
            value={footnoteLabel}
            maxLength={30}
            onChange={e => this.handleChange({ footnoteLabel: e.target.value })}
          />
        </FormGroup>
        <FormGroup
          label="Positions"
          labelStyle={{ paddingTop: '10px' }}
          style={{ alignItems: 'flex-start' }}>
          <DragDropZone>
            <PositionList>
              {positions.map(({ id, name, order }, i) => (
                <StyleDraggableItem
                  key={id}
                  value={order}
                  no={i}
                  onSwitchPosition={(sourceNo, targetNo) =>
                    this.handleSwitch(sourceNo, targetNo)
                  }>
                  <StyleIconBar />
                  <Input
                    data-hj-whitelist
                    type="text"
                    value={name}
                    onChange={e =>
                      this.handleChange({
                        [`positions.${i}.name`]: e.target.value
                      })
                    }
                  />
                  {!id && (
                    <IconDelete
                      onClick={this.handlePositionDelete.bind(this, i)}
                    />
                  )}
                </StyleDraggableItem>
              ))}
              <PositionItem>
                <AddPositionLink onClick={this.handlePositionAdd}>
                  Add New Position
                </AddPositionLink>
              </PositionItem>
            </PositionList>
          </DragDropZone>
        </FormGroup>
        <FormRow align="center">
          <StateButton
            kind={buttonKind}
            type="submit"
            disabled={!isButtonEnabled}>
            Save
          </StateButton>
        </FormRow>
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

export default withResource('services', (resource, state, ownProps) => {
  const selectedId = _.get(ownProps, 'data.id');
  const data = _.get(resource, ['data', selectedId], {});

  const modifyStatus = _.get(resource, 'status.modify', {});
  const isSaving = modifyStatus.loadingIds[selectedId];
  const hasCompleted = modifyStatus.completedIds[selectedId];

  const retrieveStatus = _.get(resource, 'status.retrieve', {});
  const hasInitialized = retrieveStatus.hasInitialized && !_.isEmpty(data);

  return {
    data,
    isSaving,
    hasCompleted,
    hasInitialized
  };
})(Popup);

const PositionItem = styled.li`
  align-items: center;
  display: flex;
  margin-bottom: 4px;
  &:last-child {
    margin-bottom: 0;
  }
`;
const PositionList = styled.ol`
  background: #eee;
  border-radius: 4px;
  padding: 5px;
`;
const AddPositionLink = styled.a`
  cursor: pointer;
  display: block;
  font-size: 12px;
  text-align: right;
  width: 100%;
`;
const IconDelete = styled(IconMinusCircle)`
  color: #a00;
  font-size: 20px;
  margin-left: 4px;
`;
const StyleSelect = styled(Select)`
  width: 165px;
`;
const StyleIconBar = styled(IconBar)`
  cursor: move;
  margin-right: 5px;
`;
const StyleDraggableItem = styled(DraggableItem)`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  &[aria-grabbed='true'] {
    opacity: 0.5;
  }
  &[aria-dropeffect='move'] {
    background: #c1c1c1;
  }
`;
