import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AddToCalendar from 'react-add-to-calendar';
import './icalstyle.css';
import moment from 'moment';
import { findEvent, getCalData } from 'utils';
import i18n from 'i18n';

export default class Mobile extends Component {
  displayName = 'Mobile';
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
  getTrans(key) {
    return i18n.t(`${this.displayName}.${key}`);
  }
  scrollToThisWeek = () => {
    const highlightedEl = document.getElementById('highlighted');
    if (highlightedEl) {
      highlightedEl.scrollIntoView();
    }
  };

  componentWillReceiveProps(nextProps) {
    const isInitialLoad = !this.props.events.length && nextProps.events.length;
    if (isInitialLoad) {
      setTimeout(() => {
        this.scrollToThisWeek();
      }, 500);
    }
  }

  renderRolesList(day, roles, members, serviceInfo) {
    const { onDayClick, onRoleClick } = this.props;
    const formattedDate = day.format('YYYY-MM-DD');

    if (serviceInfo.skipService) {
      return (
        <Row>
          <ExcludeReason onClick={() => onDayClick(formattedDate, serviceInfo)}>
            {serviceInfo.skipReason}
          </ExcludeReason>
        </Row>
      );
    }

    return roles.map((role, i) => {
      const member = _.find(members, { role }) || {};
      const name = member.name || '';
      return (
        <Row key={i}>
          <Role>{role}</Role>
          <Name onClick={() => onRoleClick(day, role, name)}>{name}</Name>
        </Row>
      );
    });
  }

  render() {
    const icalicon = { 'calendar-plus-o': 'left' };
    const icalitems = [
      { apple: this.getTrans('addCalByDownloadCsv') },
      { google: this.getTrans('addCalByGoogle') }
    ];
    const { events, days, roles, onDayClick } = this.props;

    return (
      <Grid>
        {days.map((day, i) => {
          const event = findEvent(events, day);
          const members = event ? event.members : [];
          const serviceInfo = _.get(event, 'serviceInfo', {});
          const icalEvent = getCalData(day, roles, members);
          const highlightDate = moment()
            .isoWeekday(7)
            .format('YYYY-MM-DD');
          const formattedDate = day.format('YYYY-MM-DD');
          const highlighted = day.format('YYYY-MM-DD') === highlightDate;

          return (
            <Day
              key={i}
              highlighted={highlighted}
              id={highlighted ? 'highlighted' : undefined}>
              <Header>
                <Label
                  onClick={() => {
                    onDayClick(formattedDate, serviceInfo);
                  }}>
                  {day.format(this.getTrans('dateFormat'))}
                </Label>
                {serviceInfo.footnote && (
                  <Footnote
                    onClick={() => {
                      onDayClick(formattedDate, serviceInfo);
                    }}>
                    {serviceInfo.footnote}
                  </Footnote>
                )}
                <Action>
                  <AddToCalendar
                    event={icalEvent}
                    listItems={icalitems}
                    buttonTemplate={icalicon}
                    buttonLabel={this.getTrans('addCalLabel')}
                  />
                </Action>
              </Header>
              {this.renderRolesList(day, roles, members, serviceInfo)}
            </Day>
          );
        })}
        <BottomDateBarSpace />
      </Grid>
    );
  }
}

const Grid = styled.div`
  border-left: solid 1px #f0f3f8;
  border-radius: 0 0 4px 4px;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  width: 100%;
`;
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
const ExcludeReason = Cell.extend`
  cursor: pointer;
  color: #ef4b3c;
  padding: 10px;
`;
const Header = Cell.extend`
  cursor: pointer;
  align-items: center;
  background-color: #eee;
  border: solid 1px #dadada;
  border-width: 1px 0;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
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
  background: #fff;
  cursor: pointer;
  color: ${props => (props.highlighted ? '#333' : '#666')};
  display: flex;
  flex-wrap: no-wrap;
  flex-direction: column;
  ${Name} {
    background-color: ${props => (props.highlighted ? '#ffc' : 'transparent')};
    border-bottom: solid 1px #eee;
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
  cursor: pointer;
  color: #000;
  display: inline-block;
  font-size: 15px;
  line-height: 1.2;
  padding: 10px;
  text-align: left;
`;
const Footnote = styled.span`
  cursor: pointer;
  display: inline-block;
  font-size: 11px;
  margin-left: 5px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: baseline;
`;
const Action = styled.span`
  display: inline-block;
  margin-left: auto;
  margin-right: 20px;
`;
const BottomDateBarSpace = styled.div`
  position: absolute;
  height: 50px;
  width: 100%;
`;
