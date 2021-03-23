import { AuthenticationError, UserInputError } from 'apollo-server';

import Post from '../../models/post-model.js';
import checkAuth from '../../utils/auth.js';

// each query, mutation, or subscription has its corresponding resolver
// which process some sort of logic and return what the query returns
const commentsResolvers = {
  Mutation: {
    // inside context we have the request body, so
    // we can access the headers and determine if the user is authenticated
    createComment: async (_, { postId, body }, context) => {
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment must not be empty',
          },
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (post) {
          const commentIndex = post.comments.findIndex(
            (c) => c.id === commentId
          );

          if (post.comments[commentIndex].username === user.username) {
            post.comments.splice(commentIndex, 1);
            await post.save();
            return post;
          } else {
            throw new AuthenticationError('Action not allowed');
          }
        } else {
          throw new UserInputError('Post not found');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

export default commentsResolvers;
