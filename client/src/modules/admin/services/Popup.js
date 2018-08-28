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

const LANGUAGE_OPTIONS = [
  { value: 'en-AU', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' }
];
const FREQUENCY_OPTIONS = [
  { value: 'Sunday', label: 'Sunday' },
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Everyday', label: 'Everyday' }
];

_.mixin({
  move: (array, fromIndex, toIndex) => {
    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
    return array;
  }
});

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

    if (props.mode === 'new') {
      this.state = { data: { positions: [{ name: '', order: 1 }] } };
    } else {
      this.state = { data };
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { data: prevData } = prevState;
    const { data, hasInitialized, hasCompleted, mode, onClose } = this.props;
    const isNew = mode === 'new';

    if (!isNew) {
      const isReceivingInitData = hasInitialized && _.isEmpty(prevData);
      if (isReceivingInitData) {
        this.setState({ data });
      }
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
  handleNameChange = e => {
    const value = _.get(e, 'target.value', '').trim();
    const regExp = /^[a-z-]+$/gm;
    if (!_.isEmpty(value) && _.isNull(value.match(regExp))) {
      return;
    }

    this.handleChange({ name: value });
  };
  handleSwitch = (fromIndex, toIndex) => {
    let positions = _.get(this.state, 'data.positions', []);
    positions = _.move(positions, fromIndex, toIndex);
    positions = positions.map((position, i) => {
      return {
        ...position,
        order: i + 1
      };
    });
    this.handleChange({
      positions
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
    const name = _.get(data, 'name', '');
    const locale = _.get(data, 'locale', '');
    const frequency = _.get(data, 'frequency', '');
    const label = _.get(data, 'label', '');
    const footnoteLabel = _.get(data, 'footnoteLabel', '');
    const positions = _.get(data, 'positions', []);
    const { mode } = this.props;
    const isNew = mode === 'new';
    const hasLeastOnePosition = _.some(positions, p => p.name.length > 0);
    const isButtonEnabled =
      name &&
      frequency &&
      locale &&
      label &&
      footnoteLabel &&
      hasLeastOnePosition;
    const buttonKind =
      (isSaving && 'loading') || (hasCompleted && 'success') || 'default';
    const sortedPositions = _.orderBy(positions, 'order', 'asc');

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup label="Service Title" isRequired={true}>
          <StyledInput
            data-hj-whitelist
            type="text"
            value={label}
            maxLength={30}
            placeholder="e.g. English Service 中文堂"
            onChange={e => this.handleChange({ label: e.target.value })}
          />
        </FormGroup>
        <FormGroup label="URL Path" isRequired={isNew}>
          {isNew && (
            <StyledInput
              data-hj-whitelist
              value={name}
              maxLength={10}
              placeholder="e.g. english"
              onChange={this.handleNameChange}
            />
          )}
          {!isNew && name}
        </FormGroup>
        <FormGroup label="Frequency" isRequired={isNew}>
          {isNew && (
            <StyledSelect
              value={frequency}
              clearable={false}
              options={FREQUENCY_OPTIONS}
              placeholder="e.g. Sunday"
              onChange={e =>
                this.handleChange({
                  frequency: e.value
                })
              }
            />
          )}
          {!isNew && frequency}
        </FormGroup>
        <FormGroup label="Language" isRequired={isNew}>
          <StyledSelect
            value={locale}
            clearable={false}
            options={LANGUAGE_OPTIONS}
            placeholder="e.g. English (Australia)"
            onChange={e =>
              this.handleChange({
                locale: e.value
              })
            }
          />
        </FormGroup>
        <FormGroup label="Description Label" isRequired={true}>
          <StyledInput
            data-hj-whitelist
            type="text"
            value={footnoteLabel}
            maxLength={30}
            placeholder="e.g. Occassion"
            onChange={e => this.handleChange({ footnoteLabel: e.target.value })}
          />
        </FormGroup>
        <FormGroup label="Positions" align="top" isRequired={true}>
          <DragDropZone>
            <PositionList>
              {sortedPositions.map(({ id, name, order }, i) => (
                <StyledDraggableItem
                  key={id || i}
                  value={order}
                  no={i}
                  onSwitchPosition={(sourceNo, targetNo) =>
                    this.handleSwitch(sourceNo, targetNo)
                  }>
                  <IconDrag />
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
                </StyledDraggableItem>
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
  const selectedId = _.get(ownProps, 'data.id', 'creating');
  const data = _.get(resource, ['data', selectedId], {});

  const modifyStatus = _.get(resource, 'status.modify', {});
  const createStatus = _.get(resource, 'status.create', {});
  const isSaving =
    modifyStatus.loadingIds[selectedId] || createStatus.isLoading;
  const hasCompleted =
    modifyStatus.completedIds[selectedId] ||
    !_.isEmpty(createStatus.completedIds);

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
const StyledInput = styled(Input)`
  width: 195px;
`;
const StyledSelect = styled(Select)`
  font-size: 13px;
  font-family: system-ui;
  width: 195px;
`;
const IconDrag = styled(IconBar)`
  cursor: move;
  margin-right: 5px;
`;
const StyledDraggableItem = styled(DraggableItem)`
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
