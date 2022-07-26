import React, { useEffect, useState } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Divider } from '@mui/material';

function MusicList(props) {
	const listItems = () => {
		const songs = props.songs
		let listItems = []
		listItems.push(props.listHeader)
		for (let i = 0; i < songs.length; i++) {
			const song = songs[i]
			const listItem = (<ListItem disablePadding key={song.id}>
								<ListItemButton onClick={() => props.onClickHandler(song.id)}>
									<ListItemText primary={song.title} secondary={song.artist}/>
								</ListItemButton>
							</ListItem>)
			listItems.push(listItem)
			listItems.push(<Divider/>)
		}
		return listItems
	}

	return <List> {listItems()} </List>
}

export default MusicList