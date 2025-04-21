import Navbar from '@/components/user/common/Navbar'
import { Outlet } from 'react-router-dom'

function AppLayout() {
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default AppLayout
