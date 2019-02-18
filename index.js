var express = require('express');
var bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');
var { makeExecutableSchema } = require('graphql-tools');

const app = express();

const schema = gql`
  type Query {
    me: User,
    user(id: ID!):  User,
    users: [User!]
  }

  type User {
    username: String!,
    id: ID!
  }
`;

let users = {
  1: {
    id: '1',
    username: 'Neil Armstrong',
  },
  2: {
    id: '2',
    username: 'Test Emil',
  },
};

const resolvers = {
  Query: {
    me: () => {
      return users[1]
    },
    user: (parent, args) => {
      return users[args.id];
    },
    users: () => {
      return Object.values(users);
    }
  },
  User: {
    username: (parent) => {
      return parent.username + ", X"
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});