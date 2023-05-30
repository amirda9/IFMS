import * as React from 'react';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import NetworkDetailForm from '../components/forms/NetworkForm';



const Dashboard = () => {
    return (
        <div>
            <Header />
            <div className="flex overflow-hidden pt-[61px]">
                <Sidebar />
                <div id="main-content" className="h-[93vh] w-full bg-[#E7EFF7] relative overflow-y-auto lg:ml-80">
                    <main>
                         <NetworkDetailForm/>
                    </main>
                </div>
            </div>
        </div>

    )
}
export default Dashboard