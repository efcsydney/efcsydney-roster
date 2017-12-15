import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getMemberNames, getQuarterDays, getRoles } from '../../utils';
import '../../icalstyle.css';
import styled from 'styled-components';
import { MOBILE_BREAKPOINT } from '../../styled';
import Desktop from './Desktop';
import Mobile from './Mobile';

export default class QuarterView extends Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date),
    data: PropTypes.object,
    onDayClick: PropTypes.func,
    onRoleClick: PropTypes.func
  };
  static defaultProps = {
    date: new Date(),
    data: {},
    onDayClick: () => {},
    onRoleClick: () => {}
  };
  handleDayClick = (day, footnote) => {
    const { onDayClick } = this.props;

    onDayClick({ day, footnote });
  };
  handleRoleClick = (day, role, member) => {
    const { data, onRoleClick } = this.props;
    const names = getMemberNames(data.data);

    onRoleClick({ day, role, member, names });
  };
  handleWindowResize = () => {
    this.setState({
      isMobile: document.body.offsetWidth <= MOBILE_BREAKPOINT
    });
  };
  constructor(props) {
    super(props);

    this.state = {
      isMobile: false
    };
  }
  componentWillMount() {
    this.handleWindowResize();
    window.addEventListener('resize', _.debounce(this.handleWindowResize, 500));
  }
  render() {
    const { date, data } = this.props;
    const { isMobile } = this.state;
    const days = getQuarterDays(date, 7);
    const roles = getRoles(data.data);
    const viewProps = {
      events: data.data,
      days,
      roles,
      onDayClick: this.handleDayClick,
      onRoleClick: this.handleRoleClick
    };

    return (
      <Wrapper>
        {isMobile && <Mobile {...viewProps} />}
        {!isMobile && <Desktop {...viewProps} />}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  font-size: 13px;
`;
