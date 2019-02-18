var express = require('express');
var bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');
var { makeExecutableSchema } = require('graphql-tools');

const app = express();

const schema = gql`
  type Query {
    me: User,
    user(id: ID!):  User,
    users: [User!],
    messages: [Message!]!
    message(id: ID!): Message!
  }

  type User {
    username: String!,
    id: ID!
  }
  
  type Message {
    id: ID!,
    text: String!,
    user: User!
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

let messages = [
  {
    id: 1,
    text: "Hello World message",
    userId: 2
  },
  {
    id: 2,
    text: "Second message in the system",
    userId: 1
  }

]

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
    },
    message: (parent, args) => {
      return messages.find(message => {
        return message.id == args.id
      })
    },
    messages: () => {
      return messages;
    }
  },
  // Field resolver for the User type
  User: {
    // All username fields in the User type are handled with this resolver
    username: (parent) => {
      return parent.username + ", X"
    }
  },
  Message: {
    user: (parent, args, context, info) => {
      // return the actual User object based on the parent.userId value
      return users[parent.userId]
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});