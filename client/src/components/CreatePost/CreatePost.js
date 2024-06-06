import { styled } from "@mui/system";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useState, useEffect, useContext } from "react";
import { createPostApi } from "../../api/postsApi";
import { PostContext } from "../Post/PostContext";

const DialogStyled = styled(Dialog)({
  "& .MuiDialog-paper": {
    width: "80%",
    maxWidth: "600px",
  },
});

const InputHidden = styled("input")({
  display: "none",
});

const ImagePreview = styled("img")({
  width: "100%",
  height: "auto",
  objectFit: "cover",
  borderRadius: "4px",
  marginBottom: "1rem",
});

function CreatePost({ open, handleClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const { newPost, setNewPost } = useContext(PostContext);
  const [postCreated, setPostCreated] = useState(false);

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
    formData.append("media", selectedFile);
    formData.append("caption", caption);
    try {
      await createPostApi(formData);
      setNewPost(true);
      setPostCreated(true);
    } catch (error) {
      setNewPost(false); // Remove the optimistically added post
      console.error("Failed to create a post", error);
      alert("Failed to create a post. Please try again."); // Inform the user
    }
  };

  useEffect(() => {
    if (postCreated) {
      handleClose();
      setPostCreated(false); // reset postCreated for the next time the dialog is opened
    }
  }, [postCreated, handleClose]);

  useEffect(() => {}, [newPost]);

  return (
    <DialogStyled open={open} onClose={handleClose}>
      <DialogTitle>Create a New Post</DialogTitle>
      <form onSubmit={handleSumbit}>
        <DialogContent>
          <DialogContentText>
            Share photos and videos that you want to show on your profile.
          </DialogContentText>
          <Box>
            <InputHidden
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleFileChange}
            />
            {preview ? (
              <ImagePreview src={preview} alt="Image preview" />
            ) : (
              <ImagePreview
                src="https://via.placeholder.com/500x300?text=Upload+Image"
                alt="Placeholder"
              />
            )}
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="primary" component="span">
                Upload Image
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
          <Button onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Post
          </Button>
        </DialogActions>
      </form>
    </DialogStyled>
  );
}

export default CreatePost;
