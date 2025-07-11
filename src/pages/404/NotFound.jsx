import React from 'react'
import MainButton from '../../components/common/buttons/MainButton'

function NotFound() {
  return (
    <div className='font-rubik w-full'>
        <div className='flex justify-center'>
            <img src="../../../src/assets/images/404/404.png" alt="" />
        </div>
        <div className='tracking-widest text-gray-700 flex flex-col gap-2 mt-10'>
            <h4 className='font-medium text-[17px] sm:text-[20px]'>PAGE NOT FOUND</h4>
            <p className='font-light text-[12px] sm:text-[14px]'>Sorry! we couldn’t find the page you are looking for </p>
        </div>
        <div className='flex flex-col mt-10 w-full justify-center gap-5 sm:flex-row'>
            <div>
                <MainButton className='px-4 font-medium text-[10px] md:text-[12px] tracking-widest'>GO BACK HOME</MainButton>
            </div>
            <button className='tracking-widest text-[11px]'>CONTACT SUPPORT <span>&#8594;</span></button>
        </div>
    </div>
  )
}

export default NotFound