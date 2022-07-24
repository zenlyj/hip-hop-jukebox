import React, { useEffect, useState } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback';
import { Button, Grid } from '@mui/material';
import MusicList from './MusicList'

function Home(props) {
    const [jukebox, setJukebox] = useState([])
    const [playlist, setPlaylist] = useState([])
    const [playlistURI, setPlaylistURI] = useState([])
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        if (jukebox.length === 0) {
            Promise.resolve(fetch('http://localhost:8000/songs/'))
                .then(value => Promise.resolve(value.json())
                    .then(value => setJukebox(value))
                )
        }
        const windowURL = window.location.search
        const params = new URLSearchParams(windowURL)
        if (sessionStorage.getItem('access_token') === null) {
            Promise.resolve(fetch('http://localhost:8000/spotify/authorize?authorization_code='+params.get('code')))
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

    const loadSongs = () => {
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

    const getIndex = (songs, songId) => {
        for (let i = 0; i < songs.length; i++) {
            if (songs[i].id == songId) {
              return i
            }
          }        
    }

    const jukeBoxToPlaylist = (songId) => {
        const idx = getIndex(jukebox, songId)
        const song = jukebox[idx]
        const updatedJukebox = jukebox.slice()
        updatedJukebox.splice(idx, 1)
        const updatedPlaylist = playlist
        updatedPlaylist.push(song)
        setJukebox(updatedJukebox)
        setPlaylist(updatedPlaylist)
    }

    const playListToJukeBox = (songId) => {
        const idx = getIndex(playlist, songId)
        const song = playlist[idx]
        const updatedPlaylist = playlist.slice()
        updatedPlaylist.splice(idx, 1)
        const updatedJukebox = jukebox
        updatedJukebox.push(song)
        setJukebox(updatedJukebox)
        setPlaylist(updatedPlaylist)
    }
    
    return (
        <Grid container spacing={5}>
            <Grid item xs={6}>
            <MusicList songs={jukebox} onClickHandler={jukeBoxToPlaylist}/>
            </Grid>
            <Grid item xs={6}>
            <MusicList songs={playlist} onClickHandler={playListToJukeBox}/>
            </Grid>
            {   sessionStorage.getItem('access_token') !== null && isPlaying ?
                    <SpotifyPlayer 
                        token={sessionStorage.getItem('access_token')}
                        uris={playlistURI}
                    />
                : <Button onClick={() => loadSongs()}> Play Songs </Button>
            }
      </Grid>
    )
}

export default Home