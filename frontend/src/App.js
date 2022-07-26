import React from 'react';
import { Routes, Route, Link } from "react-router-dom"
import Home from './Home'
import SpotifyAuth from './SpotifyAuth'

class App extends React.Component {
  render() {  
    return (
      <div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/spotifyauth" element={<SpotifyAuth />} />
        </Routes>
      </div>
    )
  }
}

export default App;
