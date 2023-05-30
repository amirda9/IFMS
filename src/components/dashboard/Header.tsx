import React from 'react'
import DropDown from './DropDown'
import userIcon from '/icons/User.svg'
const Header = () => {
    return (
        <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
            <div className="px-3 bg-[#006BBC] text-white py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center ">
                    <div className="flex items-center justify-start">
                        <a href="#" className="text-xl font-bold flex items-center lg:ml-2.5">
                            <span className="self-center sansation-font whitespace-nowrap">ARIO-IFMS</span>
                        </a>
                    </div>
                    <div className="flex ml-12 items-center">
                        <div className="hidden lg:flex items-center">
                            <div className="-mb-1">
                                <DropDown title='Network' items={[{ title: 'Networks', link: '' }, { title: 'Regions', link: '' }, { title: 'Stations', link: '' }, { title: 'link', link: '' }, { title: 'Map View', link: '' }]} />
                            </div>
                            <div className="-mb-1">
                                <DropDown title='Configuration' items={[{ title: 'Networks', link: '' }, { title: 'Regions', link: '' }, { title: 'Stations', link: '' }, { title: 'link', link: '' }, { title: 'Map View', link: '' }]} />
                            </div>
                        </div>
                    </div>
                    <div className='ml-auto'>
                        <div className="-mb-1 flex">
                            <img src={userIcon} alt="" />
                            <DropDown title='user name' items={[{ title: 'profile', link: '' }, { title: 'sign out', link: '' }]} />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header