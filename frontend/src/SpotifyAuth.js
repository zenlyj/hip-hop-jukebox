import React from 'react';
import { Routes, Route, Link } from "react-router-dom"

class SpotifyAuth extends React.Component {
    componentDidMount() {
        window.location.replace('https://accounts.spotify.com/authorize?response_type=code&client_id=3f2c9540f73f41a9961f2e2f86357e18&redirect_uri=http://localhost:3000/home/&scope=streaming,user-read-email,user-read-private,user-read-playback-state,user-modify-playback-state')
    }
        
    render() {
        return (
            <div> Loading... </div>
        )
    }
}

export default SpotifyAuth