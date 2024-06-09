import React, { useState } from 'react';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const CommentInput = ({ onCommentSubmit }) => {
  const [comment, setComment] = useState("");
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleEmojiSelect = emoji => {
    setComment(prevComment => prevComment + emoji.native);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (comment.trim()) {
      onCommentSubmit(comment);
      setComment('');
      setIsPickerVisible(false); 
    }
  };

  const handleChange = event => {
    setComment(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className='commentForm'>
      <TextField
        variant="standard"
        value={comment}
        onChange={handleChange}
        placeholder="Add a comment..."
        fullWidth
        margin="dense"
        sx={{ border: 'none' }}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setIsPickerVisible(!isPickerVisible)}>
                <EmojiEmotionsOutlinedIcon />
              </IconButton>
              <Button type="submit" color="primary">Post</Button>
            </InputAdornment>
          ),
        }}
      />
      {isPickerVisible && (
        <div className='emojiPickerContainer'>
          <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </form>
  );
};

export default CommentInput;
