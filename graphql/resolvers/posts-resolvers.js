import { AuthenticationError, UserInputError } from 'apollo-server';

import Post from '../../models/post-model.js';
import checkAuth from '../../utils/auth.js';

// each query, mutation, or subscription has its corresponding resolver
// which process some sort of logic and return what the query returns
const postsResolvers = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);

        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    // inside context we have the request body, so
    // we can access the headers and determine if the user is authenticated
    createPost: async (_, { body }, context) => {
      // Authentication Middleware
      // the way protected resolver is gonna work
      // user would login and get an auth token and then put it in an authorization header
      // then send that header with the request and then get that token and decode it
      // and get info from it and make sure that user is authenticated and then create a post
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Post must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      // Publishing a subscription
      context.pubsub.publish('NEW_POST', {
        newPost: post,
      });

      return post;
    },
    deletePost: async (_, { postId }, context) => {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    likePost: async (_, { postId }, context) => {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (post) {
          if (post.likes.find((like) => like.username === user.username)) {
            // Post already likes, unlike it
            post.likes = post.likes.filter(
              (like) => like.username !== user.username
            );
          } else {
            // Not liked, like post
            post.likes.push({
              username: user.username,
              createdAt: new Date().toISOString(),
            });
          }

          await post.save();
          return post;
        } else throw new UserInputError('Post not found');
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  // creates a subscription
  // it uses websockets in the background to actively listen to NEW_POST event
  // everytime it publishes a new post, we can listen on the client
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
    },
  },
};

export default postsResolvers;
