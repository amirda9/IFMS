import React, { useRef } from 'react'

export const InputFile = () => {
    const fileInput = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (fileInput.current) {
            fileInput.current.click();
        }
    };
    return (
        <div className='flex items-center '>
            <span className='whitespace-nowrap mr-10 text-sm'>Topology Folder</span>
            <input type="file" ref={fileInput} style={{ display: 'none' }} />
            <span className='shadow bg-white appearance-none border rounded w-[70.5%] py-5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'></span>
            <button className='btn-browse py-2 px-2 ml-10' onClick={handleClick}>Browse Folder</button>
        </div>
    )
}
