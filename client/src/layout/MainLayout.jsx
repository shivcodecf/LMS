import Navbar from '@/components/Navbar'
import React from 'react'
import Sidebar from '@/pages/admin/Sidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='dark:bg-black'>
      <Navbar/>
      <div>
        <Outlet/>
        </div>

    </div>

    //  <div className="flex min-h-screen">
    //   {/* Sidebar */}
    //   <Sidebar />

    //   {/* Main content area */}
    //   <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
    //     <Outlet />
    //   </div> 
    //   </div>
   
  )
}

export default MainLayout
