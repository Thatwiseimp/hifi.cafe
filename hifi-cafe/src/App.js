import './App.css';
import styled from 'styled-components';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import PauseIcon from '@material-ui/icons/Pause';
import FastForwardIcon from '@material-ui/icons/FastForward';
import {useState} from 'react'

function App() {
  const[play, setplay]=useState()
  const[pause, setpause]=useState()
  const[rewind, setrewind]=useState()
  const[forward, setforward]=useState()

  return (
    <Container>
      <Banner>
        <h1>Hi-fi.cafe</h1>
        <Tools>
          <FastRewindIcon />
          <PlayArrowIcon />
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
