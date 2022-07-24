import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Divider } from '@mui/material';

function MusicList(props) {
	useEffect(() => {
		console.log('asd')
	})

	const listItems = () => {
		const songs = props.songs
		let listItems = []
		for (let i = 0; i < songs.length; i++) {
		  const song = songs[i]
		  const listItem = (<ListItem disablePadding key={song.id}>
							  <ListItemButton onClick={() => props.onClickHandler(song.id)}>
								<ListItemText primary={song.title} />
								<ListItemText secondary={song.artist} />
							  </ListItemButton>
						  </ListItem>)
		  listItems.push(listItem)
		  listItems.push(<Divider/>)
		}
		return listItems
	}

	return (
		<Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <nav aria-label="main mailbox folders">
                <List>
                  {listItems()}
                </List>
              </nav>
        </Box>
	)
}

export default MusicList