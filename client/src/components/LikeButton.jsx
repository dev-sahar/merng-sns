import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { Button, Icon, Label } from 'semantic-ui-react';

import CustomPopup from '../utils/CustomPopup';

const LikeButton = ({ user, post: { id, likes, likeCount } }) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const likeButton = user ? (
    isLiked ? (
      <Button color='teal' onClick={likePost}>
        <Icon name='heart' />
      </Button>
    ) : (
      <Button color='teal' basic onClick={likePost}>
        <Icon name='heart' />
      </Button>
    )
  ) : (
    <Button as={Link} to='/login' color='teal' basic>
      <Icon name='heart' />
    </Button>
  );

  return (
    <Button as='div' labelPosition='right'>
      <CustomPopup content={isLiked ? 'Unlike' : 'Like'}>
        {likeButton}
      </CustomPopup>
      <Label basic color='teal' pointing='left'>
        {likeCount}
      </Label>
    </Button>
  );
};

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
