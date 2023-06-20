import { CardActions, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useCommentLikes} from '../services/api.likes';
import timeSincePost from '../services/timeUtils';

function CommentInteractions({ commentId, commentCreated }) {
    const { likes, liked, handleLike } = useCommentLikes(commentId);
    var aDay = 24*60*60*1000;
    const timeSince = timeSincePost(new Date(Date.now()-aDay));

 

    return (
        <CardActions>
            {liked ? (
                <FavoriteIcon onClick={handleLike} style={{ color: 'red' }} />
            ) : (
                <FavoriteBorderIcon onClick={handleLike} />
            )}
            {likes > 0 && (
                <span>{likes} likes</span>
            )}
            <Typography variant="body2" color="primary" style={{ cursor: 'pointer', marginLeft: '16px' }}>
                {timeSince}
            </Typography>
            <Typography variant="body2" color="primary" style={{ cursor: 'pointer', marginLeft: '16px' }}>
                Reply
            </Typography>
        </CardActions>
    );
}

export default CommentInteractions;
