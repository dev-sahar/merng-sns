import { ApolloServer, PubSub } from 'apollo-server';
import * as dotenv from 'dotenv';

import connectDB from './config/db.js';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers/resolvers.js';

// dotenv config
process.env.NODE_ENV !== 'production' && dotenv.config();

// (PubSub) Publish a subscription
// Instantiate an instance of PubSub
// then pass it to context to be used in resolvers
const pubsub = new PubSub();

// set up apollo server
// uses express server behind the scenes
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context gets anything thats passed from before ApolloServer
  // takes a callback
  // we get the request and response (in an object) from express server
  // here it takes the req body and forward it to the context
  // so we can access it from the context (ex: createPost mutation)
  context: ({ req }) => ({ req, pubsub }),
});

// connect to mongoose
connectDB();

// start the server
const PORT = process.env.PORT || 5000;

server.listen({ port: PORT }).then((res) => {
  console.log(`server running at ${res.url}`);
});
