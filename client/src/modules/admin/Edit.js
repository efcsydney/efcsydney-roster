import _ from 'lodash';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Modal, StateButton, Input } from 'components';
import styled from 'styled-components';
import dotProp, { set } from 'dot-prop-immutable';
import IconMinusCircle from 'react-icons/lib/fa/minus-circle';
import Select from 'react-select';

export default class Edit extends Component {
  static propTypes = {
    data: PropTypes.object,
    onClose: PropTypes.func,
    onSave: PropTypes.func
  };
  static defaultProps = {
    data: {},
    onClose: () => {},
    onSave: () => {}
  };
  handleChange = change => {
    let data = _.clone(this.state.data);

    _.forOwn(change, (change, key) => {
      data = set(data, key, change);
    });

    this.setState({
      data
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
  constructor(props) {
    super(props);

    const { data } = props;
    this.state = { data };
  }
  render() {
    const { onClose } = this.props;
    const { data } = this.state;
    const frequency = _.get(data, 'frequency', '');
    const label = _.get(data, 'label', '');
    const footnoteLabel = _.get(data, 'footnoteLabel', '');
    const positions = _.get(data, 'positions', []);

    return (
      <Modal isOpen={true} title="Edit Service" onClose={onClose}>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Label>Frequency</Label>
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
            <Label>Service Title</Label>
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
            <Label>Footnote</Label>
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
                            [`positions.${i}.order`]: parseInt(
                              e.target.value,
                              10
                            )
                          })
                        }
                      />
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
            <StateButton type="submit">Save</StateButton>
          </Row>
        </Form>
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
  text-align: right;
  width: 125px;
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

const NumberInput = Input.extend`
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

const IconDelete = styled(IconMinusCircle)`
  color: #a00;
  font-size: 20px;
  margin-left: 4px;
`;

const StyleSelect = styled(Select)`
  width: 165px;
`;
StyleSelect.displayName = 'StyleSelect';
