import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const localData = localStorage.getItem('user');
        if (localData) {
          const userInfo = JSON.parse(localData);
          setUser(userInfo);
        }
      } catch (error) {
        if (error.message === '401') {
          throw Error;
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