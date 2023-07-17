import React, { FC, ReactNode } from 'react'
import { NetworkItem, TextInput } from '~/components'
import { Outlet } from 'react-router-dom'



const NetworksPage:FC = () => {
  return <div className={'h-screen flex flex-col'}>
    <div className="bg-p h-20 px-4 flex flex-row items-center ">
      <h2 className="text-2xl text-white mr-16">ATIO-IFMS</h2>
      <span className="mr-10 text-white">Network</span>
      <span className="mr-10 text-white">Configuration</span>
      <span className="mr-10 text-white">Monitoring</span>
      <span className="mr-10 text-white">Reporting</span>
      <span className="mr-10 text-white">User Management</span>
      <span className="mr-10 text-white">Help</span>
    </div>
    <div className="flex flex-row h-full bg-b">
      <div className="w-1/5 border-r-2 border-g p-4 flex flex-col">
        <div className={'flex flex-row items-center'}>
          <label htmlFor={'search'} className={'mr-2'}>Search</label>
          <TextInput id={'search'} className={'flex-grow mr-10'}/>
        </div>

        <button className={"mt-14 flex flex-row items-center active:[&_span]:opacity-50"}>
          <span className={"text-md"}>Networks</span>
          <span className={"text-green-300 text-4xl ml-4"}>+</span>
        </button>

        <NetworkItem name={'test'} to={'sss'} />
      </div>
      <div className={'flex p-4'}><Outlet/></div>
    </div>
    <div className="bg-p h-6">
      footer
    </div>
  </div>
}

export default NetworksPage
