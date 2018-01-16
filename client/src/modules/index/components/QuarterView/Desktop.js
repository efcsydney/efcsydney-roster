import _ from 'lodash';
import React, { Component } from 'react';
import styled from 'styled-components';
import AddToCalendar from 'react-add-to-calendar';
import './icalstyle.css';
import moment from 'moment';
import { findEvent, getCalData } from 'utils';

export default class Desktop extends Component {
  handleDayClick = (e, day, footnote) => {
    const isAddCalendar =
      e.target.className.indexOf('react-add-to-calendar') !== -1;
    if (isAddCalendar) {
      e.stopPropagation();
      return;
    }
    this.props.onDayClick(day, footnote);
  };
  renderDayRow(day, cellWidth) {
    const { events, roles, onRoleClick } = this.props;
    const event = findEvent(events, day);
    const members = event ? event.members : [];
    const footnote = event ? event.footnote : '';
    const icalEvent = getCalData(day, roles, members);
    const highlightDate = moment()
      .isoWeekday(7)
      .format('YYYY-MM-DD');
    const icalicon = { 'calendar-plus-o': 'left' };
    const icalitems = [{ apple: 'Apple Calendar' }, { google: 'Google' }];
    const formattedDay = day.format('YYYY-MM-DD');
    let names = [];
    roles.map(role => {
      const member = _.find(members, { role }) || {};
      names.push(member.name || '');
    });
    const isSingleValueRow = names.every((val, i, arr) => val === arr[0]);
    const highlighted = formattedDay === highlightDate;
    const nameCells = names.map((name, i) => {
      return (
        <NameCell
          key={i}
          colIndex={i}
          isSingleValueRow={isSingleValueRow}
          width={cellWidth}
          onClick={() => onRoleClick(day, roles[i], name)}>
          <Text>{name}</Text>
        </NameCell>
      );
    });

    return (
      <Row key={formattedDay} highlighted={highlighted}>
        <DayCell
          onClick={e => this.handleDayClick(e, day, footnote)}
          width={cellWidth}>
          <AddToCalendar
            event={icalEvent}
            listItems={icalitems}
            buttonTemplate={icalicon}
            buttonLabel=""
          />
          {day.format('DD MMM')}
        </DayCell>
        {nameCells}
      </Row>
    );
  }
  render() {
    const { roles, days } = this.props;
    const cellWidth = `${100 / (roles.length + 1)}%`;

    return (
      <Grid>
        <Row>
          <Header width={cellWidth}>
            <Text>Date / Role</Text>
          </Header>
          {roles.map((role, i) => (
            <Header key={i} width={cellWidth}>
              <Text>{role}</Text>
            </Header>
          ))}
        </Row>
        {days.map(day => this.renderDayRow(day, cellWidth))}
      </Grid>
    );
  }
}

const Text = styled.span`
  overflow: hidden;
  white-space: nowrap;
`;
const Grid = styled.div`
  border-left: solid 1px #f0f3f8;
  border-radius: 0 0 8px 8px;
  display: table;
  margin: 0;
  padding: 0;
  table-layout: fixed;
  min-width:100%;
`;
const Cell = styled.span`
  border-right: solid 1px #dadada;
  display: table-cell;
  overflow: hidden;
  padding: 10px;
  text-align: center;
  white-space: nowrap;
  width: ${props => props.width};
`;
const Header = Cell.extend`
  background-color: #eee;
  border-bottom: solid 1px #dadada;
  border-top: solid 1px #dadada;
  color: #666;
  font-weight: bold;
  text-align: center;
`;
const DayCell = Cell.extend`
  border-right: solid 1px #dadada;
  color: #666;
  cursor: pointer;
  font-weight: bold;
  overflow: visible;
  text-align: right;
`;
const NameCell = Cell.extend`
  cursor: pointer;
  border-right: ${props => (props.isSingleValueRow ? 'none' : '')};
  color: ${props =>
    props.isSingleValueRow && props.colIndex !== 3
      ? 'rgba(255,255,255,0) !important'
      : ''};
`;
const Row = styled.div`
  display: table-row;
  width: 100%;
  &:nth-child(odd) {
    background-color: #f8f8f8;
  }
  &:nth-child(odd) ${DayCell} {
    background-color: #eee;
  }
  &:nth-child(even) ${DayCell} {
    background-color: #f8f8f8;
  }
  ${NameCell} {
    background-color: ${props => (props.highlighted ? '#ffc' : 'transparent')};
    color: ${props => (props.highlighted ? '#333' : '#666')};
  }
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
  &:last-child ${DayCell} {
    border-bottom: none;
    border-bottom-left-radius: 8px;
  }
  &:last-child ${NameCell}:last-child {
    border-bottom: none;
    border-bottom-right-radius: 8px;
  }
`;
