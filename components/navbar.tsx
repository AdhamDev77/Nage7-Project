import React from 'react'
import MobileSidebar from '../app/(dashboard)/_components/mobileSidebar'
import NavbarRoutes from '@/components/navbarRoutes'

type Props = {}

const Navbar = (props: Props) => {
  return (
<div className="p-4 border-b h-full flex items-center justify-between shadow-sm z-50 backdrop-blur-md bg-white/60">
    <MobileSidebar />
    <NavbarRoutes />
</div>

  )
}

export default Navbar