import { styled } from '@mui/system';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useState, useContext, useEffect } from 'react';
import { editPostApi } from '../../api/postsApi';
import { AuthContext } from '../Auth/AuthContext'

const DialogStyled = styled(Dialog)({
  '& .MuiDialog-paper': {
    width: '80%',
    maxWidth: '600px',
  },
});

const InputHidden = styled('input')({
  display: 'none',
});

const ImagePreview = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
  borderRadius: '4px',
  marginBottom: '1rem',
});

function EditPost({ open, handleClose, post, fetchPosts }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(post.image);
  const [caption, setCaption] = useState(post.content);
  const [postUpdated, setPostUpdated] = useState(false);
  const postId = post._id
  const { user } = useContext(AuthContext);


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPreview(URL.createObjectURL(event.target.files[0]));
  };

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleSumbit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (selectedFile) formData.append('media', selectedFile);
    formData.append('content', caption);
    try {
      await editPostApi(formData, postId, user);
      setPostUpdated(true);
      fetchPosts()
    } catch (error) {
      console.error('failed to update the post', error);
    }
  };

  useEffect(() => {
    if (postUpdated) {
      handleClose();
      setPostUpdated(false); // reset postUpdated for the next time the dialog is opened
    }
  }, [postUpdated, handleClose]);


  return (
    <DialogStyled open={open} onClose={handleClose}>
      <DialogTitle>Edit Your Post</DialogTitle>
      <form onSubmit={handleSumbit}>
        <DialogContent>
          <DialogContentText>
            Edit the photo and caption for your post.
          </DialogContentText>
          <Box>
            <InputHidden
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleFileChange}
            />
            {preview ? <ImagePreview src={preview} alt="Image preview" /> : <ImagePreview src={post.media} />}
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="primary" component="span">
                Edit Image
              </Button>
            </label>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            id="caption"
            label="Write a caption..."
            type="text"
            fullWidth
            value={caption}
            onChange={handleCaptionChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} type="button">Cancel</Button>
          <Button variant="contained" color="primary" type="submit">
            Update
          </Button>
        </DialogActions>
      </form>
    </DialogStyled>
  );
}

export default EditPost;
