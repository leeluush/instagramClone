import ListItem from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';





function Comment({ comment }) {
    const { content } = comment
    const { userName, profileImage } = comment.author;
    const date = new Date(comment.created);
    const createdTime = date.toDateString();


    return (

        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt={userName} src={profileImage}
                    sx={{ width: 46, height: 46 }} />
            </ListItemAvatar>
            <ListItemText
            
            primary={
                <>
                <Typography component="span" variant="subtitle1" color="textPrimary">
                  {userName}
                </Typography>
                <Typography component="span" variant="caption" color="textSecondary">
                  {' • '}
                  {createdTime}
                </Typography>
              </>
            }
            secondary={content}
          />
          
         
        </ListItem>
    )


}

export default Comment;