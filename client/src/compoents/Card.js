import React from "react";


function Card({ children }) {
    return (
  
      <div className="card">
        <p>{children}</p>
      </div>
    )
  }

  export default Card;