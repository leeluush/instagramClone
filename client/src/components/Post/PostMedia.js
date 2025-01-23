import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const PostMedia = ({ media, sx = {} }) => {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = (e) => {
    console.error("Error loading image:", e);
    setLoading(false);
  };

  return (
    <div className="post-media-wrapper">
      <div className="post-media-container">
        {loading && (
          <div className="media-loading">
            <CircularProgress size={30} />
          </div>
        )}
        <img
          src={media}
          alt="Post content"
          className="post-media"
          onLoad={handleLoad}
          onError={handleError}
          style={{ ...sx }}
        />
      </div>
    </div>
  );
};

export default PostMedia;
