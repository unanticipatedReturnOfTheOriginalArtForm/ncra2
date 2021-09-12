import React from 'react'

export default function Square({children, black}) {
    const bgClass = black ? 'square-black' : 'square-white';
    return (
        <div className={`${bgClass} board-square`}> 
            {children} {/* this is the line that made the 'lettered' board appear */}
        </div>
    )
}
