import { Routes, Route } from 'react-router-dom'
import Layout from './components/framework/Layout'
import NotFound from './pages/NotFound'

import SiteLayout from './components/site/SiteLayout'
import Home from './pages/site/Home'
import Blog from './pages/site/Blog'
import BlogArticle from './pages/site/BlogArticle'
import BlogAuthor from './pages/site/BlogAuthor'
import Collections from './pages/site/Collections'
import CollectionDetail from './pages/site/CollectionDetail'
import Shop from './pages/site/Shop'
import Handmade from './pages/site/Handmade'
import ProductDetail from './pages/site/ProductDetail'
import Contact from './pages/site/Contact'
import About from './pages/site/About'
import Privacy from './pages/site/Privacy'
import Terms from './pages/site/Terms'
import ShippingReturns from './pages/site/ShippingReturns'
import Cart from './pages/site/Cart'
import Checkout from './pages/site/Checkout'
import OrderConfirmation from './pages/site/OrderConfirmation'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<SiteLayout />}>
          <Route path="/"                       element={<Home />} />
          <Route path="/about"                  element={<About />} />
          <Route path="/contact"                element={<Contact />} />
          <Route path="/blog"                   element={<Blog />} />
          <Route path="/blog/author/:slug"      element={<BlogAuthor />} />
          <Route path="/blog/:slug"             element={<BlogArticle />} />
          <Route path="/collections"            element={<Collections />} />
          <Route path="/collections/:slug"      element={<CollectionDetail />} />
          <Route path="/shop"                   element={<Shop />} />
          <Route path="/shop/:slug"             element={<ProductDetail />} />
          <Route path="/handmade"               element={<Handmade />} />
          <Route path="/handmade/:slug"         element={<ProductDetail />} />
          <Route path="/privacy"                element={<Privacy />} />
          <Route path="/terms"                  element={<Terms />} />
          <Route path="/shipping-returns"       element={<ShippingReturns />} />
          <Route path="/cart"                   element={<Cart />} />
          <Route path="/checkout"               element={<Checkout />} />
          <Route path="/checkout/confirmation"  element={<OrderConfirmation />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
