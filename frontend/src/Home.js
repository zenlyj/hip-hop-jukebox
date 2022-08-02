import React, { useEffect, useState } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback';
import { Button, Grid } from '@mui/material';
import AppHeader from './AppHeader';
import Jukebox from './Jukebox'
import Playlist from './Playlist'

function Home(props) {
    const [playlistURI, setPlaylistURI] = useState([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [val, setVal] = useState(0)

    useEffect(() => {
        const windowURL = window.location.search
        const params = new URLSearchParams(windowURL)
        const authCode = params.get('code')
        if (sessionStorage.getItem('access_token') === null && authCode !== null) {
            Promise.resolve(fetch('http://localhost:8000/spotify/authorize?authorization_code='+authCode))
            .then(value => Promise.resolve(value.json())
                .then(value => {
                    const access_token = value.access_token
                    console.log(access_token)
                    sessionStorage.setItem('access_token', access_token)
                })
            )            
        }              
    })

    const forceRender = () => {
        setVal(val+1)
    }

    const updatePlaylistURI = (uris) => {
        setPlaylistURI(uris)
    }
    
    return (
        <Grid container spacing={3} sx={{bgcolor: '#141414ff'}}>
            <Grid item xs={12} sx={{height: '8vh'}}>
                <AppHeader />
            </Grid>
            <Grid item xs={6} sx={{height: '84.5vh'}}>
                <Jukebox forceRender={forceRender}/>
            </Grid>
            <Grid item xs={6} sx={{height: '84.5vh'}}>
                <Playlist playSongs={setIsPlaying} updatePlaylistURI={updatePlaylistURI} forceRender={forceRender} />
            </Grid>
            <Grid item xs={12} sx={{height: '10vh'}}>
                {   sessionStorage.getItem('access_token') !== null  && isPlaying?
                        <SpotifyPlayer 
                            token={sessionStorage.getItem('access_token')}
                            uris={playlistURI}
                        />
                    : <div> </div>
                }
            </Grid>
      </Grid>
    )
}

export default Home