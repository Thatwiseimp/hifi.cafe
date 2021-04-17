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
  const [playing,setplaying]= useState(false);
  const [myAudio,setaudio] = useState(new Audio("https://firebasestorage.googleapis.com/v0/b/hifi-cafe.appspot.com/o/Blinding%20Lights.mp3?alt=media&token=28ba4074-ca91-4032-84eb-c4de03be20ad"));
  const [recents,setrecents] = useState([])
  const [details, setdetails] = useState("Blinding Lights")


  async function playit(){
    let full_list = await storage.ref('/').listAll()
    // let json_data = full_list.json().then(data => {
    //   console.log(data.items._delegate.items);
    // })
    let data_files = full_list._delegate.items;
    let files = data_files.map((value, index) => {
      let info = value._location.path_
      return info
    })
    // console.log(full_list);
    console.log(files);
    // console.log(full_list._delegate.items[0]._location.path_);
    let promise_list = []
    // console.log( "Got download url: ", files );
    
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

      // .then( url => {
      //   console.log( "Got download url: ", url );
      // })

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
  }

  function rand_play(){
    let rand_int = Math.floor(Math.random()*(songlist.length))
    setrecents([...recents,songlist[rand_int]])
    myAudio.src = songlist[rand_int].url;
    setdetails(songlist[rand_int].name);
    myAudio.play();
    setplaying(true)
    }

  // function rand_play(){
  //   let rand_int = Math.floor(Math.random()*(songlist.length))
  //   var myAudio = new Audio(songlist[rand_int]);
  //     myAudio.play()
  //   console.log(songlist)
  //   }

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
