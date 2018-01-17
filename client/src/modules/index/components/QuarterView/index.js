import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import Desktop from './Desktop';
import Mobile from './Mobile';
import { MOBILE_BREAKPOINT } from 'styled';
import { getMemberNames, getQuarterDays, getRoles } from 'utils';
import './icalstyle.css';
import ReactDOM from 'react-dom';

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
      isMobile: document.body.offsetWidth <= MOBILE_BREAKPOINT,
      calendarHeight: this.setCalendarHeight()
    });
  };
  setCalendarHeight = () => {
    let calendarTop = ReactDOM.findDOMNode(
      this.calendarWrapper
    ).getBoundingClientRect().top;

    return window.innerHeight - calendarTop - BottomDateBarHeight + 'px';
  };
  constructor(props) {
    super(props);

    this.state = {
      isMobile: false,
      calendarHeight: '0px'
    };
  }
  componentWillMount() {
    window.addEventListener('resize', _.debounce(this.handleWindowResize, 200));
  }
  componentDidMount() {
    this.handleWindowResize();
  }

  render() {
    const { date, data } = this.props;
    const { isMobile, calendarHeight } = this.state;
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
      <Wrapper
        ref={input => {
          this.calendarWrapper = input;
        }}
        calendarHeight={calendarHeight}>
        {isMobile && <Mobile {...viewProps} />}
        {!isMobile && <Desktop {...viewProps} />}
      </Wrapper>
    );
  }
}
const BottomDateBarHeight = 44; // DateBar.js Wraper.border-radius(8)*2 + Arrow.height(28) = 44
const Wrapper = styled.div`
  background: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  font-size: 13px;
  position: absolute;
  overflow: scroll;
  width: 100%;
  height: ${props => props.calendarHeight};
`;
