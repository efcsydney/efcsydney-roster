// in src/base.js
const Base = `
type Query {
    dummy: Boolean
}

type Mutation {
    dummy: Boolean
}

type Meta {
    count: Int
}
`;

module.exports = () => [Base];
