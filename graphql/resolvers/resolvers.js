import postsResolvers from './posts-resolvers.js';
import usersResolvers from './users-resolvers.js';
import commentsResolvers from './comments-resolvers.js';

const resolvers = {
  // if we have a name of a type (i.e Post), and
  // we do anything to change any of the fields
  // each time any query, mutation, or a subscription that returns a post
  // will go through this modifier and apply these modifications
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
};

export default resolvers;
