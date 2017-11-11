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
  render() {
    const { date, data } = this.props;
    const days = getQuarterDays(date, 7);
    const roles = getRoles(data.data);
    const cellWidth = `${100 / (roles.length + 1)}%`;
    const startMonth = getQuarterFirstMonth(date).format('MMM');
    const endMonth = getQuarterLastMonth(date).format('MMM');
    const year = days[0].format('YYYY');
    const icalicon = { 'calendar-plus-o': 'left' };

    return (
      <Wrapper>
        <Header>
          {startMonth} - {endMonth} {year} English Sunday Service Roster
        </Header>
        <Grid>
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
                <Cell type="header" align="right" width={cellWidth}>
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

const Wrapper = styled.div`font-size: 13px;`;
const Header = styled.h1`
  background: #eb7d3c;
  color: #fff;
  font-size 18px;
  padding: 5px 0;
  margin: 0 0 3px 0;
  text-align: center;
`;
const Grid = styled.div`
  border-left: solid 1px #fd9827;
  border-top: solid 1px #fd9827;
  flex-wrap: wrap;
  margin: 0 0 3em 0;
  padding: 0;
  width: 100%;
`;
const Cell = styled.span`
  background: ${props =>
    props.type === 'header' ? '#f6caae !important' : '#fff'};
  border-bottom: solid 1px #fd9827;
  border-right: solid 1px #fd9827;
  cursor: pointer;
  flex-direction: column;
  flex-grow: 1;
  font-weight: ${props => (props.type === 'header' ? 'bold' : 'normal')};
  padding: 10px;
  text-align: ${props => (props.align ? props.align : 'center')};
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${props => props.width};
`;
const Row = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  width: 100%;
  ${Cell} {
    background-color: ${props =>
      props.highlighted ? '#ffc !important' : 'transparent'};
  }
  &:nth-child(odd) ${Cell} {
    background-color: #fae4d6;
  }
`;
const Text = styled.span`
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
