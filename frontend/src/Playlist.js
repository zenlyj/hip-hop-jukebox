import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MusicList from './MusicList'

function Playlist(props) {
    const authenticateSpotify = () => {
        const url = window.location.search
        window.location.replace(url + '/spotifyauth')
    }

    const listHeader = () => {
        return <ListItem disablePadding>
            <ListItemButton onClick={() => authenticateSpotify()}>
                <ListItemText primary='Playlist' secondary='Click to listen on Spotify!'/>
            </ListItemButton>
        </ListItem>
    }

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <nav aria-label='main mail folders'>
                <MusicList listHeader={listHeader()} songs={props.songs} onClickHandler={props.playListToJukebox}/>
            </nav>
        </Box>
    )
}

export default Playlist