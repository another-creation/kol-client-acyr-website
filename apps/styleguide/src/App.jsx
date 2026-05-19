import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/framework/Layout'
import BrandLayout from './components/framework/BrandLayout'
import Landing from './pages/Landing'
import Styleguide from './pages/Styleguide'
import Reference from './pages/Reference'
import Acyr from './pages/Acyr'
import Gallery from './pages/Gallery'
import Demo from './pages/Demo'
import NotFound from './pages/NotFound'
import Editor from './editor/Editor'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<BrandLayout />}>
          <Route path="/"           element={<Landing />} />
          <Route path="/styleguide" element={<Styleguide />} />
          <Route path="/reference"  element={<Reference />} />
          <Route path="/acyr"       element={<Acyr />} />
          <Route path="/gallery"    element={<Gallery />} />
          <Route path="/demo"       element={<Demo />} />

          <Route path="/editor/:mode" element={<Editor />} />
          <Route path="/editor"       element={<Navigate to="/editor/compose" replace />} />

          {/* Legacy redirects into the unified editor — preserved for backward compat. */}
          <Route path="/generators"             element={<Navigate to="/editor/compose" replace />} />
          <Route path="/generators/combo-lab"   element={<Navigate to="/editor/palette" replace />} />
          <Route path="/generators/pattern-lab" element={<Navigate to="/editor/pattern" replace />} />
          <Route path="/generators/type-lab"    element={<Navigate to="/editor/type"    replace />} />
          <Route path="/compose"                element={<Navigate to="/editor/compose" replace />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
