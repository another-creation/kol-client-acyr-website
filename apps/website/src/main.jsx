import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// Reveal body once React has rendered + fonts are loaded. 400ms cap so a slow
// font fetch can't hang the reveal forever — beyond that we'd rather show the
// fallback than keep the page blank.
const reveal = () => document.body.classList.add('is-ready')
const fontsReady = (document.fonts && document.fonts.ready) || Promise.resolve()
Promise.race([
  fontsReady,
  new Promise((r) => setTimeout(r, 400)),
]).then(() => requestAnimationFrame(reveal))
