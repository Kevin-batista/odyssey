import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Events from "./components/Events"
import FeaturedSlider from "./components/FeaturedSlider"
import BackgroundGlow from "./components/BackgroundGlow"
import Bookings from "./components/Bookings"
import Cart from "./components/Cart"
import AdminPanel from "./components/AdminPanel"
import AdminLoginPortal from "./components/AdminLoginPortal"
import Footer from "./components/Footer"
import FooterContentPage from "./components/FooterContentPage"

const BASE = "/odyssey"

function App() {
  const currentPath = window.location.pathname
  const isAdminRoute = currentPath === `${BASE}/admin`
  const isAdminLoginRoute = currentPath === `${BASE}/admin-login`
  const isAdmin = localStorage.getItem("isAdmin") === "true"

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        {isAdmin ? (
          <AdminPanel />
        ) : (
          // ✅ FIXED: setTimeout inside JSX return is wrong — use proper redirect
          <RedirectTo path={`${BASE}/admin-login`} />
        )}
      </div>
    )
  }

  if (isAdminLoginRoute) {
    return (
      <AdminLoginPortal onSuccess={() => {
        localStorage.setItem("isAdmin", "true")
      }} />
    )
  }

  if (currentPath === `${BASE}/privacy-policy`) {
    return (
      <FooterContentPage title="Privacy Policy">
        <p className="text-white font-medium">Last Updated: May 2026</p>
        <p>At Odyssey, your data privacy is paramount. We only collect details essential to securing your event tickets and processing seamless payments via secure gateways.</p>
        <h3 className="text-lg font-bold text-white mt-4">Data Protection</h3>
        <p>We do not lease, trade, or distribute your email addresses or payment data to unauthorized third-party platforms. All transaction logs remain encrypted under high-standard security profiles.</p>
      </FooterContentPage>
    )
  }

  if (currentPath === `${BASE}/terms-of-use`) {
    return (
      <FooterContentPage title="Terms of Use">
        <p>Welcome to Odyssey. By accessing our platform or purchasing tickets, you agree to comply directly with our operational protocols and ticketing integrity guidelines.</p>
        <h3 className="text-lg font-bold text-white mt-4">Ticketing Terms</h3>
        <p>All listings posted through the Odyssey admin interface are verified options. Duplicated or counterfeited barcodes generated off-platform are strictly invalid at the entry gates.</p>
      </FooterContentPage>
    )
  }

  if (currentPath === `${BASE}/refund-policy`) {
    return (
      <FooterContentPage title="Refund & Ticket Policy">
        <p>Our ticketing policies are strictly dependent on organizer parameters. If an event is permanently cancelled, refunds are initiated automatically back to the original funding option within 5-7 working days.</p>
      </FooterContentPage>
    )
  }

  return (
    <div className="bg-[#050816] text-white overflow-x-hidden relative flex flex-col min-h-screen">
      <BackgroundGlow />
      <Navbar />

      <main className="flex-grow">
        <section id="home"><Hero /></section>
        <section id="featured"><FeaturedSlider /></section>
        <section id="events"><Events /></section>
        <section id="bookings"><Bookings /></section>
        <Cart />

        <section id="contact" className="py-20 px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Connect & Book</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-10">
            Reach us instantly or follow us for updates, events, and exclusive drops.
          </p>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <a href="https://wa.me/254706878210" className="bg-green-500 text-black py-3 rounded-xl font-bold hover:bg-green-600 transition flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M20.52 3.48A11.88 11.88 0 0012.03.12 11.92 11.92 0 00.6 11.82c0 2.1.55 4.15 1.6 5.95L.12 23l5.3-1.39A11.87 11.87 0 0012.03 24c6.58 0 11.95-5.33 11.95-11.95 0-3.2-1.25-6.2-3.46-8.57zM12.03 21.6c-1.6 0-3.17-.42-4.53-1.22l-.32-.19-3.15.83.84-3.07-.21-.33A9.46 9.46 0 012.6 11.82 9.43 9.43 0 1112.03 21.6zM17.2 14.36c-.27-.14-1.59-.78-1.83-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.72-1.34-1.61-1.5-1.88-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.26 0 1.33.98 2.62 1.12 2.8.14.18 1.93 2.98 4.67 4.17 2.74 1.19 3.16.98 3.73.92.57-.06 1.85-.75 2.11-1.48.27-.73.27-1.36.19-1.48-.08-.12-.25-.18-.52-.32z" />
              </svg>
              <span className="text-black">WhatsApp</span>
            </a>
            <a href="#" className="bg-black border border-white/20 py-3 rounded-xl hover:bg-white/5 transition flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.26 4.26 0 001.88-2.35 8.52 8.52 0 01-2.7 1.03 4.24 4.24 0 00-7.23 3.86A12.04 12.04 0 013 4.79a4.24 4.24 0 001.31 5.66 4.18 4.18 0 01-1.92-.53v.05a4.24 4.24 0 003.4 4.16c-.48.13-.99.2-1.52.2-.37 0-.73-.04-1.08-.1a4.25 4.25 0 003.96 2.95A8.5 8.5 0 012 19.54a12 12 0 006.49 1.9c7.79 0 12.06-6.45 12.06-12.04 0-.18-.01-.36-.02-.54A8.6 8.6 0 0024 6.56a8.36 8.36 0 01-2.54.7z" />
              </svg>
              <span className="text-white">Twitter / X</span>
            </a>
            <a href="#" className="bg-blue-600 py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07C1.86 17.03 5.66 21.14 10.3 21.93v-6.99H8.08v-2.87h2.22V9.41c0-2.2 1.31-3.41 3.31-3.41.96 0 1.96.17 1.96.17v2.15h-1.1c-1.09 0-1.43.68-1.43 1.37v1.66h2.44l-.39 2.87h-2.05v6.99c4.64-.79 8.44-4.9 8.44-9.86z" />
              </svg>
              <span className="text-white">Facebook</span>
            </a>
            <a href="https://instagram.com/yourhandle" className="bg-pink-500 hover:bg-pink-600 py-3 rounded-xl transition flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 3.5A4.5 4.5 0 1016.5 10 4.5 4.5 0 0012 5.5zM18.5 6.2a1.2 1.2 0 11-1.2 1.2 1.2 1.2 0 011.2-1.2z" />
              </svg>
              <span className="text-white">Instagram</span>
            </a>
          </div>
        </section>

        <section id="about" className="py-20 px-6 text-center border-t border-white/10">
          <h2 className="text-3xl font-bold mb-4">
            About Odyssey
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Odyssey is a modern ticketing and access platform built to connect people with live experiences across sports, music, festivals, and cultural events.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}

// ✅ Clean redirect component — replaces the broken setTimeout-in-JSX pattern
function RedirectTo({ path }) {
  window.location.replace(path)
  return null
}

export default App
