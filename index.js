var express = require('express');
var bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');
var { makeExecutableSchema } = require('graphql-tools');




const app = express();

const schema = gql`
  type Query {
    me: User
  }

  type User {
    username: String!,
    id: Int
  }
`;

const resolvers = {
  Query: {
    me: () => {
      return {
        username: 'Test Emil',
        id: 32
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});