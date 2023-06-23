import React from 'react';
import Resultado from './Resultado'

function Resultados(props) {
  return (
    <section ref={props.sectionref} className="results">
      {props.results.map((result, index) => (
        <Resultado key={index} result={result} openPopup={props.openPopup}/>
      ))}
    </section>
    
  );
}

export default Resultados;