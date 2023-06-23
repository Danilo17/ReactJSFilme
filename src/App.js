import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'

/*React Filmes
*Autor: Danilo Correia Viana
*Descrição: Aplicação Web com React JS que faz requisições de filmes em uma API externa (Responsiva)
*A pesquisa de filmes é dinâmica, ou seja, enquanto digita os filmes são buscados
*/

import Busca from './components/Busca'
import Resultados from './components/Resultados'
import Popup from './components/Popup'
import notsearch from './images/notsearch.png'

//Variáreis constantes para acessar a API
const configs = {
    apiurl: 'https://api.themoviedb.org/3',
    apikey: 'b28d98f1bc60c7578a565e28c73e17ee'
};

const { apiurl, apikey } = configs;

function App() {
  const [state, setState] = useState({
    s: "",
    results: [],
    selected: {},
    directors: []
  });

  const inputref = useRef()
  const sectionref = useRef()
  const divref = useRef()
  const imgref = useRef()
  const popref = useRef()
  const notfref = useRef()


  function OverflowOff(){
    document.body.style.overflow = "hidden"
  }

  function OverflowOn(){
    document.body.style.overflow = "visible"
  }
 
  //Verifica se o estado dos resultados é maior do que 0 e altera os displays
  if (state.results.length > 0){
          divref.current.style.display = "none";
          sectionref.current.style.display = "flex";
  }

  //Função que acessa a API sem indicar um parâmetro de linguagem e retorna as informações definidas na linguagem disponível
  
  function Language(id){
    axios.get(`${apiurl}/movie/${id}?api_key=${apikey}`).then(({ data }) => {
      let result = data;

      if (result.overview==="" || result.overview===null){
        result.overview = " - "
      }
      if(result.runtime === 0 || result.runtime === null){
        result.runtime=" - ";
      }
      if(result.runtime > 0){
        result.runtime= result.runtime + " min ";
      }
      if(result.vote_average===0 || result.vote_average===null){
        result.vote_average= " - ";
      }
      setState(prevState => {
        return { ...prevState, selected: result }
      });
      
      OverflowOff()

      axios.get(`${apiurl}/movie/${id}/credits?api_key=${apikey}`).then(({ data }) => {

        let res = data.crew;
        let directors = [];

        res.forEach(function(entry){
            if (entry.job === 'Director') {
                directors.push(entry.name);
            }

        })

        setState(prevState => {
          return { ...prevState, directors: directors }
        });

         
     });
    })

    .catch(err => { 
        alert("Sem conexão! API falhou ou não há conexão com a internet!") 
    })
  }

  useEffect(()=>{

    if(state.s.trim()===""){
      axios.get(`${apiurl}/movie/popular?api_key=${apikey}`).then(({ data }) => {
          let results = data.results;

          setState(prevState => {
            return { ...prevState, results: results }

          })
          popref.current.style.display = "flex"
          popref.current.innerHTML = "Mais Populares"

        })
        .catch(err => { 
          alert("Sem conexão! API falhou ou não há conexão com a internet!")

        })
    }

    if (state.s.trim()!=="") {
        axios.get(`${apiurl}/search/movie?query=${state.s.trim()}&api_key=${apikey}`).then(({ data }) => {
          let results = data.results;

          setState(prevState => {
            return { ...prevState, results: results }

          })
          
          if(results.length === 0){
            imgref.current.src = notsearch
            divref.current.style.display = "block"
            notfref.current.innerHTML = "Nenhum filme encontrado"
            sectionref.current.style.display = "none"
            popref.current.style.display = "none"
          }

          state.s = "";
          if (results.length>0) {
            popref.current.style.display = "flex"
            popref.current.innerHTML = "RESULTADOS"
          }

        })

      }

  },[state.s])

 
  const handleInput = (e)=>{

    let s = e.target.value;

    setState(prevState => {
      return { ...prevState, s: s }
    });

  }

  const handleKeyPress = (e) => {
      if(e.key === 'Enter'){
        inputref.current.blur();

        //Verifica se tem somente espaços em branco e quando pressionado enter volta pra vazio.
        
        if(state.s.length === 0 || !state.s.trim()){
          inputref.current.value = ""
        }
      }

      //Detecta o spacebar e não preenche com espaços em branco (não funciona em dispositivos mobile, testei e só funcionou no notebook)
      
      if (e.which === 32 && state.s.trim()===""){
        inputref.current.value = ""
        e.preventDefault()
      }

  }

  const openPopup = id => {
    axios.get(`${apiurl}/movie/${id}?language=pt-BR&api_key=${apikey}`).then(({ data }) => {
      let result = data;

      if (result.overview==="" || result.overview===null){
        return Language(id);
      }
      if(result.runtime === 0 || result.runtime === null){
        result.runtime=" - ";
      }
      if(result.runtime > 0){
        result.runtime= result.runtime + " min ";
      }
      if(result.vote_average===0 || result.vote_average===null){
        result.vote_average= " - ";
      }

      setState(prevState => {
        return { ...prevState, selected: result }
      });
      
      OverflowOff()

      axios.get(`${apiurl}/movie/${id}/credits?api_key=${apikey}`).then(({ data }) => {
        let res = data.crew;
        let directors = [];

        res.forEach(function(entry){
            if (entry.job === 'Director') {
                directors.push(entry.name);
            }

        })

        setState(prevState => {
          return { ...prevState, directors: directors }
        });

     });

    })

    .catch(err => { 
        alert("Sem conexão! API falhou ou não há conexão com a internet!") 
    })

  }

  const closePopup = () => {
    setState(prevState => {
      return { ...prevState, selected: {} }
    });
    setState(prevState => {
      return { ...prevState, directors: [''] }
    });
    
    OverflowOn()
  }
 
  return (
    <div className="App">
      <header>
        <h1>React Filmes</h1>
      </header>
      <main>
        <Busca handleInput={handleInput} handleKeyPress={handleKeyPress} inputref={inputref} />
        <p id="popular" ref={popref}></p>
        <div id="divnone" ref={divref}><img id="imgdiv" ref={imgref} alt=""/><center id="notfound" ref={notfref}></center></div>
        <Resultados results={state.results} sectionref={sectionref} openPopup={openPopup} />
        {(typeof state.selected.title != "undefined" || state.selected.title != null) ? <Popup directors={state.directors} selected={state.selected} closePopup={closePopup} /> : false}
        
      </main>
    </div>

  );
}

export default App;
