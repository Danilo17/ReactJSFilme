import React from 'react'
import imgposter from '../images/poster.png'
import {useRef} from 'react'

function Popup(props) {

	const link = "https://image.tmdb.org/t/p/original"

	var pathposter = link + props.selected.poster_path
	var backdroppath = link + props.selected.backdrop_path

	if (pathposter==="https://image.tmdb.org/t/p/originalnull"){
	    pathposter=imgposter
	}

    const backpop = useRef()
 	if (backpop.current) {
	  backpop.current.style.backgroundImage = "url(" + backdroppath + ")"
	  if (backdroppath==="https://image.tmdb.org/t/p/originalnull"){
		  backpop.current.style.backgroundImage = "url()"
	  }
	}

	return (
		<section ref={backpop} className="popup">
			<div className="content">
				<h2>{ props.selected.title } <span>({ props.selected.release_date })</span></h2>
				<p className="rating"><br></br><b>Avaliação:</b> {props.selected.vote_average}</p>
				<div className="plot">
					<img src={pathposter} alt="" />
					<p>
            <b>Duração:</b><br></br><br></br> 
            {props.selected.runtime} 
					  <br></br><br></br> 
					  <span id='diretor'>
              <b>Direção: </b>
              <br></br><br></br>
              {props.directors.length > 0 ? props.directors.join(', ') : "-"}
            </span> 
            <br></br> <br></br> 
            <b>Sinopse:</b> 
            <br></br> <br></br> 
            {props.selected.overview}  
          </p>
				</div>
				<button className="close" onClick={props.closePopup}>Fechar</button>

			</div>
		</section>
	)

}

export default Popup