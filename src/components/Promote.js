import React from 'react'
import { move } from './Game';

const promotionPieces = ['n', 'b', 'r', 'q'];

export default function Promote({
    promotion: {from, to, color},
}) {
    return (
        <div className="board">
            {/*<p>Promotion!</p>*/}
            {promotionPieces.map((p, i) => (
                <div key={i} className="promote-square">
                    <div className="piece-container" onClick={() => move(from, to, p)}>
                        <img src={require(`../assets/${p}_${color}.png`).default} alt={p} className="piece cursor-pointer" />
                    </div>
                </div>
            ))}
        </div>
    )
}
