import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ICalLink from 'react-icalendar-link';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { media } from 'styled';
import moment from 'moment';
import { getCalData } from 'utils';
import { isHighlighted } from './utils';
import i18n from 'i18n';
import InlineSelect from './InlineSelect';
import IconCalendar from 'react-icons/lib/fa/calendar-plus-o';

const mapStateToProps = state => {
  const services = _.get(state, 'resource.data.services', {});
  const selectedServiceName = _.get(state, 'core.meta.category', 'english');
  const selectedService = _.find(services, { name: selectedServiceName }) || {};
  const positions = selectedService.positions || [];

  return {
    events: _.get(state.index, 'data', []),
    positions,
    selectedData: _.get(state.index, 'meta.selectedData', null),
    selectedService
  };
};
export default connect(mapStateToProps)(
  class Desktop extends Component {
    displayName = 'Desktop';
    static propTypes = {
      events: PropTypes.array,
      frequency: PropTypes.string,
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
    handleCalClick = e => {
      e.stopPropagation();
    };
    handleDayClick = (e, dateString, serviceInfo) => {
      this.props.onDayClick(dateString, serviceInfo);
    };
    getTrans(key) {
      return i18n.t(`${this.displayName}.${key}`);
    }
    renderNameCells(date, members, serviceInfo) {
      const { positions, onRoleClick, selectedData } = this.props;
      const names = members.map(member => member.name);
      const isSkipService = serviceInfo.skipService || false;
      const id = serviceInfo.id || null;
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
      return _.orderBy(positions, 'order', 'asc').map((position, i) => {
        const member = _.find(members, { role: position.name }) || {};
        const name = _.get(member, 'name', '');
        const roleName = _.get(member, 'role', '');
        const isSelected = isSelectedDay && selectedRole === roleName;
        return (
          <NameCell
            isSelected={isSelected}
            key={i}
            onClick={() => onRoleClick(date, position.name, name)}>
            <Text>{name}</Text>
            {isSelected && (
              <InlineSelect
                id={id}
                serviceInfo={serviceInfo}
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
        <CalLink event={event}>
          <IconCalendar />
        </CalLink>
      );
    }
    renderDayRow(date, positions, matchedEvent) {
      const {
        selectedService: { frequency }
      } = this.props;
      const serviceInfo = _.get(matchedEvent, 'serviceInfo', {});
      const members = _.get(matchedEvent, 'members', []);

      positions = _.orderBy(positions, 'order', 'asc').map(({ id, name }) => {
        const member = _.find(members, { role: name }) || {};
        return {
          id: id,
          role: name,
          name: member.name || ''
        };
      });

      return (
        <Row key={date} highlighted={isHighlighted(date, frequency)}>
          <DayCell onClick={e => this.handleDayClick(e, date, serviceInfo)}>
            {moment(date).format(this.getTrans('dateFormat'))}
            {this.renderCalendar(date, members)}
          </DayCell>
          <NoteCell onClick={e => this.handleDayClick(e, date, serviceInfo)}>
            {_.get(serviceInfo, 'footnote', '')}
          </NoteCell>
          {this.renderNameCells(date, positions, serviceInfo)}
        </Row>
      );
    }
    render() {
      const { days, events, selectedService } = this.props;
      const footnoteLabel = _.get(selectedService, 'footnoteLabel', '');
      const positions = _.get(selectedService, 'positions', []);

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
              {_.orderBy(positions, 'order', 'asc').map((position, i) => (
                <Header key={i}>
                  <Text>{position.name}</Text>
                </Header>
              ))}
            </Row>
          </thead>
          <tbody>
            {days.map(day => {
              const matchedEvent = _.find(events, { date: day });
              return this.renderDayRow(day, positions, matchedEvent);
            })}
          </tbody>
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
    border: solid 2px black;
    zoom: 94%;
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
    border: dashed 1px black;
    word-break: break-word;
  `};
`;
const Header = styled(Cell)`
  background-color: #eee;
  border-bottom: solid 1px #dadada;
  border-top: solid 1px #dadada;
  color: #666;
  font-weight: bold;
  text-align: center;
  ${media.print`
    font-size: 11px;
    background-color: #242a34;
    border-bottom: solid 2px black;
    border-top: solid 2px black;
    color: white;
  `};
`;
const DayCell = styled(Cell)`
  border-right: solid 1px #eee;
  color: #666;
  cursor: pointer;
  font-weight: bold;
  overflow: visible;
  text-align: right;
  ${media.print`
    text-align: center;
    white-space: nowrap;
    border-right: dashed 1px black;
    color: black;
  `};
`;
const NameCell = styled(Cell)`
  cursor: pointer;
  position: relative;
  &[colspan] {
    border-color: #eee;
    border-width: 1px 1px 1px 0;
  }
  ${props => props.isSelected && `z-index: 1`};
  ${media.print`
    &[colspan] {
        border-color: black;
    }
  `};
`;
const NoteCell = styled(NameCell)`
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
    background-color: ${props =>
      props.highlighted ? '#ffc !important' : 'transparent !important'};
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
      color: black;
    }
  `};
`;
const CalLink = styled(ICalLink)`
  margin-left: 5px;
  &:link,
  &:visited {
    color: #666;
  }
  ${media.print`
    display: none;
  `};
`;
