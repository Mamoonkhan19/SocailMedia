import React from 'react'
import { Outlet } from 'react-router-dom'
import TopBar from '../components/shared/TopBar'
import LeftSider from '../components/shared/LeftSider'
import Bottom from '../components/shared/Bottom'
function RootLayout() {
  return (
     <div className="w-full md:flex">
      <TopBar />
      <LeftSider />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <Bottom />
    </div>
  )
}

export default RootLayout