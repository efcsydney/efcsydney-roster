import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import AddToCalendar from 'react-add-to-calendar';
import './icalstyle.css';
import moment from 'moment';
import { findEvent, getCalData } from 'utils';
import i18n from 'i18n';

const CAL_ICON = { 'calendar-plus-o': 'left' };
const CAL_ENABLED_TYPES = [{ apple: 'Apple Calendar' }, { google: 'Google' }];

const mapStateToProps = state => ({ lang: state.core.meta.lang });

export default connect(mapStateToProps)(
  class Desktop extends Component {
    displayName = 'Desktop';
    handleDayClick = (e, day, footnote) => {
      const isAddCalendar =
        e.target.className.indexOf('react-add-to-calendar') !== -1;
      if (isAddCalendar) {
        e.stopPropagation();
        return;
      }
      this.props.onDayClick(day, footnote);
    };
    renderNameCells(day, event) {
      const { roles, onRoleClick } = this.props;
      const members = event ? event.members : [];
      const serviceInfo = _.get(event, 'serviceInfo', {});
      const names = roles.map(role => {
        const member = _.find(members, { role }) || {};
        return member.name || '';
      });

      const isSkipService = serviceInfo.skipService || false;
      if (isSkipService) {
        const skipReason = serviceInfo.skipReason || '';
        return (
          <NameCell
            colSpan={names.length}
            onClick={e => this.handleDayClick(e, day, event.serviceInfo)}>
            {skipReason}
          </NameCell>
        );
      }

      return names.map((name, i) => (
        <NameCell key={i} onClick={() => onRoleClick(day, roles[i], name)}>
          <Text>{name}</Text>
        </NameCell>
      ));
    }
    renderCalendar(day, roles, members) {
      const event = getCalData(day, roles, members);

      return (
        <AddToCalendar
          event={event}
          listItems={CAL_ENABLED_TYPES}
          buttonTemplate={CAL_ICON}
          buttonLabel=""
        />
      );
    }
    renderDayRow(day) {
      const { events, roles } = this.props;
      const event = findEvent(events, day);
      const members = event ? event.members : [];
      const highlightDate = moment()
        .isoWeekday(7)
        .format('YYYY-MM-DD');
      const formattedDay = day.format('YYYY-MM-DD');
      const highlighted = formattedDay === highlightDate;
      const serviceInfo = _.get(event, 'serviceInfo', {});

      return (
        <Row key={formattedDay} highlighted={highlighted}>
          <DayCell
            onClick={e => this.handleDayClick(e, formattedDay, serviceInfo)}>
            {this.renderCalendar(day, roles, members)}
            {day.format(i18n.t(`${this.displayName}.dateFormat`))}
          </DayCell>
          <NameCell
            onClick={e => this.handleDayClick(e, formattedDay, serviceInfo)}>
            {_.get(serviceInfo, 'footnote', '')}
          </NameCell>
          {this.renderNameCells(day, event)}
        </Row>
      );
    }
    render() {
      const { roles, days } = this.props;
      const cellWidth = `${100 / (roles.length + 1)}%`;

      return (
        <Grid>
          <thead>
            <Row>
              <Header width={cellWidth}>
                <Text>{i18n.t(`${this.displayName}.gridCanton`)}</Text>
              </Header>
              <Header>
                <Text>{i18n.t(`${this.displayName}.occassion`)}</Text>
              </Header>
              {roles.map((role, i) => (
                <Header key={i}>
                  <Text>{role}</Text>
                </Header>
              ))}
            </Row>
          </thead>
          <tbody>{days.map(day => this.renderDayRow(day))}</tbody>
        </Grid>
      );
    }
  }
);

const Text = styled.span`
  overflow: hidden;
  white-space: nowrap;
`;
const Grid = styled.table`
  border-collapse: collapse;
  border-left: solid 1px #f0f3f8;
  border-radius: 0 0 8px 8px;
  margin: 0;
  padding: 0;
  table-layout: fixed;
  min-width: 100%;
`;
const Cell = styled.td`
  border: solid 1px #eee;
  border-width: 0 1px 0 0;
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
  border-right: solid 1px #eee;
  color: #666;
  cursor: pointer;
  font-weight: bold;
  overflow: visible;
  text-align: right;
`;
const NameCell = Cell.extend`
  cursor: pointer;
  &[colspan] {
    border-color: #eee;
    border-width: 1px 1px 1px 0;
  }
`;
const Row = styled.tr`
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
