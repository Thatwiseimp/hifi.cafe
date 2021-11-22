import './App.css';
import styled from 'styled-components';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import PauseIcon from '@material-ui/icons/Pause';
import FastForwardIcon from '@material-ui/icons/FastForward';
import {useState, useEffect, useRef} from 'react'
import {storage} from './firebase'
import head from './image/head.png'
import prof1 from './image/github.png'
import prof2 from './image/github.png'
import FadeIn from 'react-fade-in';




function App() {
  const [songlist,_setsonglist]= useState([]);
  const [image,setimage]= useState("https://media0.giphy.com/media/YQbWaRk0MoZ5m/giphy.gif?cid=6a29bdc4w4t3fi0uc0r2t3cg587cvd5m42y91y4cxzc1ltoj&rid=giphy.gif&ct=g")
  const [playing,setplaying]= useState(false);
  const [myAudio,setaudio] = useState(new Audio("https://firebasestorage.googleapis.com/v0/b/hifi-cafe.appspot.com/o/Blinding%20Lights.mp3?alt=media&token=28ba4074-ca91-4032-84eb-c4de03be20ad"));
  const [recents,setrecents] = useState([])
  const [details, setdetails] = useState("Blinding lights")
  const myStateRef = useRef(songlist);
  const[fade,set_fade]=useState(false)
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
    let url = `https://api.giphy.com/v1/gifs/search?api_key=LW4KBeDgzRVgzEe7kZYmFIBZmJtNVus5&q=sadness`

    fetch(url).then(response => response.json())
    .then(data=> { setimage(data.data[Math.floor(Math.random()*data.data.length)].images.downsized.url)})
    // .then(data=> { console.log(data )})
    .catch(err => console.error(err))
    // console.log(res);
  }

  function getprev(){
    myAudio.src = recents[recents.length-2].url;
    setdetails(recents[recents.length-2].name);
    let newlist=[...recents]
    newlist.pop()
    console.log(newlist)
    setrecents(newlist)
    myAudio.play();
    setplaying(true)
    setgif()
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
    let mysonglist = myStateRef.current;
    let rand_int = Math.floor(Math.random()*(mysonglist.length-1))
    console.log(mysonglist , rand_int)
    setrecents([...recents,mysonglist[rand_int]])
    myAudio.src = mysonglist[rand_int].url;
    setdetails(mysonglist[rand_int].name);
    myAudio.play();
    setplaying(true)
    setgif();
  }

  function fader(){
    set_fade(true)
    setTimeout(fadeout,4500);
  }
  function fadeout(){
    set_fade(false)
  }

  async function registerSW() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('./sw.js');
      } catch (e) {
        console.log(`SW registration failed`);
      }
    }
  }

  useEffect(()=>{

    playit();
    registerSW();
  },[])

  return (
    <Container className='cont' style={{backgroundImage: `url(${image})`}}>
      <Banner >
        <div className='hd'>
          <img  id="my_image1" src={head}></img>
          <div className="names">
            <img onClick="window.location.href='https://github.com/Thatwiseimp';" id='my_image2' src={prof1}></img>
            <img onClick="window.location.href='https://github.com/cosmoglint';" id='my_image2' src={prof2}></img>

          </div>


        </div>
        {fade ? <FadeIn >
          <Tools className='toolbar'>
            { recents.length > 1 ? <FastRewindIcon onClick={getprev} style={{ fontSize: 50 , padding: 15, color: 'black'}}/> : null}
            { (playing)  ? <PauseIcon onClick={pause} style={{ fontSize: 50, padding: 15 , color: 'black'}} /> : <PlayArrowIcon onClick={play} style={{ fontSize: 50, padding: 15, color: 'black' }} /> }

            <FastForwardIcon onClick={rand_play} style={{ fontSize: 50, padding: 15, color: 'black' }}/>


          </Tools>

        </FadeIn> : null}
        <Info onMouseOver={fader} className='info'>{details}</Info>
      </Banner>
      <Content>
        {/* {document.createElement('image',image)} */}
        {/* <div style={{backgroundImage:` url(${image})`}}></div> */}
        {/* <img src='${image}' crossOrigin="anonymous" />. */}



      </Content>
    </Container>
  );
}

export default App;
const Container = styled.div`

  background-color: black;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  padding: 0px;
  margin: 0px;
  position: fixed
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
`
const Info = styled.div `
`
