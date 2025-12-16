import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)

  return (
    <section className='bg-white w-full'>
        <div className='w-full max-w-full p-3 grid lg:grid-cols-[250px,1fr]'>
            
            {/* Left menu */}
            <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r'>
              <UserMenu/>
            </div>

            {/* Right content */}
            <div className='bg-white min-h-[75vh] w-full'>
              <Outlet/>
            </div>

        </div>
    </section>
  )
}

export default Dashboard
