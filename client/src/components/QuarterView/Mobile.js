import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AddToCalendar from 'react-add-to-calendar';
import '../../icalstyle.css';
import moment from 'moment';
import { findEvent, getCalData } from '../../utils';
import { Grid } from './styled';

export default class Mobile extends Component {
  static propTypes = {
    events: PropTypes.array,
    days: PropTypes.array,
    roles: PropTypes.array,
    onDayClick: PropTypes.func,
    onRoleClick: PropTypes.func
  };
  static defaultProps = {
    events: [],
    days: [],
    roles: [],
    onDayClick: () => {},
    onRoleClick: () => {}
  };

  render() {
    const icalicon = { 'calendar-plus-o': 'left' };
    const icalitems = [{ apple: 'Apple Calendar' }, { google: 'Google' }];
    const { events, days, roles, onDayClick, onRoleClick } = this.props;

    return (
      <Grid>
        {days.map((day, i) => {
          const event = findEvent(events, day);
          const members = event ? event.members : [];
          const footnote = event ? event.footnote : '';
          const icalEvent = getCalData(day, roles, members);
          const highlightDate = moment()
            .isoWeekday(7)
            .format('YYYY-MM-DD');

          return (
            <Day
              key={i}
              highlighted={day.format('YYYY-MM-DD') === highlightDate}>
              <Header
                onClick={e => {
                  const isAddCalendar =
                    e.target.className.indexOf('react-add-to-calendar') !== -1;
                  if (isAddCalendar) {
                    e.stopPropagation();
                    return;
                  }
                  onDayClick(day, footnote);
                }}>
                <Label>{day.format('DD MMM')}</Label>
                <Action>
                  <AddToCalendar
                    event={icalEvent}
                    listItems={icalitems}
                    buttonTemplate={icalicon}
                    buttonLabel="Remind Me"
                  />
                </Action>
              </Header>
              {roles.map((role, i) => {
                const member = _.find(members, { role }) || {};
                const name = member.name || '';
                return (
                  <Row key={i}>
                    <Role>{role}</Role>
                    <Name onClick={() => onRoleClick(day, role, name)}>
                      {name}
                    </Name>
                  </Row>
                );
              })}
            </Day>
          );
        })}
      </Grid>
    );
  }
}

const Cell = styled.span`
  color: #666;
  flex-grow: 1;
  overflow: hidden;
  padding: 0;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: auto;
`;
const Header = Cell.extend`
  align-items: center;
  background-color: #eee;
  border: solid 1px #dadada;
  border-width: 1px 0;
  display: flex;
  font-weight: bold;
  overflow: visible;
  padding: 0;
  width: auto;
  a {
    display: inline-block;
  }
`;
const Role = Cell.extend`
  background: #eee;
  border-right: solid 1px #dadada;
  font-weight: bold;
  overflow: hidden;
  padding: 10px;
  text-align: right;
  text-overflow: ellipsis;
  width: 30%;
`;
const Name = Cell.extend`
  cursor: pointer;
  padding: 10px;
  text-align: left;
  width: 70%;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  &:nth-child(odd) {
    background-color: #f8f8f8;
  }
  &:nth-child(odd) ${Role} {
    background-color: #eee;
  }
  &:nth-child(even) ${Role} {
    background-color: #f8f8f8;
  }
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
  &:last-child ${Role} {
    border-bottom: none;
  }
`;
const Day = styled.div`
  color: ${props => (props.highlighted ? '#333' : '#666')};
  display: flex;
  flex-wrap: no-wrap;
  flex-direction: column;
  ${Name} {
    background-color: ${props => (props.highlighted ? '#ffc' : 'transparent')};
  }
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
  &:last-child ${Row}:last-child ${Role} {
    border-bottom: none;
    border-bottom-left-radius: 8px;
  }
  &:last-child ${Row}:last-child ${Name} {
    border-bottom: none;
    border-bottom-right-radius: 8px;
  }
`;
const Label = styled.span`
  color: #000;
  display: inline-block;
  font-size: 15px;
  padding: 10px;
`;
const Action = styled.span`
  display: inline-block;
  margin-left: auto;
  margin-right: 20px;
`;
