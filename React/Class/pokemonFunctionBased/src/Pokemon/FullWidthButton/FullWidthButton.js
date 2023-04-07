import React from 'react'
import "./fullWidthButton.css"

const FullWidthButton = ({ addSquad }) => {


    return (
        <button className='FullWidthButton' onClick={addSquad}>add to card</button>
    )
}

export default FullWidthButton