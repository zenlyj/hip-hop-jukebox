import React, { useEffect, useState } from 'react'
import ListContainer from './ListContainer'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

function Playlist(props) {
    const [songs, setSongs] = useState([])

    useEffect(() => {
        getPlaylistSongs()
    })

    const getPlaylistSongs = () => {
        const auth_code = sessionStorage.getItem('access_token')
        if (auth_code == null) return 
        const url = 'http://localhost:8000/playlist/?authentication_code='+auth_code
        Promise.resolve(fetch(url))
        .then(value => Promise.resolve(value.json())
            .then(playlistSongs => {
                if (playlistSongs !== undefined && playlistSongs.length !== songs.length) {
                    setSongs(playlistSongs)
                    props.updatePlaylistURI(playlistSongs.map(song => song.uri))
                }
            })
        )
    }

    const removePlaylistSong = (songId) => {

    }

    const listHeader = () => {
        return <ListItem disablePadding>
            <ListItemButton onClick={() => props.playSongs(true)}>
                <ListItemText primary='Playlist' secondary='Click to listen on Spotify!' primaryTypographyProps={{color: '#ffffff'}} secondaryTypographyProps={{color: '#a1a1a1ff'}}/>
            </ListItemButton>
        </ListItem>
    }

    return (
        <ListContainer listHeader={listHeader()} songs={songs} onClickHandler={removePlaylistSong} />
    )
}

export default Playlist