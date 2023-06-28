import { Grid, ListItem, ListItemAvatar, Avatar, Typography, Box  } from "@mui/material";
import CommentInteractions from "./CommentInteractions";
import { fetchComments } from '../../services/api.comments';

function Comment({ comment }) {
    const { content } = comment;
    console.log(comment)
    const { userName, profileImage } = comment.author;
    
    
    return (
      <ListItem alignItems="flex-start">
        <Grid container>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <ListItemAvatar>
                <Avatar alt={userName} src={profileImage} sx={{ width: 32, height: 32 }} />
              </ListItemAvatar>
              <Box ml={0}>
                <Typography component="span" variant="body1" color="textPrimary">
                  <strong>{userName}</strong>
                </Typography>
                <Typography component="span" variant="body2" color="textSecondary" ml={1}>
                  {content}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <CommentInteractions commentId={comment._id} fetchComments={fetchComments}/> 
          </Grid>
        </Grid>
      </ListItem>
    );
}

export default Comment;
