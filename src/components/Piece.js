import React from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';

export default function Piece({piece: {type, color}, position}) {
    const [{ isDragging }, drag, preview] = useDrag({
        type: 'piece',
        item: {type: 'piece', id: `${position}_${type}_${color}`},
        //item: {type: 'piece', id: `${type}_${color}`}, // version 11 versus 14, NB the comma
        collect: (monitor) => {
            return {isDragging: !!monitor.isDragging()}
        },
    })
    const pieceImg = require(`../assets/${type}_${color}.png`).default; // THIS .default
    return (
        <>
            <DragPreviewImage connect={preview} src={pieceImg} />
            <div className="piece-container" ref={drag} style= {{opacity: isDragging? 0 : 1}}>
                <img src={pieceImg} alt={type} className="piece" />
            </div>
        </>
    )
}
