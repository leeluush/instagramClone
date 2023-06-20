import React, { useState, useEffect, useContext } from 'react';
import { Dialog, DialogContent, DialogActions, TextField, Button, Box, Grid, Typography, Avatar } from '@mui/material';
import PostCardMedia from './PostCardMedia';
import Comment from './Comment';
import { usePostLikes } from '../services/api.likes';
import { postComment, fetchComments } from '../services/api.comments';
import { AuthContext } from './AuthContext';

const PostCommentDialog = ({ open, handleClose, post }) => {
    const { thumbnail, _id, content, comments, author } = post;
    const { user } = useContext(AuthContext);
    const [comment, setComment] = useState('');
    const [postComments, setPostComments] = useState(comments);
    const { userName, profileImage } = post.author;
    const { likes, liked, handleLike } = usePostLikes(_id);

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

                        {postComments.map((comment) => (
                            <Comment key={comment._id} comment={comment} />
                        ))}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
            </DialogActions>
        </Dialog>
    );
};

export default PostCommentDialog;
