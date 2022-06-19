import React from 'react'
import SpotifyPlayer from 'react-spotify-web-playback';
import { Button, Grid } from '@mui/material';
import MusicList from './MusicList'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          jukebox: [],
          playlist: [],
          playlistURI: [],
          isPlaying: false,
        }
        this.jukeBoxToPlaylist = this.jukeBoxToPlaylist.bind(this)
        this.playListToJukeBox = this.playListToJukeBox.bind(this)
        this.loadSongs = this.loadSongs.bind(this)
    }

    componentDidMount() {
        Promise.resolve(fetch('http://localhost:8000/songs/'))
            .then(value => Promise.resolve(value.json())
                .then(value => this.setState({jukebox: value}))
            )
        const windowURL = window.location.search
        const params = new URLSearchParams(windowURL)
        Promise.resolve(fetch('http://localhost:8000/spotify/authorize?authorization_code='+params.get('code')))
            .then(value => Promise.resolve(value.json())
                .then(value => {
                    if (sessionStorage.getItem('access_token') === null) {
                        const access_token = JSON.parse(value).access_token
                        sessionStorage.setItem('access_token', access_token)
                    }
                })
            )
    }

    componentDidUpdate() {
        if (this.state.playlistURI.length > 0 && this.state.playlistURI.length === this.state.playlist.length && !this.state.isPlaying) {
            this.setState({isPlaying: true})
        }
    }

    loadSongs() {
        for (let i = 0; i < this.state.playlist.length; i++) {
            const song = this.state.playlist[i]
            const query = song.title + ' ' + song.artist
            const queryType = 'track'
            this.getSongURI(query, queryType, sessionStorage.getItem('access_token'))
        }
    }

    getSongURI(query, queryType, token, toPlay) {
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
                    const uris = this.state.playlistURI
                    uris.push(value.tracks.items[0].uri)
                    this.setState({playlistURI: uris})
                })
        )
    }

    getIndex(songs, songId) {
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].id == songId) {
            return i
          }
        }
    }    

    jukeBoxToPlaylist(songId) {
        const idx = this.getIndex(this.state.jukebox, songId)
        const song = this.state.jukebox[idx]
        const updatedJukebox = this.state.jukebox
        updatedJukebox.splice(idx, 1)
        const updatedPlaylist = this.state.playlist
        updatedPlaylist.push(song)
        this.setState({
          jukebox : updatedJukebox,
          playlist : updatedPlaylist
        })
      }
    
    playListToJukeBox(songId) {
        const idx = this.getIndex(this.state.playlist, songId)
        const song = this.state.playlist[idx]
        const updatedPlaylist = this.state.playlist
        updatedPlaylist.splice(idx, 1)
        const updatedJukebox = this.state.jukebox
        updatedJukebox.push(song)
        this.setState({
          jukebox : updatedJukebox,
          playlist : updatedPlaylist
        })
    }
    
    render() {
        const token = sessionStorage.getItem('access_token')
        console.log(this.state.playlistURI)
        return (
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <MusicList songs={this.state.jukebox} onClickHandler={this.jukeBoxToPlaylist}/>
            </Grid>
            <Grid item xs={6}>
              <MusicList songs={this.state.playlist} onClickHandler={this.playListToJukeBox}/>
            </Grid>
            {   token !== null && this.state.isPlaying ?
                    <SpotifyPlayer 
                        token={token}
                        uris={this.state.playlistURI}
                    />
                : <Button onClick={() => this.loadSongs()}> Play Songs </Button>
            }
          </Grid>
        );
    }
}

export default Home