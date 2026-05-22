import { Link } from 'react-router-dom'
import usePageTitle from '../components/hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Not found')

  return (
    <section className="ac-page-hero">
      <p className="site-meta-status mb-4">404</p>
      <h1 className="site-title-page mb-6">Not here.</h1>
      <p className="site-subline-hero max-w-[60ch]">
        That route isn&rsquo;t part of this site.{' '}
        <Link to="/" className="text-emphasis hover:text-strong underline">
          Back home
        </Link>
        .
      </p>
    </section>
  )
}
