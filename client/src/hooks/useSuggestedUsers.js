import { useState, useEffect } from "react";
import { getSuggestedUsers } from "../api/userApi";


const useSuggestedUsers = (user) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const response = await getSuggestedUsers();
        setSuggestedUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchSuggestedUsers();
  }, [user]);
return {suggestedUsers,isLoading}


}

export default useSuggestedUsers