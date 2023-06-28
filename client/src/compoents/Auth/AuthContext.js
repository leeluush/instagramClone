import { createContext, useEffect, useState } from 'react';
import { fetchUserInfo } from '../../services/api.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await fetchUserInfo()
        setUser(userInfo)
        
      } catch (error) {
        if (error.message === '401') {
          // If the user is not authorized, remove the user from localStorage
          localStorage.removeItem('user');
        }
      } finally {
        setLoading(false); // set loading to false after fetching user data
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const value = { user, setUser };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
