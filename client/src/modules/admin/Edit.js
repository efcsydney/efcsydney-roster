import _ from 'lodash';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Modal, StateButton, Input } from 'components';
import styled from 'styled-components';

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
    const data = _.clone(this.state.data);

    this.setState({
      data: {
        ...data,
        ...change
      }
    });
  };
  handleSubmit = e => {
    const { onSave } = this.props;
    const { data } = this.state;

    e.preventDefault();

    onSave(data);
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
              <select
                value={frequency}
                onChange={e =>
                  this.handleChange({
                    frequency: e.target.value
                  })
                }>
                <option value="Sunday">Sunday</option>
                <option value="Saturday">Saturday</option>
                <option value="Month">Monthly</option>
              </select>
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
          <Row>
            <Label>Positions</Label>
            <span>
              <ul>
                {positions.map(({ id, name }) => <li key={id}>{name}</li>)}
              </ul>
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
