import { createContext, useEffect, useState } from 'react';
import { fetchUserInfo } from '../services/api.service'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const localData = localStorage.getItem('user');
    return localData ? JSON.parse(localData) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user'); // If user logs out or user data is null
    }
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      // Only fetch the user info if a user is stored in local storage
      if (localStorage.getItem('user')) {
        try {
          const userInfo = await fetchUserInfo();
          setUser(userInfo)
        } catch (error) {
          console.log(error)
        }
      }
    };
    fetchUsers();
  },[]);

  const value = { user, setUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
