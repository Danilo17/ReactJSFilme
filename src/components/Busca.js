import React from 'react';

function Busca(props) {
  return (
    <div className="searchbox-wrap">
      <input ref={props.inputref} type="search" 
      placeholder="Busque por um filme..." 
      className="searchbox" 
      onChange={props.handleInput}
      onKeyPress={props.handleKeyPress}
      />
    </div>
    
  );

}

export default Busca;