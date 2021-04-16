import './App.css';
import styled from 'styled-components';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import PauseIcon from '@material-ui/icons/Pause';
import FastForwardIcon from '@material-ui/icons/FastForward';
import {useState, useEffect} from 'react'
import {storage} from './firebase'
// import promise
function App() {
  // const[play, setplay]=useState()
  // const[pause, setpause]=useState()
  // const[rewind, setrewind]=useState()
  // const[forward, setforward]=useState()
  const [songlist,setsonglist]= useState([]);

  async function playit(){
    let files = [ 'Blinding Lights.mp3','Midnight Sky.mp3' ];
    let promise_list = []
    // console.log( "Got download url: ", files );
    // let newl = files.map( filename => {
    for (let i=0;i<files.length;i++){
      let filename = files[i]
      let store = await storage.ref( `/${filename}`).getDownloadURL()
      let url = await store
      promise_list.push(url)
    }
    Promise.all(promise_list)
    .then((results)=>{
      setsonglist(results);
      console.log(songlist);
    })

      // .then( url => {
      //   console.log( "Got download url: ", url );
      // })

  }

  function rand_play(){
    let rand_int = Math.floor(Math.random()*(songlist.length))
    var myAudio = new Audio(songlist[rand_int]);
      myAudio.play()
    console.log(songlist)
    }

  useEffect(()=>{
    playit()
  },[])

  return (
    <Container>
      <Banner>
        <h1>Hi-fi.cafe ☕</h1>
        <Tools>
          <FastRewindIcon />
          <PlayArrowIcon onClick={rand_play}/>
          <PauseIcon />
          <FastForwardIcon />
          <Info>Songs info</Info>

        </Tools>
      </Banner>
      <Content>

      </Content>
    </Container>
  );
}

export default App;
const Container = styled.div`
  background-color: black;
  min-height: 100vh;
  padding: 0px;
  margin: 0px;
`
const Banner = styled.div`
  color:white;
  text-align: center;
`
const Content= styled.div`
  color:white;
  text-align: center;
`
const Tools= styled.div`
  height:30px;
  width: 30px;
`
const Info = styled.div ``
