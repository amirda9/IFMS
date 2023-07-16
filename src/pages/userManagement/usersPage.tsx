import React from 'react';

const UsersPage = () => {
  return <div className={"h-screen flex flex-col"}>
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
      <div className="w-1/5 border-r-2 border-g p-4">sidebar</div>
      <div className={"flex p-4"}>body</div>
    </div>
    <div className="bg-p h-6">
      footer
    </div>
  </div>;
};

export default UsersPage;
