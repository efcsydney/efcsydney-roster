const EventService = require('../service/events-service').EventService;
const { getChangelogs } = require('../service/changelogs-service');
const DtoMapper = require('../mapper/dto-mapper');
const queryString = require('query-string');
const {
  GraphQLSchema,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean
} = require('graphql');

const EventType = new GraphQLObjectType({
  name: 'Event',
  description: 'A day in a service',
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    date: {
      type: GraphQLString
    },
    members: {
      type: new GraphQLList(MemberType)
    },
    serviceInfo: {
      type: ServiceInfoType
    }
  })
});

const ServiceInfoType = new GraphQLObjectType({
  name: 'ServiceInfo',
  description: 'The meta data for a day',
  fields: {
    id: { type: GraphQLInt },
    footnote: { type: GraphQLString },
    skipService: { type: GraphQLBoolean },
    skipReason: { type: GraphQLString },
    date: { type: GraphQLString },
    category: { type: GraphQLString }
  }
});

const MemberType = new GraphQLObjectType({
  name: 'Member',
  description: 'The member who serves',
  fields: {
    name: { type: GraphQLString },
    role: { type: GraphQLString }
  }
});

const ChangelogType = new GraphQLObjectType({
  name: 'ChangeLog',
  fields: {
    id: { type: GraphQLInt },
    resourceType: { type: GraphQLString },
    actionType: { type: GraphQLString },
    reqData: { type: GraphQLString },
    saveData: { type: GraphQLString },
    createdAt: { type: GraphQLString }
  }
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'The root query type',
    fields: () => ({
      changelogs: {
        type: new GraphQLList(ChangelogType),
        args: {
          resourseType: { type: GraphQLString },
          from: { type: GraphQLString },
          to: { type: GraphQLString }
        },
        resolve: async (root, args) => {
          try {
            return await getChangelogs({ ...args });
          } catch (err) {
            throw new Error(err);
          }
        }
      },
      events: {
        type: new GraphQLList(EventType),
        args: {
          category: { type: GraphQLString },
          from: { type: GraphQLString },
          to: { type: GraphQLString }
        },
        resolve: async (root, args) => {
          try {
            const query = queryString.stringify({
              ...args
            });
            const { category: service } = query;
            const dateRange = EventService.computeDateRange(query);
            const eventsByDateRange = await EventService.getEventsByDateRange(
              dateRange,
              service
            );
            const data = DtoMapper.mapGroupEventsToDto(eventsByDateRange);
            return data;
          } catch (err) {
            throw new Error(err);
          }
        }
      }
    })
  })
});
