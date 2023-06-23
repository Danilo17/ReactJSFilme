import React from 'react';
import imgposter from '../images/poster.png'

function Resultado(props) {
  
  const link = "https://image.tmdb.org/t/p/original"
  var pathposter = link + props.result.poster_path

  if (pathposter==="https://image.tmdb.org/t/p/originalnull"){
    pathposter=imgposter
  }
  return (
    <div className="result" onClick={() => props.openPopup(props.result.id)}>
      <img src={pathposter} alt=""/>
      <h3> {props.result.title}</h3>
    </div>
    
  );
}

export default Resultado;