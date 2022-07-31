import React, { useEffect, useState } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback';
import { Button, Grid } from '@mui/material';
import AppHeader from './AppHeader';
import Jukebox from './Jukebox'
import Playlist from './Playlist'

function Home(props) {
    const [jukebox, setJukebox] = useState([])
    const [playlist, setPlaylist] = useState([])
    const [playlistURI, setPlaylistURI] = useState([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [value, setValue] = useState(0)

    useEffect(() => {
        const windowURL = window.location.search
        const params = new URLSearchParams(windowURL)
        const authCode = params.get('code')
        console.log(sessionStorage.getItem('access_token'))
        if (sessionStorage.getItem('access_token') === null && authCode !== null) {
            Promise.resolve(fetch('http://localhost:8000/spotify/authorize?authorization_code='+authCode))
            .then(value => Promise.resolve(value.json())
                .then(value => {
                    const access_token = JSON.parse(value).access_token
                    console.log(access_token)
                    sessionStorage.setItem('access_token', access_token)
                })
            )            
        }
        if (playlistURI.length > 0 && playlistURI.length === playlist.length && !isPlaying) {
            setIsPlaying(true)
        }                
    })

    const forceRender = () => {
        setValue(value+1)
    }

    const loadSongs = () => {
        console.log(sessionStorage.getItem('access_token'))
        for (let i = 0; i < playlist.length; i++) {
            const song = playlist[i]
            const query = song.title + ' ' + song.artist
            const queryType = 'track'
            getSongURI(query, queryType, sessionStorage.getItem('access_token'))
        }        
    }

    const getSongURI = (query, queryType, token) => {
        let url = 'https://api.spotify.com/v1/search?'
        const params = new URLSearchParams({
            q: query,
            type: queryType,
            limit: 1
        })
        url += params
        Promise.resolve(fetch(url, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + token
            }
        })).then(value => Promise.resolve(value.json())
                .then(value => {
                    const uris = playlistURI
                    uris.push(value.tracks.items[0].uri)
                    setPlaylistURI(uris)
                })
        )        
    }
    
    return (
        <Grid container spacing={3} sx={{bgcolor: '#141414ff'}}>
            <Grid item xs={12} sx={{height: '8vh'}}>
                <AppHeader />
            </Grid>
            <Grid item xs={6} sx={{maxHeight: '86.2vh'}}>
                <Jukebox forceRender={forceRender}/>
            </Grid>
            <Grid item xs={6} sx={{maxHeight: '86.2vh'}}>
                <Playlist />
            </Grid>
            <Grid item xs={12} sx={{height: '8vh'}}>
                {   sessionStorage.getItem('access_token') !== null && isPlaying ?
                        <SpotifyPlayer 
                            token={sessionStorage.getItem('access_token')}
                            uris={playlistURI}
                        />
                    : <Button onClick={() => loadSongs()}> Play Songs </Button>
                }
            </Grid>
      </Grid>
    )
}

export default Home