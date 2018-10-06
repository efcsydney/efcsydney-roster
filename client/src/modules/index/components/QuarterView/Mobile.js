import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ICalLink from 'react-icalendar-link';
import moment from 'moment';
import { getCalData } from 'utils';
import IconEdit from 'react-icons/lib/fa/pencil';
import i18n from 'i18n';
import EditRole from '../EditRole';
import { isHighlighted } from './utils';

const mapStateToProps = state => {
  const {
    meta: { isEditingRole }
  } = state.index;
  const services = _.get(state, 'resource.data.services', {});
  const selectedServiceName = _.get(state, 'core.meta.category', 'english');
  const selectedService = _.find(services, { name: selectedServiceName }) || {};

  return {
    events: _.get(state.index, 'data', []),
    isEditingRole,
    selectedData: _.get(state.index, 'meta.selectedData', null),
    selectedService
  };
};
export default connect(mapStateToProps)(
  class Mobile extends Component {
    displayName = 'Mobile';
    static propTypes = {
      events: PropTypes.array,
      frequency: PropTypes.string,
      members: PropTypes.array,
      onDayClick: PropTypes.func,
      onRoleClick: PropTypes.func,
      selectedData: PropTypes.object,
      selectedService: PropTypes.object
    };
    static defaultProps = {
      events: [],
      members: [],
      onDayClick: () => {},
      onRoleClick: () => {},
      selectedData: {},
      selectedService: {}
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
    handleBackTopClick = e => {
      e.preventDefault();

      const navbarEl = document.getElementById('navbar');
      if (navbarEl) {
        navbarEl.scrollIntoView();
      }
    };

    componentWillReceiveProps(nextProps) {
      const isInitialLoad =
        !this.props.events.length && nextProps.events.length;
      if (isInitialLoad) {
        setTimeout(() => {
          this.scrollToThisWeek();
        }, 500);
      }
    }

    renderRolesList(day, roles, members, serviceInfo) {
      const { onDayClick, onRoleClick, selectedService } = this.props;
      const positions = _.get(selectedService, 'positions', []);
      const formattedDate = moment(day).format('YYYY-MM-DD');

      if (serviceInfo.skipService) {
        return (
          <Row>
            <ExcludeReason
              onClick={() => onDayClick(formattedDate, serviceInfo)}>
              {serviceInfo.skipReason}
            </ExcludeReason>
          </Row>
        );
      }

      return positions.map((position, i) => {
        const role = position.name;
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
      const {
        days,
        events,
        selectedService: { frequency },
        isEditingRole,
        onDayClick
      } = this.props;
      return (
        <Grid>
          {days.map(day => {
            const matchedEvent = _.find(events, { date: day });
            const members = _.get(matchedEvent, 'members', []);
            const serviceInfo = _.get(matchedEvent, 'serviceInfo', {});
            const roles = members.map(member => member.role);
            const calData = getCalData(day, roles, members);
            const formattedDate = day;
            const highlighted = isHighlighted(day, frequency);

            return (
              <Day
                key={day}
                highlighted={highlighted}
                id={highlighted ? 'highlighted' : undefined}>
                <Header>
                  <Label
                    onClick={() => {
                      onDayClick(formattedDate, serviceInfo);
                    }}>
                    {moment(day).format(this.getTrans('dateFormat'))}
                  </Label>
                  <SettingLink
                    onClick={() => {
                      onDayClick(formattedDate, serviceInfo);
                    }}>
                    <IconEdit />
                  </SettingLink>
                  {serviceInfo.footnote && (
                    <Footnote
                      onClick={() => {
                        onDayClick(formattedDate, serviceInfo);
                      }}>
                      {serviceInfo.footnote}
                    </Footnote>
                  )}
                  <Action>
                    <ICalLink event={calData} />
                  </Action>
                </Header>
                {this.renderRolesList(day, roles, members, serviceInfo)}
              </Day>
            );
          })}
          {isEditingRole && (
            <EditRole isOpen={true} members={this.props.members} />
          )}
          <BackTopLink onClick={this.handleBackTopClick}>Top</BackTopLink>
          <BottomDateBarSpace />
        </Grid>
      );
    }
  }
);

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
  flex-wrap: nowrap;
  font-weight: bold;
  justify-content: space-between;
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
  ${Name}, ${ExcludeReason} {
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
  flex: 0;
  font-size: 15px;
  line-height: 1.2;
  padding: 10px 5px 10px 10px;
  text-align: left;
`;
const SettingLink = styled.span`
  color: #333;
  cursor: pointer;
  font-size: 13px;
  line-height: 0;
  padding: 10px 5px 10px 0;
  flex: 0;
`;
const Footnote = styled.span`
  cursor: pointer;
  flex: 2;
  font-size: 11px;
  margin-left: 5px;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  vertical-align: baseline;
`;
const Action = styled.span`
  flex: 0;
  margin-left: auto;
  margin-right: 5px;
`;
const BottomDateBarSpace = styled.div`
  position: absolute;
  height: 50px;
  width: 100%;
`;
const BackTopLink = styled.a.attrs({ href: '#top' })`
  border-radius: 50%;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  bottom: 50px;
  right: 10px;
  background: #4285f4;
  &:link,
  &:visited {
    color: #fff;
  }
  width: 48px;
  height: 48px;
`;
