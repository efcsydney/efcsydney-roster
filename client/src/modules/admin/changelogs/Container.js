import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, LoadingIndicator, HeaderCell, Row, Cell } from 'components';
import Title from '../Title';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import useragent from 'useragent';
import ReactJson from 'react-json-view';

const DATE_FORMAT = 'D MMM, h:mma';

function rephraseHttpMethod(method) {
  if (method === 'GET') {
    return 'Read';
  } else if (method === 'POST') {
    return 'Create';
  } else if (method === 'PUT') {
    return 'Update';
  } else if (method === 'DELETE') {
    return 'Remove';
  } else if (method === 'OPTION') {
    return 'Connect';
  }
}

class AdminChangelogs extends Component {
  static propTypes = {
    data: PropTypes.object,
    isLoading: PropTypes.bool,
    error: PropTypes.object
  };
  static defaultProps = {
    data: {},
    isLoading: true,
    error: {}
  };
  constructor(props) {
    super(props);

    this.rootPath = '/admin/services';
  }
  render() {
    const { data, isLoading } = this.props;

    if (isLoading) {
      return <LoadingIndicator active={true} height="300px" />;
    }

    return (
      <Wrapper>
        <HeadRow>
          <Title>Change Logs</Title>
          <p>Showing the latest 100 records</p>
        </HeadRow>
        <Grid>
          <thead>
            <Row>
              <HeaderCell>Time</HeaderCell>
              <HeaderCell>Resource</HeaderCell>
              <HeaderCell>Action</HeaderCell>
              <HeaderCell>Saved Data</HeaderCell>
              <HeaderCell>Request Info</HeaderCell>
            </Row>
          </thead>
          <tbody>
            {data.changelogs.map(
              ({
                id,
                createdAt,
                resourceType,
                actionType,
                reqData,
                saveData
              }) => {
                createdAt = new Date(parseInt(createdAt, 10));
                try {
                  saveData = JSON.parse(saveData);
                  reqData = JSON.parse(reqData);
                } catch (e) {
                  throw new Error(e);
                }
                const formattedDate = moment(createdAt).format(DATE_FORMAT);
                const agentName = useragent.parse(reqData.userAgent).toAgent();

                return (
                  <Row key={id}>
                    <Cell>{formattedDate}</Cell>
                    <Cell>{_.capitalize(resourceType)}</Cell>
                    <Cell>{rephraseHttpMethod(actionType)}</Cell>
                    <DataCell align="left">
                      <ReactJson
                        name={null}
                        indentWidth={2}
                        src={saveData}
                        enableClipboard={false}
                        displayObjectSize={false}
                        displayDataTypes={false}
                        collapsed={1}
                        sortKeys={true}
                      />
                    </DataCell>
                    <Cell align="left">
                      <ul>
                        <li>Browser: {agentName}</li>
                        <li>IP Address: {reqData.ip}</li>
                      </ul>
                    </Cell>
                  </Row>
                );
              }
            )}
          </tbody>
        </Grid>
      </Wrapper>
    );
  }
}

export default () => (
  <Query
    query={gql`
      {
        changelogs {
          id
          createdAt
          resourceType
          actionType
          reqData
          saveData
        }
      }
    `}>
    {({ loading, error, data }) => (
      <AdminChangelogs isLoading={loading} error={error} data={data} />
    )}
  </Query>
);
const Wrapper = styled.div``;
const HeadRow = styled.div`
  display: flex;
  margin: 10px 0;
  align-items: center;
  justify-content: space-between;
`;
const DataCell = Cell.extend`
  font-size: 11px;
  line-height: 1;
`;
