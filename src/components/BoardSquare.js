import React, { useEffect, useState } from 'react';
import Square from './Square';
import Piece from './Piece';
import { useDrop } from 'react-dnd';
import { gameSubject, handleMove } from './Game';
//import { handleMove } from './Game';
import Promote from './Promote';

export default function BoardSquare({piece, black, position}) {
    const [promotion, setPromotion] = useState(null);
    const [, drop] = useDrop({
        accept: 'piece',
        drop: (item) => {
            const [fromPosition] = item.id.split('_')
            handleMove(fromPosition, position)
        },
    })
    useEffect(() => {
        const subscriber = gameSubject.subscribe(({pendingPromotion}) => 
            (pendingPromotion && pendingPromotion.to === position) ? setPromotion(pendingPromotion) : setPromotion(null)
        )
        return () => subscriber.unsubscribe();
    }, [position]) // THIS was where the 'position' problem was caused, I had [] instead of [position]
    return (
        <div className="board-square" ref={drop}>
            <Square black={black}>
                {/*{piece && (<Piece piece={piece} position={position}/>)}*/} {/* polling condition, I say */}
                {promotion ? (
                    <Promote promotion={promotion}/>
                ) : piece ? (
                    <Piece piece={piece} position={position} />
                ) : null}
            </Square>
        </div>
    )
}
