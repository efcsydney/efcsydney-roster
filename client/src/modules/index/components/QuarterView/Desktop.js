import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { media } from 'styled';
import AddToCalendar from 'react-add-to-calendar';
import './icalstyle.css';
import moment from 'moment';
import { getCalData } from 'utils';
import i18n from 'i18n';
import InlineSelect from './InlineSelect';

const CAL_ICON = { 'calendar-plus-o': 'left' };
const CAL_ENABLED_TYPES = [
  { apple: i18n.t('Desktop.addCalByDownloadCsv') },
  { google: i18n.t('Desktop.addCalByGoogle') }
];

const mapStateToProps = state => {
  const services = _.get(state.core, 'data.services', []);
  const selectedServiceName = _.get(state.core, 'meta.service', 'english');

  return {
    events: _.get(state.index, 'data', []),
    selectedService: _.find(services, { name: selectedServiceName }),
    selectedData: _.get(state.index, 'meta.selectedData', null)
  };
};
export default connect(mapStateToProps)(
  class Desktop extends Component {
    displayName = 'Desktop';
    static propTypes = {
      events: PropTypes.array,
      members: PropTypes.array,
      selectedData: PropTypes.object,
      selectedService: PropTypes.object
    };
    static defaultProps = {
      events: PropTypes.array,
      members: [],
      selectedData: {},
      selectedService: {}
    };
    handleDayClick = (e, dateString, serviceInfo) => {
      const isAddCalendar =
        e.target.className.indexOf('react-add-to-calendar') !== -1;
      if (isAddCalendar) {
        e.stopPropagation();
        return;
      }
      this.props.onDayClick(dateString, serviceInfo);
    };
    getTrans(key) {
      return i18n.t(`${this.displayName}.${key}`);
    }
    renderNameCells(date, members, serviceInfo) {
      const { roles, onRoleClick, selectedData } = this.props;
      const names = members.map(member => member.name);
      const isSkipService = serviceInfo.skipService || false;
      if (isSkipService) {
        const skipReason = serviceInfo.skipReason || '';
        return (
          <NameCell
            colSpan={names.length}
            onClick={e => this.handleDayClick(e, date, serviceInfo)}>
            {skipReason}
          </NameCell>
        );
      }

      const selectedDateString = selectedData
        ? moment(selectedData.day).format('YYYY-MM-DD')
        : '';
      const selectedRole = _.get(selectedData, 'role', null);
      const isSelectedDay = date === selectedDateString;
      return roles.map((role, i) => {
        const member = _.find(members, { role }) || {};
        const name = _.get(member, 'name', '');
        const roleName = _.get(member, 'role', '');
        const isSelected = isSelectedDay && selectedRole === roleName;
        return (
          <NameCell
            isSelected={isSelected}
            key={i}
            onClick={() => onRoleClick(date, roles[i], name)}>
            <Text>{name}</Text>
            {isSelected && (
              <InlineSelect
                date={selectedDateString}
                role={selectedRole}
                names={this.props.members}
                value={name}
              />
            )}
          </NameCell>
        );
      });
    }
    renderCalendar(day, members) {
      const event = getCalData(day, members);

      return (
        <AddToCalendar
          event={event}
          listItems={CAL_ENABLED_TYPES}
          buttonTemplate={CAL_ICON}
          buttonLabel=""
        />
      );
    }
    renderDayRow({ date, members, serviceInfo }) {
      const highlightDate = moment()
        .isoWeekday(7)
        .format('YYYY-MM-DD');
      const isHighlighted = date === highlightDate;

      return (
        <Row key={date} highlighted={isHighlighted}>
          <DayCell onClick={e => this.handleDayClick(e, date, serviceInfo)}>
            {moment(date).format(this.getTrans('dateFormat'))}
            {this.renderCalendar(date, members)}
          </DayCell>
          <NoteCell onClick={e => this.handleDayClick(e, date, serviceInfo)}>
            {_.get(serviceInfo, 'footnote', '')}
          </NoteCell>
          {this.renderNameCells(date, members, serviceInfo)}
        </Row>
      );
    }
    render() {
      const { roles, events, selectedService } = this.props;
      const footnoteLabel = _.get(selectedService, 'footnoteLabel', '');
      const sortedEvents = _.sortBy(events, 'date');

      return (
        <Grid role="grid">
          <thead>
            <Row>
              <Header>
                <Text>{this.getTrans('gridCanton')}</Text>
              </Header>
              <Header>
                <Text>{footnoteLabel}</Text>
              </Header>
              {roles.map((role, i) => (
                <Header key={i}>
                  <Text>{role}</Text>
                </Header>
              ))}
            </Row>
          </thead>
          <tbody>{sortedEvents.map(event => this.renderDayRow(event))}</tbody>
        </Grid>
      );
    }
  }
);

const Text = styled.span`
  overflow: hidden;
  white-space: nowrap;
  &:empty:before {
    color: #ccc;
    content: '-';
  }
  ${media.print`
    white-space: normal;
    line-height: 1.2;
  `};
`;
const Grid = styled.table`
  border-collapse: collapse;
  border-left: solid 1px #f0f3f8;
  border-radius: 0 0 8px 8px;
  margin: 0;
  padding: 0;
  table-layout: fixed;
  min-width: 100%;
  ${media.print`
    font-size: 11px;
    min-width: 0;
    width: 100%;
  `};
`;
const Cell = styled.td`
  border: solid 1px #eee;
  border-width: 0 1px 0 0;
  padding: 10px;
  text-align: center;
  white-space: nowrap;
  width: ${props => props.width};
  &:empty:before {
    padding: 0;
    color: #ccc;
    content: '-';
  }
  ${media.print`
    font-size: 11px;
    line-height: 1.3;
    padding: 8px 4px;
    white-space: normal;
  `};
`;
const Header = Cell.extend`
  background-color: #eee;
  border-bottom: solid 1px #dadada;
  border-top: solid 1px #dadada;
  color: #666;
  font-weight: bold;
  text-align: center;
  ${media.print`
    font-size: 11px;
  `};
`;
const DayCell = Cell.extend`
  border-right: solid 1px #eee;
  color: #666;
  cursor: pointer;
  font-weight: bold;
  overflow: visible;
  text-align: right;
  ${media.print`
    text-align: center;
    white-space: nowrap;
  `};
`;
const NameCell = Cell.extend`
  cursor: pointer;
  position: relative;
  &[colspan] {
    border-color: #eee;
    border-width: 1px 1px 1px 0;
  }
  ${props => props.isSelected && `z-index: 1`};
`;
const NoteCell = NameCell.extend`
  line-height: 1.2;
  min-width: 75px;
  max-width: 120px;
  overflow: hidden;
  padding: 5px 8px;
  text-overflow: ellipsis;
  white-space: normal;
  font-size: 12px;
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
  ${NameCell}, ${NoteCell} {
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
  ${media.print`
    ${NameCell}, ${NoteCell} {
      background-color: transparent;
      color: #666;
    }
  `};
`;
