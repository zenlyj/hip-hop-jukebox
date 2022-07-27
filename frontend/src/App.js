import React from 'react';
import { Routes, Route, Link } from "react-router-dom"
import Home from './Home'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SpotifyAuth from './SpotifyAuth'

function App(props) {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  })

  return (  
      <div>
          <ThemeProvider theme={darkTheme}>
              <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/spotifyauth" element={<SpotifyAuth />} />
              </Routes>
          </ThemeProvider>
      </div>
  )
}

export default App;
