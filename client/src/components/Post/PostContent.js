import React, { useState } from "react";
import "./PostContent.css";

function PostContent({ content,author }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxContentLength = 50;

  const toggleIsExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const contentPreview = content.length > maxContentLength && !isExpanded
    ? content.slice(0, maxContentLength) + '...'
    : content;

  return (
<div className="post-content">
  <strong>{author.userName}</strong>
  <span className="content-preview">{contentPreview}</span>
  {content.length > maxContentLength && (
    <span className={isExpanded ? "less-link" : "more-link"} onClick={toggleIsExpanded}>
      {isExpanded ? ' see less' : ' see more'}
    </span>
  )}
</div>
  );
}

export default PostContent;
