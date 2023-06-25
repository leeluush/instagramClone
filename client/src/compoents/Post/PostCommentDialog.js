import React, { useState, useEffect, useContext } from 'react';
import { 
    Dialog, 
    DialogContent,  
    TextField, 
    Button, 
    Box, 
    Grid, 
    Typography, 
    Avatar 
} from '@mui/material';

import PostCardMedia from './PostCardMedia';
import Comment from '../Comment/Comment';
import { usePostLikes } from '../../services/api.likes';
import { postComment, fetchComments } from '../../services/api.comments';
import { AuthContext } from '../Auth/AuthContext';
import timeSincePost from '../../services/timeUtils';
import PostInteractions from './PostInteractions';

const PostCommentDialog = ({ open, handleClose, post }) => {
    const { thumbnail, _id, content, comments  } = post;
    const { user } = useContext(AuthContext);
    const [comment, setComment] = useState('');
    const [postComments, setPostComments] = useState(comments);
    const { userName, profileImage } = post.author;
    const { likes } = usePostLikes(_id);

    var aDay = 24*60*60*1000;
    const timeSince = timeSincePost(new Date(Date.now()-aDay));

    useEffect(() => {
        setPostComments(comments);
    }, [comments]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!post || !user) {
            return;
        }

        try {
            await postComment(_id, comment, user._id)
            setComment('');
            const updatedComments = await fetchComments(_id);
            setPostComments(updatedComments);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll="paper"
            maxWidth="md"
            fullWidth
        >
            <DialogContent>
                <Grid container>
                    <Grid item xs={6}>
                        <PostCardMedia media={thumbnail} />
                    </Grid>
                    <Grid item xs={6} style={{ paddingLeft: '16px' }}>
                        <Box display="flex" alignItems="flex-start" mb={2}>
                            <Avatar alt={userName} src={profileImage} sx={{ width: 32, height: 32, marginRight: 1 }} />
                            <Typography variant="body1">
                                <strong>{userName}</strong> {content}
                            </Typography>
                        </Box>
                        <Typography variant="body2" style={{paddingLeft:'40px'}}>{timeSince}</Typography>
                        <Box 
                            sx={{ 
                                overflowY: 'scroll', 
                                maxHeight: '200px',
                                marginBottom: '10px'
                            }}
                        >
                            {postComments.map((comment) => (
                                <Comment key={comment._id} comment={comment} />
                            ))}
                        </Box>
                        <Box>
                            <PostInteractions postId={_id} likes={likes} />
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    placeholder="Add a comment"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                />
                                <Button type="submit" variant="contained" color="primary">
                                    Post Comment
                                </Button>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default PostCommentDialog;
