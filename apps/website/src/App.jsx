import { Routes, Route } from 'react-router-dom'
import Layout from './components/framework/Layout'
import NotFound from './pages/NotFound'

import SiteLayout from './components/site/SiteLayout'
import Home from './pages/site/Home'
import Journal from './pages/site/Journal'
import JournalArticle from './pages/site/JournalArticle'
import JournalAuthor from './pages/site/JournalAuthor'
import Collections from './pages/site/Collections'
import CollectionDetail from './pages/site/CollectionDetail'
import Shop from './pages/site/Shop'
import Handmade from './pages/site/Handmade'
import ProductDetail from './pages/site/ProductDetail'
import Contact from './pages/site/Contact'
import About from './pages/site/About'
import Privacy from './pages/site/Privacy'
import Terms from './pages/site/Terms'
import Brand from './pages/site/Brand'
import Press from './pages/site/Press'
import ShippingReturns from './pages/site/ShippingReturns'
import Checkout from './pages/site/Checkout'
import OrderConfirmation from './pages/site/OrderConfirmation'
import LoaderDev from './pages/site/LoaderDev'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<SiteLayout />}>
          <Route path="/"                       element={<Home />} />
          <Route path="/about"                  element={<About />} />
          <Route path="/contact"                element={<Contact />} />
          <Route path="/journal"                element={<Journal />} />
          <Route path="/journal/author/:slug"   element={<JournalAuthor />} />
          <Route path="/journal/:slug"          element={<JournalArticle />} />
          <Route path="/collections"            element={<Collections />} />
          <Route path="/collections/:slug"      element={<CollectionDetail />} />
          <Route path="/shop"                   element={<Shop />} />
          <Route path="/shop/:slug"             element={<ProductDetail />} />
          <Route path="/handmade"               element={<Handmade />} />
          <Route path="/handmade/:slug"         element={<ProductDetail />} />
          <Route path="/privacy"                element={<Privacy />} />
          <Route path="/terms"                  element={<Terms />} />
          <Route path="/brand"                  element={<Brand />} />
          <Route path="/press"                  element={<Press />} />
          <Route path="/shipping-returns"       element={<ShippingReturns />} />
          <Route path="/checkout"               element={<Checkout />} />
          <Route path="/checkout/confirmation"  element={<OrderConfirmation />} />
        </Route>
        <Route path="/loader" element={<LoaderDev />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
