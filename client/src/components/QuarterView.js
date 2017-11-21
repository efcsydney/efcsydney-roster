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
        <Header className="zindexTitle">
          {startMonth} - {endMonth} {year} English Sunday Service Roster
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
            const event = _.find(data.data, { date: day.format('YYYY-MM-DD') });
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
                buttonLabel={day.format('DD MMM')}
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
                  {icalBtn}
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
  font-size: 13px;
  ${media.mobile`
    margin-top: 40px;
  `};
`;
const Header = styled.h1`
  position: fixed;
  left: 10px;
  padding: 10px;
  right: 10px;
  background: #eb7d3c;
  color: #fff;
  font-size 18px;
  padding: 5px;
  margin: 0 0 3px 0;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  ${media.mobile`
    font-size: 14px;
    top: 0;
  `}
`;
const Grid = styled.div`
  border-left: solid 1px #fd9827;
  border-top: solid 1px #fd9827;
  flex-wrap: wrap;
  margin: 0 0 3em 0;
  padding: 40px 0px 0px 0px;
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
  background: ${props => (props.type === 'header' ? '#f6caae' : 'transparent')};
  border-bottom: solid 1px #fd9827;
  border-right: solid 1px #fd9827;
  cursor: pointer;
  flex-direction: column;
  flex-grow: 1;
  font-weight: ${props => (props.type === 'header' ? 'bold' : 'normal')};
  overflow: ${props => (props.overflow === 'visible' ? 'visible' : 'hidden')};
  padding: 10px;
  text-align: ${props => (props.align ? props.align : 'center')};
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${props => props.width};
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
      background-color: #f6caae !important;
      display: block;
      padding: 5px;
      width: auto;
      a {
        display: inline-block;
      }
    `}
    ${Label} {
      background: #f6caae;
      border-right: solid 1px #fd9827;
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
    background-color: #fae4d6;
    ${media.mobile`
      background-color: transparent;
    `};
  }
  ${media.mobile`
    flex-direction: column;
    width: auto;
  `};
`;
