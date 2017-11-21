import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  generateCalData,
  getMemberNames,
  getQuarterDays,
  getQuarterFirstMonth,
  getQuarterLastMonth,
  getRoles
} from '../utils';
import AddToCalendar from 'react-add-to-calendar';
import '../icalstyle.css';
import moment from 'moment';
import styled from 'styled-components';
import { media, MOBILE_BREAKPOINT } from '../styled';

export default class QuarterView extends Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date),
    data: PropTypes.object,
    onCellClick: PropTypes.func
  };
  static defaultProps = {
    date: new Date(),
    data: {},
    onCellClick: () => {}
  };
  handleCellClick = (day, role, member) => {
    const { data, onCellClick } = this.props;
    const names = getMemberNames(data.data);

    onCellClick({ day, role, member, names });
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
    const cellWidth = `${100 / (roles.length + 1)}%`;
    const startMonth = getQuarterFirstMonth(date).format('MMM');
    const endMonth = getQuarterLastMonth(date).format('MMM');
    const year = days[0].format('YYYY');
    const icalicon = { 'calendar-plus-o': 'left' };
    const icalitems = [{ apple: 'Apple Calendar' }, { google: 'Google' }];

    return (
      <Wrapper>
        <Header>
          {startMonth} - {endMonth} {year}
        </Header>
        <Grid>
          {!isMobile && (
            <Row>
              <Cell type="header" align="right" width={cellWidth}>
                <Text>Date / Role</Text>
              </Cell>
              {roles.map((role, i) => (
                <Cell key={i} type="header" width={cellWidth}>
                  <Text>{role}</Text>
                </Cell>
              ))}
            </Row>
          )}
          {days.map((day, i) => {
            const event = _.find(
              data.data,
              item =>
                moment(item.date).format('YYYY-MM-DD') ===
                day.format('YYYY-MM-DD')
            );
            const members = event ? event.members : [];
            let eventDesc = '';
            roles.forEach(role => {
              const member = _.find(members, { role }) || {};
              const name = member.name || '';
              eventDesc = eventDesc + role + '[' + name + '] ';
            });
            const icalEvent = generateCalData(day, eventDesc);
            const icalBtn = (
              <AddToCalendar
                event={icalEvent}
                listItems={icalitems}
                buttonTemplate={icalicon}
                buttonLabel=""
              />
            );

            const highlightDate = moment()
              .isoWeekday(7)
              .format('YYYY-MM-DD');

            return (
              <Row
                key={i}
                highlighted={day.format('YYYY-MM-DD') === highlightDate}>
                <Cell
                  overflow="visible"
                  type="header"
                  align="right"
                  width={cellWidth}>
                  {icalBtn} {day.format('DD MMM')}
                </Cell>
                {roles.map((role, i) => {
                  const member = _.find(members, { role }) || {};
                  const name = member.name || '';
                  return (
                    <Cell
                      key={i}
                      width={cellWidth}
                      onClick={this.handleCellClick.bind(
                        this,
                        day,
                        role,
                        name
                      )}>
                      <Label>{role}</Label>
                      <Text>{name}</Text>
                    </Cell>
                  );
                })}
              </Row>
            );
          })}
        </Grid>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  font-size: 13px;
  ${media.mobile`
    margin-top: 20px;
  `};
`;
const Header = styled.h1`
  border-radius: 4px 4px 0 0;
  color: #666;
  font-size 15px;
  padding: 15px 0;
  margin: 0;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  ${media.mobile`
    font-size: 14px;
    padding: 15px;
  `}
`;
const Grid = styled.div`
  border-left: solid 1px #f0f3f8;
  border-radius: 0 0 4px 4px;
  flex-wrap: wrap;
  margin: 0 0 3em 0;
  padding: 0;
  width: 100%;
`;
const Label = styled.span`
  display: none;
  flex-grow: 1;
  font-weight: bold;
  padding: 10px;
  ${media.mobile`
    display: inline-block;
  `};
`;
const Text = styled.span`
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Cell = styled.span`
  border-right: solid 1px #e6e6e6;
  color: #666;
  cursor: ${props => (props.type === 'header' ? 'default' : 'pointer')};
  flex-direction: column;
  flex-grow: 1;
  font-weight: ${props => (props.type === 'header' ? 'bold' : 'normal')};
  overflow: ${props => (props.overflow === 'visible' ? 'visible' : 'hidden')};
  padding: 10px;
  text-align: ${props => (props.align ? props.align : 'center')};
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${props => props.width};
  &:first-child {
    background-color: #e0e0e0;
    border-bottom: solid 1px #e0e0e0;
    border-right: solid 1px #e0e0e0;
  }
  ${media.mobile`
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    padding: 0;
    text-align: center;
    width: 50%;
    width: auto;
    ${props =>
      props.type === 'header' &&
      `
      background-color: #eee !important;
      display: block;
      padding: 0;
      width: auto;
      a {
        display: inline-block;
      }
    `}
    ${Label} {
      background: #eee;
      border-right: solid 1px #e6e6e6;
      padding: 10px;
      text-align: right;
      width: 30%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    ${Text} {
      padding: 10px;
      text-align: left;
      width: 70%;
    }
  `};
`;
const Row = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  width: 100%;
  ${Cell} {
    background-color: ${props => props.highlighted && '#ffc'};
  }
  &:nth-child(odd) {
    background-color: #f8f8f8;
    ${Cell}:first-child {
      background-color: #eee;
    }
    ${media.mobile`
      background-color: transparent;
    `};
  }
  &:first-child {
    background-color: #eee;
    ${Cell} {
      border-bottom: solid 1px #e6e6e6;
      &:first-child {
        background-color: #eee;
      }
    }
  }
  ${props =>
    props.highlighted &&
    `
      background-color: #faf2eb !important;
      ${Cell} {
        color: #7ac4f0 !important;
      }
  `}
  &:last-child ${Cell} {
    border-bottom: none;
    &:first-child {
      border-bottom-left-radius: 8px;
    }
    &:last-child {
      border-bottom-right-radius: 8px;
    }
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
  ${media.mobile`
    flex-direction: column;
    width: auto;
  `};
`;
