import React from "react";
import Card from '@mui/material/Card';



function CardList({ children }) {
    return (
  
      <div className="card">
        <p>{children}</p>
      </div>
    )
  }

  export default Card;