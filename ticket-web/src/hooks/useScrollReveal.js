import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

function Navbar() {

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("home")

  const sections = ["home", "featured", "events", "about", "contact"]

  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
    setOpen(false)
  }

  // 👁️ Scroll spy logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200

      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return

        const top = el.offsetTop
        const bottom = top + el.offsetHeight

        if (scrollPos >= top && scrollPos < bottom) {
          setActive(id)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const linkClass = (id) =>
    `cursor-pointer transition ${
      active === id ? "text-white font-bold" : "text-gray-300 hover:text-white"
    }`

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <h1
          onClick={() => scrollToSection("home")}
          className="text-2xl font-bold tracking-wide cursor-pointer"
        >
          Ticket Lounge 🎟️
        </h1>

        {/* DESKTOP */}
        <ul className="hidden md:flex gap-8 font-medium">

          <li className={linkClass("home")} onClick={() => scrollToSection("home")}>
            Home
          </li>

          <li className={linkClass("featured")} onClick={() => scrollToSection("featured")}>
            Featured
          </li>

          <li className={linkClass("events")} onClick={() => scrollToSection("events")}>
            Events
          </li>

          <li className={linkClass("about")} onClick={() => scrollToSection("about")}>
            About
          </li>

          <li className={linkClass("contact")} onClick={() => scrollToSection("contact")}>
            Contact
          </li>

        </ul>

        {/* CTA */}
        <button
          onClick={() => scrollToSection("events")}
          className="hidden md:block bg-white text-black px-5 py-2 rounded-full font-semibold hover:scale-105 transition"
        >
          Get Tickets
        </button>

        {/* MOBILE */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X /> : <Menu />}
        </button>

      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-6 pb-6 bg-black/60 backdrop-blur-md border-t border-white/10">

          {sections.map((id) => (
            <p
              key={id}
              onClick={() => scrollToSection(id)}
              className={`py-2 cursor-pointer ${
                active === id ? "text-white font-bold" : "text-gray-300"
              }`}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </p>
          ))}

        </div>
      )}

    </nav>
  )
}

export default Navbar