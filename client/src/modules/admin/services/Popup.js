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

class Popup extends Component {
  static propTypes = {
    data: PropTypes.object,
    mode: PropTypes.oneOf(['new', 'edit']).isRequired,
    isLoading: PropTypes.bool,
    hasCompleted: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func
  };
  static defaultProps = {
    data: {},
    isLoading: false,
    hasCompleted: false,
    onClose: () => {},
    onSave: () => {}
  };
  constructor(props) {
    super(props);

    const { data } = props;
    this.state = { data };
  }
  componentWillReceiveProps(nextProps) {
    const { data: prevData, isSaving: isPrevSaving, onClose } = this.props;
    const { data: nextData, hasCompleted: hasNextCompleted } = nextProps;

    if (_.isEmpty(prevData) && !_.isEmpty(nextData)) {
      this.setState({ data: nextData });
    }

    if (isPrevSaving && hasNextCompleted) {
      setTimeout(() => {
        onClose();
      }, 500);
    }
  }
  handleChange = change => {
    let data = _.clone(this.state.data);

    _.forOwn(change, (change, key) => {
      data = set(data, key, change);
    });

    this.setState({
      data
    });
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
        <Row>
          <Label required>Frequency</Label>
          <span>
            <StyleSelect
              value={frequency}
              disabled={!isNew}
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
            <DragDropZone>
              <PositionList>
                {positions.map(({ id, name, order }, i) => {
                  return (
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
                  );
                })}
                <PositionItem>
                  <AddPositionLink onClick={this.handlePositionAdd}>
                    Add New Position
                  </AddPositionLink>
                </PositionItem>
              </PositionList>
            </DragDropZone>
          </span>
        </Row>
        <Row align="center">
          <StateButton
            kind={buttonKind}
            type="submit"
            disabled={!isButtonEnabled}>
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

export default withResource('services', (resource, state, ownProps) => {
  const selectedId = _.get(ownProps, 'data.id');
  const status = _.get(resource, 'status.modify', {});
  const isSaving = status.loadingIds[selectedId];
  const hasCompleted = status.completedIds[selectedId];

  return {
    data: _.get(resource, ['data', selectedId], {}),
    isSaving,
    hasCompleted
  };
})(Popup);

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

const PositionItem = styled.li`
  align-items: center;
  display: flex;
  margin-bottom: 4px;
  &:last-child {
    margin-bottom: 0;
  }
`;
PositionItem.displayName = 'PositionItem';

const PositionList = styled.ol`
  background: #eee;
  border-radius: 4px;
  padding: 5px;
`;
PositionList.displayName = 'PositionList';

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

const StyleIconBar = styled(IconBar)`
  cursor: move;
  margin-right: 5px;
`;
StyleIconBar.displayName = 'StyleIconBar';

const StyleDraggableItem = styled(DraggableItem)`
  display: flex;
  align-items: center;
  &[aria-grabbed='true'] {
    opacity: 0.5;
  }
  &[aria-dropeffect='move'] {
    background: #c1c1c1;
  }
`;
StyleDraggableItem.displayName = 'StyleDraggableItem';
