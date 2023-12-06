import React, { ReactNode } from 'react'
import { Outlet } from 'react-router-dom';

type PropsType = {
  children: ReactNode;
};
function Pd({children}:PropsType) {
  return (<>
   <div className="mt-2">{children}</div>
  <Outlet />
  </>
   

  )
}

export default Pd