import React from 'react'
import AddIcon from '/icons/Add.svg'
import RemoveIcon from '/icons/Remove.svg'
const Sidebar = () => {
    return (
        <aside id="sidebar" className="fixed hidden z-20 h-full top-0 left-0 pt-[61px] flex lg:flex flex-shrink-0 flex-col w-80 transition-width duration-75" aria-label="Sidebar">
            <div className="relative flex-1 flex flex-col min-h-0 border-r bg-[#E7EFF7] border-gray-200 pt-0">
                <div className="flex-1 flex flex-col pt-4 pb-4 overflow-y-auto  ">
                    <div className="flex-1 px-3 divide-y space-y-1">
                        <ul className="space-y-2 pb-2">
                            <li>
                                <form action="#" method="GET" className="">
                                    <label htmlFor="mobile-search" className="sr-only">Search</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                                        </div>
                                        <input type="text" name="email" id="mobile-search" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 block w-full pl-4 p-2.5"
                                            placeholder="Search" />
                                    </div>
                                </form>
                            </li>
                            <li>
                                <div className='flex mt-12'>
                                    <span className='font-bold mr-4'>Networks</span>
                                    <span>
                                        <img src={AddIcon}/>
                                    </span>
                                </div>
                            </li>
                            <li>

                            </li>

                            <li>
                                <a href="#" className="text-base items-center justify-between text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                                    <span className="">Tehran</span>
                                    <img src={RemoveIcon} alt="" />
                                </a>
                            </li>

                        </ul>
                        <div className="space-y-2 pt-2">

                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar