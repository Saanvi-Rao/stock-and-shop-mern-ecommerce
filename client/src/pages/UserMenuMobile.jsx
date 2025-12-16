import React from 'react'
import UserMenu from '../components/UserMenu'
import { IoClose } from "react-icons/io5";

const UserMenuMobile = () => {
  return (
    <section className="bg-neutral-100 min-h-screen w-full py-4">

      {/* Close button */}
      <button 
        onClick={() => window.history.back()} 
        className="text-neutral-800 block w-fit ml-auto mr-4 mb-2"
      >
        <IoClose size={28} />
      </button>

      {/* Box styled same as desktop */}
      <div className="mx-4 bg-white rounded-lg border-2 border-black shadow-lg p-4">
        <UserMenu />
      </div>

    </section>
  )
}

export default UserMenuMobile
