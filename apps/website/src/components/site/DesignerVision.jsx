import { useNavigate } from 'react-router-dom'
import Button from '../atoms/Button'

const PORTRAIT = '/brand/yr/acyr-01.jpg'

export default function DesignerVision() {
  const navigate = useNavigate()
  return (
    <section className="bg-surface-primary grid grid-cols-1 md:grid-cols-10 md:h-screen">
      <div className="bg-surface-secondary overflow-hidden relative h-[55vh] md:h-full md:col-start-1 md:col-span-6">
        <img
          src={PORTRAIT}
          alt="Designer"
          className="w-full h-full object-cover object-top block"
        />
      </div>

      <div className="flex flex-col justify-center px-16 py-20 gap-6 md:col-start-8 md:col-span-2 md:row-start-1 md:px-0">
        <p className="site-eyebrow-section">The Designer</p>
        <h2 className="site-title-section uppercase" style={{ marginBottom: 16 }}>Designer's<br />Vision</h2>
        <p className="site-subline-hero">
          From a studio in Reykjavík, each piece is cut by hand in small
          numbers. No seasons, no overproduction — clothing made for the
          independent woman, built to be kept.
        </p>
        <div className="mt-2">
          <Button size="lg" variant="secondary" onClick={() => navigate('/about')}>Our Story</Button>
        </div>
      </div>
    </section>
  )
}
