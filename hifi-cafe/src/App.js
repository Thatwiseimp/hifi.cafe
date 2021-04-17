import './App.css';
import styled from 'styled-components';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import PauseIcon from '@material-ui/icons/Pause';
import FastForwardIcon from '@material-ui/icons/FastForward';
import {useState, useEffect, useRef} from 'react'
import {storage} from './firebase'



function App() {
  const [songlist,_setsonglist]= useState([]);
  const [image,setimage]= useState("http://giphy.com/gifs/MuztdWJQ4PR7i")
  const [playing,setplaying]= useState(false);
  const [myAudio,setaudio] = useState(new Audio("https://firebasestorage.googleapis.com/v0/b/hifi-cafe.appspot.com/o/oh_no_oh_no.mp3?alt=media&token=375d5278-3b2a-4d1a-95e3-51d8790e75cd"));
  const [recents,setrecents] = useState([])
  const [details, setdetails] = useState("Oh no!")
  const myStateRef = useRef(songlist);
  const setsonglist = data => {
    myStateRef.current = data;
    _setsonglist(data);
  };



  async function playit(){
    let full_list = await storage.ref('/').listAll()
    let data_files = full_list._delegate.items;
    let files = data_files.map((value, index) => {
      let info = value._location.path_
      return info
    })
    console.log(files);

    let promise_list = []    
    for (let i=0;i<files.length;i++){
      let filename = files[i]
      let store = await storage.ref( `/${filename}`).getDownloadURL()
      let url = await store
      promise_list.push(url)
    }
    Promise.all(promise_list)
    .then((results)=>{
      let lst = results.map((value, index) => {
        return {name: files[index], url: value};
      })
      setsonglist(lst);
      console.log(lst);
    })
    myAudio.addEventListener('ended', function(){rand_play()});


    // document.body.appendChild(myAudio)
  }

  function setgif(){
    let data;
    const giphy = require('giphy-api-without-credentials')('LW4KBeDgzRVgzEe7kZYmFIBZmJtNVus5');
    giphy.search('pokemon', function(err, res) {
      console.log(res) 
      res.data.map((data)=>setimage(data.url))
});

    let url = `https://api.giphy.com/v1/gifs/search?api_key=LW4KBeDgzRVgzEe7kZYmFIBZmJtNVus5&q=depressed`
    
    fetch(url).then(response => response.json())
    .then(data=> { setimage(data.data[Math.floor(Math.random()*data.data.length)].url)})
    // .then(data=> { console.log(data.data )})
    .catch(err => console.error(err))
    // console.log(res);
  }

  function getprev(){
    myAudio.src = songlist[recents.length-2].url;
    setdetails(songlist[recents.length-2].name);
    let newlist=[...recents]
    newlist.pop()
    console.log(newlist)
    setrecents(newlist)
    myAudio.play();
    setplaying(true)
  }

  function pause(){
    console.log("paused");
    setplaying(false);
    myAudio.pause();
  }

  function play(){
    setplaying(true);
    myAudio.play(); 
    setgif();   
  }

  function rand_play(){
    let mysonglist = myStateRef.current;
    let rand_int = Math.floor(Math.random()*(mysonglist.length-1))
    console.log(mysonglist , rand_int)
    setrecents([...recents,mysonglist[rand_int]])
    myAudio.src = mysonglist[rand_int].url;
    setdetails(mysonglist[rand_int].name);
    myAudio.play();
    setplaying(true)
    }



  useEffect(()=>{
    
    playit();
  },[])

  return (
    <Container>
      <Banner>
        <h1>Hi-fi.cafe ☕</h1>
        <Tools>
          { recents.length > 1 ? <FastRewindIcon onClick={getprev}/> : null}
          { (playing)  ? <PauseIcon onClick={pause}/> : <PlayArrowIcon onClick={play}/> }
          
          <FastForwardIcon onClick={rand_play}/>
          <Info>{details}</Info>

        </Tools>
      </Banner>
      <Content>
        {/* {document.createElement('image',image)} */}
        {/* <div style={{backgroundImage:` url(${image})`}}></div> */}
        <img src='${image}' crossOrigin="anonymous" />.



      </Content>
    </Container>
  );
}

export default App;
const Container = styled.div`
  background-color: black;
  background-image:url('https://tenor.com/7Xyh.gif');
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
const Info = styled.div `
  font-family: Courier new;
`
