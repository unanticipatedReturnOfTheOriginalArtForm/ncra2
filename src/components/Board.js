import React, { useEffect, useState } from 'react';
import BoardSquare from './BoardSquare';

export default function Board({ board, turn }) {
    const [currentBoard, setCurrentBoard] = useState([]);
    useEffect(() => {
        setCurrentBoard(
            turn === 'w' ? board.flat() : board.flat().reverse() //.reverse() //  for 'flip'
        )
    }, [board, turn]) 
    function getXYPosition(i) {
        const x = turn === 'w' ? i % 8 : Math.abs(Math.floor(i % 8) - 7);
        const y = turn === 'w' ? Math.abs(Math.floor(i / 8) - 7) : Math.floor(i / 8);
        return {x, y}
    }

    function isBlack(i) {
        const{x,y} = getXYPosition(i);
        return ((x+y) % 2 === 0)
    }

    function getPosition(i){
        const{x,y} = getXYPosition(i);
        const letter = ['a','b','c','d','e','f','g','h'][x];
        //console.log(letter)
        return `${letter}${y+1}`
    }


    return (
        <div className="board">
            {currentBoard.map((piece, i) => // check out this flat() method shit! 
                <div key={i} className="square">
                    {/*<p>{JSON.stringify(piece)}</p>*/}
                    <BoardSquare piece={piece} black={isBlack(i)} position={getPosition(i)}/>
                </div>
            )}
        </div>
    )
}
