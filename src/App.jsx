import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ScrollProgressBar, BackToTop } from './components/ScrollUtils'
import { PageLoader } from './components/PageLoader'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Activities = lazy(() => import('./pages/Activities'))
const Governance = lazy(() => import('./pages/Governance'))
const News = lazy(() => import('./pages/News'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Videos = lazy(() => import('./pages/Videos'))
const Contact = lazy(() => import('./pages/Contact'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollProgressBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
        <Route path="/admin/dashboard" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />

        {/* Public Routes */}
        <Route
          path="*"
          element={
            <Layout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/qui-sommes-nous" element={<About />} />
                  <Route path="/activites" element={<Activities />} />
                  <Route path="/organisation" element={<Governance />} />
                  <Route path="/actualites" element={<News />} />
                  <Route path="/galerie" element={<Gallery />} />
                  <Route path="/videotheque" element={<Videos />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </Suspense>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
