import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Modal, StateButton } from 'components';
import styled from 'styled-components';

export default class Edit extends Component {
  static propTypes = {
    data: PropTypes.object,
    onClose: PropTypes.func
  };
  static defaultProps = {
    data: {},
    onClose: () => {}
  };
  constructor(props) {
    super(props);
    this.state = { label: props.data.label || '' };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ label: nextProps.data.label });
  }

  render() {
    let { data: { frequency, footnoteLabel, positions }, onClose } = this.props;
    positions = positions || [];
    return (
      <Modal isOpen={true} title="Edit Service" onClose={onClose}>
        <Form>
          <Row>
            <Label>Frequency</Label>
            <span>{frequency}</span>
          </Row>
          <Row>
            <Label>Service Title</Label>
            <span>
              <input
                type="text"
                value={this.state.label}
                onChange={e => {
                  this.setState({ label: e.target.value });
                }}
              />
            </span>
          </Row>
          <Row>
            <Label>Footnote</Label>
            <span>{footnoteLabel}</span>
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
