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

    const addToPlaylist = (songId) => {
        const auth_code = sessionStorage.getItem('access_token')
        console.log(JSON.stringify({
            authentication_code: auth_code,
            song: songId
        }))
        const url = 'http://localhost:8000/playlist/'
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authentication_code: auth_code,
                song: songId
            })
        })
        .then((response) => {
            if (response.status == 200) {
                props.forceRender()
            } else {
                console.log('Failed to add to playlist')
            }
        })
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