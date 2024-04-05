import React from 'react'
import GeneralLoadingSpinner from './GeneralLoadingSpinner'

function Mainloading() {
  return (
  <>
        <div className="fixed left-0 right-0 top-0 z-[200000] flex h-screen w-screen items-center justify-center bg-neutral-400 opacity-60"></div>
      <GeneralLoadingSpinner className="fixed left-[calc(50%-50px)] top-[35%] z-[300000] h-[100px] w-[100px]" />
  </>
  )
}

export default Mainloading