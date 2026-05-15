import { Link } from 'react-router-dom'
import usePageTitle from '../components/hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Not found')

  return (
    <section className="kol-page-hero">
      <p className="kol-helper-12 uppercase tracking-widest text-meta m-0 mb-4">404</p>
      <h1 className="kol-sans-display-01 text-emphasis m-0 mb-6">Not here.</h1>
      <p className="kol-sans-body-01 text-body m-0 max-w-[60ch]">
        That route isn&rsquo;t part of this site.{' '}
        <Link to="/" className="text-emphasis hover:text-strong underline">
          Back home
        </Link>
        .
      </p>
    </section>
  )
}
