import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../compoents/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_SERVER_URL = 'http://localhost:4000';

 export function usePostLikes(postId) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [likes, setLikes] = useState(null);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (!user)
            return;

        fetch(`${API_SERVER_URL}/api/likes/likescount/${postId}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    setLikes(data.likesCount);
                }
            })
            .catch(err => console.error(err));

        if (user) {

            fetch(`${API_SERVER_URL}/api/likes/like/${postId}/${user._id}`)
                .then(res => res.json())
                .then(data => {
                    setLiked(data.liked);
                })
                .catch(err => console.error(err));
        }
    }, [postId, user]);

    const handleLike = () => {
        if (!user) {
            navigate('./login');
            return;
        }

        // Determine the request method based on whether the user has liked the post
        const method = liked ? 'DELETE' : 'POST';
        const url = `${API_SERVER_URL}/api/likes/${postId}`; // Endpoint to create/delete a like

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then(data => {
                setLiked(!liked);
                setLikes((likes === null ? 0 : likes) + (liked ? -1 : 1));
            })
            .catch(err => console.error(err));
    };

    return { likes, liked, handleLike };
}


export function useCommentLikes(commentId) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLike = async () => {
    if (!user) {
      navigate('./login');
      return;
    }

    const method = liked ? 'DELETE' : 'POST';

    try {
      const response = await fetch(`${API_SERVER_URL}/api/likes/${commentId}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: user._id })
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      setLiked(!liked);
      setLiked(data.liked)
      setLikes(likes + (liked ? -1 : 1));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user || !commentId) return;

    fetch(`${API_SERVER_URL}/api/likes/${commentId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setLikes(data.likes);
        setLiked(data.liked);
      })
      .catch(err => console.error(err));
  }, [commentId, user]);

  return { likes, liked, handleLike };
}
