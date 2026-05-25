import { useEffect, useState } from "react"
import { Menu, X, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const BASE = "/odyssey"

function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("home")
  const [scrolled, setScrolled] = useState(false)

  const [clickCount, setClickCount] = useState(0)
  const [clickTimeoutId, setClickTimeoutId] = useState(null)

  const sections = ["home", "featured", "events", "about", "contact"]

  const isAdminRoute =
    window.location.pathname === `${BASE}/admin` ||
    window.location.pathname === `${BASE}/admin-login`

  const scrollToSection = (id) => {
    const section = document.getElementById(id)

    if (section) {
      const offset = 90

      const top =
        section.getBoundingClientRect().top +
        window.scrollY -
        offset

      window.scrollTo({
        top,
        behavior: "smooth",
      })
    }

    setOpen(false)
  }

  useEffect(() => {
    if (isAdminRoute) return

    let ticking = false

    const handleScroll = () => {
      if (ticking) return

      ticking = true

      requestAnimationFrame(() => {
        const scrollPos = window.scrollY + 130

        let current = "home"

        for (const id of sections) {
          const el = document.getElementById(id)

          if (!el) continue

          const top = el.offsetTop
          const bottom = top + el.offsetHeight

          if (scrollPos >= top && scrollPos < bottom) {
            current = id
            break
          }
        }

        setActive(current)

        setScrolled(window.scrollY > 30)

        ticking = false
      })
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    })

    handleScroll()

    return () =>
      window.removeEventListener("scroll", handleScroll)
  }, [isAdminRoute])

  const linkClass = (id) =>
    `relative px-1 py-2 cursor-pointer transition-all duration-300 ${
      active === id
        ? "text-white"
        : "text-gray-400 hover:text-white"
    }`

  const routeToAdminPortal = () => {
    window.location.href = `${BASE}/admin-login`
  }

  const handleLogoClick = () => {
    if (!isAdminRoute) {
      scrollToSection("home")
    }

    if (clickTimeoutId) clearTimeout(clickTimeoutId)

    const nextCount = clickCount + 1

    if (nextCount === 5) {
      setClickCount(0)
      routeToAdminPortal()
    } else {
      setClickCount(nextCount)

      const newTimeout = setTimeout(() => {
        setClickCount(0)
      }, 1000)

      setClickTimeoutId(newTimeout)
    }
  }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 px-3 md:px-5 pt-3"
    >
      <div
        className={`relative max-w-7xl mx-auto transition-all duration-500 rounded-2xl overflow-hidden ${
          scrolled
            ? "bg-black/55 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
            : "bg-black/20 backdrop-blur-xl border border-white/5"
        }`}
      >
        {/* ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-1/4 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 right-1/4 w-40 h-40 bg-cyan-400/10 blur-3xl rounded-full" />
        </div>

        <div className="relative px-6 py-4 flex items-center justify-between">
          {/* 🌌 LOGO */}
          <motion.div
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer select-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            {/* animated orbit */}
            <motion.div
              className="relative w-10 h-10 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 12,
                ease: "linear",
              }}
            >
              <div className="absolute inset-0 rounded-full border border-purple-400/50" />

              <div className="absolute w-2 h-2 bg-cyan-300 rounded-full top-0 shadow-[0_0_10px_#67e8f9]" />

              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-cyan-300 shadow-[0_0_20px_#a855f7]" />
            </motion.div>

            {/* logo text */}
            <div className="leading-tight">
              <motion.h1
                className="text-2xl font-black tracking-[0.25em] bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
                animate={{
                  opacity: [1, 0.92, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                }}
              >
                ODYSSEY
              </motion.h1>

              <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase">
                Experience Beyond
              </p>
            </div>
          </motion.div>

          {/* 🧭 DESKTOP NAV */}
          <ul className="hidden md:flex items-center gap-8 font-medium">
            {sections.map((id) => (
              <li
                key={id}
                className={linkClass(id)}
                onClick={() => scrollToSection(id)}
              >
                <span className="capitalize">
                  {id}
                </span>

                {active === id && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-purple-400 to-cyan-300 rounded-full"
                  />
                )}
              </li>
            ))}
          </ul>

          {/* 🎟️ CTA */}
          <motion.button
            onClick={() => scrollToSection("events")}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.96,
            }}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-white to-gray-200 text-black px-5 py-2.5 rounded-full font-semibold shadow-xl"
          >
            Get Tickets
            <ChevronRight size={18} />
          </motion.button>

          {/* 📱 MOBILE TOGGLE */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(!open)}
            className="md:hidden relative text-white"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* 📱 MOBILE MENU */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="md:hidden overflow-hidden border-t border-white/10"
            >
              <div className="px-6 py-5 bg-black/40 backdrop-blur-2xl">
                {sections.map((id, index) => (
                  <motion.div
                    key={id}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    onClick={() => scrollToSection(id)}
                    className={`flex items-center justify-between py-4 border-b border-white/5 cursor-pointer transition ${
                      active === id
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="capitalize font-medium">
                      {id}
                    </span>

                    {active === id && (
                      <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />
                    )}
                  </motion.div>
                ))}

                {/* mobile cta */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => scrollToSection("events")}
                  className="w-full mt-5 bg-gradient-to-r from-white to-gray-200 text-black py-3 rounded-2xl font-semibold shadow-xl"
                >
                  Get Tickets
                </motion.button>

                {/* hidden portal */}
                <button
                  onClick={routeToAdminPortal}
                  className="w-full mt-4 text-xs text-gray-500 hover:text-white transition text-center tracking-widest uppercase"
                >
                  System Access
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
