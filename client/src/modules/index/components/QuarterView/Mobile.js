import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AddToCalendar from 'react-add-to-calendar';
import './icalstyle.css';
import moment from 'moment';
import { getCalData } from 'utils';
import IconEdit from 'react-icons/lib/fa/pencil';
import i18n from 'i18n';
import EditRole from '../EditRole';
import { isHighlighted } from './utils';

const mapStateToProps = state => {
  const { meta: { isEditingRole } } = state.index;
  const services = _.get(state.core, 'data.services', []);
  const selectedServiceName = _.get(state.core, 'meta.category', 'english');

  return {
    events: _.get(state.index, 'data', []),
    isEditingRole,
    selectedData: _.get(state.index, 'meta.selectedData', null),
    selectedService: _.find(services, { name: selectedServiceName })
  };
};
export default connect(mapStateToProps)(
  class Mobile extends Component {
    displayName = 'Mobile';
    static propTypes = {
      events: PropTypes.array,
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
      const { onDayClick, onRoleClick } = this.props;
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
      const {
        events,
        selectedService: { frequency },
        isEditingRole,
        onDayClick
      } = this.props;
      const sortedEvents = _.sortBy(events, 'date');

      return (
        <Grid>
          {sortedEvents.map(({ date, members, serviceInfo }) => {
            const roles = members.map(member => member.role);
            const icalEvent = getCalData(date, roles, members);
            const formattedDate = date;
            const highlighted = isHighlighted(date, frequency);

            return (
              <Day
                key={date}
                highlighted={highlighted}
                id={highlighted ? 'highlighted' : undefined}>
                <Header>
                  <Label
                    onClick={() => {
                      onDayClick(formattedDate, serviceInfo);
                    }}>
                    {moment(date).format(this.getTrans('dateFormat'))}
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
                    <AddToCalendar
                      event={icalEvent}
                      listItems={icalitems}
                      buttonTemplate={icalicon}
                      buttonLabel={this.getTrans('addCalLabel')}
                    />
                  </Action>
                </Header>
                {this.renderRolesList(date, roles, members, serviceInfo)}
              </Day>
            );
          })}
          {isEditingRole && (
            <EditRole isOpen={true} members={this.props.members} />
          )}
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
