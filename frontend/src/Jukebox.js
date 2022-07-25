import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MusicList from './MusicList'

function Jukebox(props) {
    const modes = ['Latest', 'All']

    const [mode, setMode] = useState(0)
    const [songs, setSongs] = useState([])

    useEffect(() => {
        if (songs.length === 0) {
            Promise.resolve(fetch('http://localhost:8000/songs/'))
            .then(value => Promise.resolve(value.json())
                .then(value => setSongs(value))
            )
        }
    })

    const addToPlaylist = () => {
        // To-Do: implement playlist CRUD API 
    }

    const changeMode = () => {
        const newMode = (mode+1)%modes.length
        setMode(newMode)
    }

    const listHeader = () => {
        return <ListItem disablePadding>
            <ListItemButton onClick={() => changeMode()}>
                <ListItemText primary='Song Selection' secondary={modes[mode]} />
            </ListItemButton>
        </ListItem>
    }

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <nav aria-label='main mail folders'>
                <MusicList listHeader={listHeader()} songs={songs} onClickHandler={addToPlaylist}/>
            </nav>
        </Box>
    )
}

export default Jukebox