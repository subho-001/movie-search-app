import axios from 'axios';
import React, { act, useEffect, useReducer } from 'react'
import "./Omdb.css"
import "./loader.css"
import image from '../assets/image.gif'

function OmdbMoviesReducer() {

    let initialState = {
        movieName:"",
        searchedMovie:"don",
        movies:[],
        loader:false,
        error:false,
        empty:false
    }


    let reducer=(state,action)=>{
        switch (action.type) {
            case "typing_movie": return {...state,movieName:action.payload,loader:true, error:false};
            
            case "searching" :
                // console.log(state.searchedMovie);
                
                 return{...state,searchedMovie:state.movieName, loader:true, error:false}
                
                
            case "getMovies": 
            return {...state, movies:action.payload, loader:false, error:false}

            case "error":
                return{...state, error:true, loader:false}

            case "notFound":
                return{...state,error:false,loader:false,empty:true, movies:[]}
            default:
                return state;
        }
    }

    let[currentState, dispatch] = useReducer(reducer,initialState)

    // console.log(currentState);
    

    let getMovies= async ()=>{

        try{
            let {data} = await axios.get(`https://www.omdbapi.com/?s=${currentState.searchedMovie}&apikey=6683c92f`)
            console.log(data);
            if(data.Response==="True") {
                dispatch({type:"getMovies", payload:data.Search})
            } else if(data.Error==="Movie not found!"){
                dispatch({type:"notFound"})
            }
            
        } catch(err) {
            dispatch({type:"error"})
            console.log(err);
        }
    }


    useEffect(()=>{
        getMovies()
    },[currentState.searchedMovie])

    

    

    let handleInputChange=({target:{value}})=>{

        dispatch({type:"typing_movie", payload:value})

    }

    let handleSearch=()=>{
        if(currentState.movieName.trim()) {

            dispatch({type:"searching"})

        } else {
            dispatch({type:"notFound"})
        }
    }

    console.log(currentState);
    

  return (
    <section className='omdb_movies'>
        <div className='search_movie'>
            <input className='input_field' type="search" placeholder='movie name' onChange={handleInputChange} />
            <button className='btn' onClick={handleSearch}>search</button>
        </div>

        {currentState.error && <h1 style={{color:"red"}}>Incorrect IMDb ID.</h1>}
        {!currentState.loader?<div className='movie_list'>
            {currentState.empty && <h1 style={{color:"red"}}>Movie not found!</h1>}
            {currentState.movies?.map((movie)=>{
                return <div key={movie.imdbID} className='movie'><h1 style={{color:"white"}}>{movie.Title}</h1><img src={movie.Poster==="N/A"?image:movie.Poster} alt="no image" /></div>
            })}
        </div>:<span className="loader"></span>}
         
    </section>
  )
}

export default OmdbMoviesReducer