import React, { useEffect, useState } from 'react'
import ListContainer from './ListContainer'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

function Playlist(props) {
    const [songs, setSongs] = useState([])


    const authenticateSpotify = () => {
        const url = window.location.search
        window.location.replace(url + '/spotifyauth')
    }

    const getPlaylistSongs = () => {
        // To-Do: Implement playlist CRUD API
    }

    const removePlaylistSong = (songId) => {

    }

    const listHeader = () => {
        return <ListItem disablePadding>
            <ListItemButton onClick={() => authenticateSpotify()}>
                <ListItemText primary='Playlist' secondary='Click to listen on Spotify!' primaryTypographyProps={{color: '#ffffff'}} secondaryTypographyProps={{color: '#a1a1a1ff'}}/>
            </ListItemButton>
        </ListItem>
    }

    return (
        <ListContainer listHeader={listHeader()} songs={songs} onClickHandler={removePlaylistSong} />
    )
}

export default Playlist