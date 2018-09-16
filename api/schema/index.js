const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString
} = require('graphql');
const { changelogType, eventType } = require('./types');
const { resolveChangelogs, resolveEvents } = require('./resolvers');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'The root query type',
    fields: () => ({
      changelogs: {
        type: new GraphQLList(changelogType),
        args: {
          resourseType: { type: GraphQLString },
          from: { type: GraphQLString },
          to: { type: GraphQLString }
        },
        resolve: resolveChangelogs
      },
      events: {
        type: new GraphQLList(eventType),
        args: {
          category: { type: GraphQLString },
          from: { type: GraphQLString },
          to: { type: GraphQLString }
        },
        resolve: resolveEvents
      }
    })
  })
});
