import React from 'react'
import logo from "../../assets/images/landing/iconLogo.svg"

function Loader() {
  return (
    <div className='flex items-center justify-center'>
        <img src={logo} alt="" className='w-28 h-28 animate-pulse'/>
    </div>
  )
}

export default Loader