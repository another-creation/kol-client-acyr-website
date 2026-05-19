import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SideNav from '../framework/SideNav'
import Icon from '@components/loaders/icons/Icon'
import { GeneratorLibraryProvider } from '../../editor/library/LibraryProvider'
import { ModalProvider } from '@components/molecules/Modal'
import StyleguideSearch from './StyleguideSearch'

export default function BrandLayout() {
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const { pathname } = useLocation()

  useEffect(() => { setDrawerOpen(false) }, [pathname])

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  return (
    <GeneratorLibraryProvider>
      <ModalProvider>
      <div className="ac-brand-layout" data-drawer-open={drawerOpen ? 'true' : undefined}>
        <button
          type="button"
          className="ac-sidenav-hamburger md:hidden fixed top-3 left-3 z-30 w-10 h-10 inline-flex items-center justify-center rounded-full bg-surface-primary border border-fg-08 text-emphasis"
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen((v) => !v)}
        >
          <Icon name={drawerOpen ? 'x' : 'menu'} size={18} />
        </button>

        <div
          className="ac-sidenav-backdrop fixed inset-0 z-20 bg-black/50 opacity-0 pointer-events-none transition-opacity duration-200 md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />

        <SideNav drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />
        <main className="min-w-0">
          <Outlet />
        </main>
        <StyleguideSearch open={searchOpen} setOpen={setSearchOpen} />
      </div>
      </ModalProvider>
    </GeneratorLibraryProvider>
  )
}
