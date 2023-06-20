import React from "react";
import { Avatar, Typography, Box } from "@mui/material";
import timeSincePost from '../services/timeUtils'

function PostCardHeader({post}) {
    if (!post || !post.author) return null;
    const { userName, profileImage } = post.author;
    var aDay = 24*60*60*1000;

    const timeSince = timeSincePost(new Date(Date.now()-aDay));

  
    return (
      <Box display="flex" alignItems="center" mb={2}>
          <Avatar alt={userName} src={profileImage} sx={{ width: 32, height: 32 }} /> {/* smaller Avatar */}
          <Box mx={1}> 
              <Typography variant="body1" component="span" fontWeight="bold">
                  {userName}
              </Typography>
              <Typography variant="body2" component="span" color="textSecondary">
                  {" • "}
              </Typography>
              <Typography variant="body2" component="span" color="textSecondary">
                  {timeSince}
              </Typography>
          </Box>
      </Box>
  );
}
  
  export default PostCardHeader;