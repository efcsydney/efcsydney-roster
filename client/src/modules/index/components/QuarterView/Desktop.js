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
    let lastCellValue = null;
    let IsSingleValueRow = true;
	
    return (
      <Row key={formattedDay} highlighted={formattedDay === highlightDate}>
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
		{(lastCellValue = null)}
        {roles.map((role, i) => {
          const member = _.find(members, { role }) || {};
          const name = member.name || '';
          if (lastCellValue != null && name != lastCellValue) {
            IsSingleValueRow = false;
          }
          lastCellValue = name;
        })}
        {roles.map((role, i) => {
          const member = _.find(members, { role }) || {};
          const name = member.name || '';
          return (
            <NameCell
              key={i}
              colIndex={i}
              IsSingleValueRow={IsSingleValueRow}
              width={cellWidth}
              onClick={() => onRoleClick(day, role, name)}>
              <Text>{name}</Text>
            </NameCell>
          );
        })}
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
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Grid = styled.div`
  border-left: solid 1px #f0f3f8;
  border-radius: 0 0 8px 8px;
  display: table;
  margin: 0;
  padding: 0;
  table-layout: fixed;
  width: 100%;
`;
const Cell = styled.span`
  border-right: solid 1px #dadada;
  display: table-cell;
  overflow: hidden;
  padding: 10px;
  text-align: center;
  text-overflow: ellipsis;
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
  border-right: ${props => (props.IsSingleValueRow ? 'none' : '')};
  color: ${props =>
    props.IsSingleValueRow && props.colIndex != 3
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
