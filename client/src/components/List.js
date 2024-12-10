import React from "react";
import  Card  from './Card';

function List({ cards }) {
    return (
  
      <ul className="List">
        {cards.map((cardContent,index) => {
          return (
            <li key={index} className="List-item" ><Card>{cardContent}</Card></li>
          )
        })}
      </ul>
  
    )
  }

  export default List;