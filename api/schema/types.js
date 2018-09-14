const {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean
} = require('graphql');

exports.changelogType = new GraphQLObjectType({
  name: 'ChangeLog',
  description: 'A log involving data updates',
  fields: {
    id: { type: GraphQLInt },
    resourceType: { type: GraphQLString },
    actionType: { type: GraphQLString },
    reqData: { type: GraphQLString },
    saveData: { type: GraphQLString },
    createdAt: { type: GraphQLString }
  }
});

exports.eventType = new GraphQLObjectType({
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
      type: new GraphQLList(exports.memberType)
    },
    serviceInfo: {
      type: exports.serviceInfoType
    }
  })
});

exports.memberType = new GraphQLObjectType({
  name: 'Member',
  description: 'A member who serves for a specific role',
  fields: {
    name: { type: GraphQLString },
    role: { type: GraphQLString }
  }
});

exports.serviceInfoType = new GraphQLObjectType({
  name: 'ServiceInfo',
  description: ' meta data for specific a day',
  fields: {
    id: { type: GraphQLInt },
    footnote: { type: GraphQLString },
    skipService: { type: GraphQLBoolean },
    skipReason: { type: GraphQLString },
    date: { type: GraphQLString },
    category: { type: GraphQLString }
  }
});
