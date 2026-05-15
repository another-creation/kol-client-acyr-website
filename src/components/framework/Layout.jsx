import { Outlet } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <ScrollToTop />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
