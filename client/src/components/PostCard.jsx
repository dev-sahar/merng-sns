import React from 'react';
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import CustomPopup from '../utils/CustomPopup';

import useStateValue from '../context/AuthConsumer';

const PostCard = ({
  post: { id, body, username, createdAt, likeCount, commentCount, likes },
}) => {
  const { user } = useStateValue();

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        {/* Like Button */}
        <LikeButton user={user} post={{ id, likes, likeCount }} />

        {/* Comment Button */}
        <CustomPopup content='Comment on post'>
          <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
            <Button color='blue' basic>
              <Icon name='comments' />
            </Button>
            <Label basic color='blue' pointing='left'>
              {commentCount}
            </Label>
          </Button>
        </CustomPopup>

        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
