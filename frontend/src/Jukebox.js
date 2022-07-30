import React, { useEffect, useState } from 'react'
import ListContainer from './ListContainer'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

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
                <ListItemText primary='Song Selection' secondary={modes[mode]} primaryTypographyProps={{color: '#ffffff'}} secondaryTypographyProps={{color: '#a1a1a1ff'}}/>
            </ListItemButton>
        </ListItem>
    }

    return (
        <ListContainer listHeader={listHeader()} songs={songs} onClickHandler={addToPlaylist}/>
    )
}

export default Jukebox