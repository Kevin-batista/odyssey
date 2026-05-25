import { useState, useMemo, useEffect } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import { motion, AnimatePresence } from "framer-motion"
import EventModal from "./EventModal"
import FeaturedSlider from "./FeaturedSlider"

function Events() {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const categories = ["all", "music", "tech", "comedy", "night"]

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snap) => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setEvents(data)
    })

    return () => unsub()
  }, [])

  const sortedEvents = useMemo(() => {
    const heroes = events.filter(e => e.isHero)
    const normal = events.filter(e => !e.isHero)

    const sortByDate = (a, b) => {
      const ta = a.createdAt?.seconds || 0
      const tb = b.createdAt?.seconds || 0
      return tb - ta
    }

    const heroSorted = [...heroes].sort(sortByDate)
    const normalSorted = [...normal].sort(sortByDate)

    return [...heroSorted, ...normalSorted]
  }, [events])

  const filteredEvents = useMemo(() => {
    return sortedEvents.filter((event) => {
      const status = (event.status || "live").toLowerCase().trim()
      const isLive = status === "live"

      const matchesSearch =
        (event.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (event.location || "").toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        category === "all" ||
        (event.category || "").toLowerCase().trim() === category

      return isLive && matchesSearch && matchesCategory
    })
  }, [sortedEvents, search, category])

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [search, category])

  return (
    <motion.section
      id="events"
      className="relative py-16 px-6 max-w-7xl mx-auto"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
            Featured Events
          </h2>

          <FeaturedSlider
            events={events}
            onSelect={setSelectedEvent}
          />

          <div className="relative w-full md:w-1/2 mx-auto mt-8">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full px-5 py-4 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 text-white outline-none focus:border-purple-400/40 focus:bg-white/[0.08] transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.03)]"
            />

            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 pointer-events-none" />
          </div>

          <div className="flex gap-3 justify-center flex-wrap mt-6">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-5 py-2.5 rounded-full border text-sm font-semibold capitalize transition-all duration-300 backdrop-blur-xl ${
                  category === item
                    ? "bg-white text-black border-white shadow-lg shadow-white/10 scale-105"
                    : "bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/[0.06]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        layout
        className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 auto-rows-max items-start"
      >
        <AnimatePresence mode="popLayout">
          {paginatedEvents.length > 0 ? (
            paginatedEvents.map((event, index) => {

              const pricing = event.pricing || {}

              const startingPrice = Math.min(
                pricing.standard ?? Infinity,
                pricing.vip ?? Infinity,
                pricing.vvip ?? Infinity
              )

              const safePrice =
                startingPrice === Infinity ? 0 : startingPrice

              const formattedDate = event.date
                ? new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                  })
                : null

              const dateTimeLabel =
                formattedDate && event.time
                  ? `${formattedDate} • ${event.time}`
                  : formattedDate || event.time || "TBA"

              const badge = event.isHero
                ? "🌌 Featured Experience"
                : index % 3 === 0
                ? "💰 Deals Available"
                : "🔥 Limited tickets left"

              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 28
                  }}
                  whileHover={{
                    y: -6
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] hover:border-white/20 transition-all duration-500 cursor-pointer flex flex-col justify-between h-full"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />

                  <div>
                    <div className="relative h-28 md:h-36 overflow-hidden bg-black rounded-t-3xl">
                      <img
                        src={
                          event.image ||
                          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200"
                        }
                        alt={event.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200"
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div
                        className="absolute left-0 right-0 bottom-0 h-8 pointer-events-none"
                        style={{
                          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.05) 100%)"
                        }}
                      />

                      <div className="absolute top-4 right-4">
                        <span className="text-[10px] bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full font-mono uppercase tracking-[0.2em] text-purple-200">
                          {event.category || "music"}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4">
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl">
                          <p className="text-xs text-gray-300">
                            {dateTimeLabel}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 space-y-2">
                      <div className="text-xs text-yellow-300 font-semibold tracking-wide">
                        {badge}
                      </div>

                      <h3 className="text-base font-extrabold text-white leading-tight line-clamp-1">
                        {event.title}
                      </h3>

                      <p className="text-gray-300 text-sm line-clamp-1">
                        {event.location}
                      </p>

                      <p className="text-xs text-gray-500 line-clamp-1">
                        🎪 {event.venue || "Venue not specified"}
                      </p>

                      <div className="mt-2 rounded-2xl bg-black/20 border border-white/5 p-1">
                        <p className="text-[10px] text-gray-400">
                          Standard $
                          <span className="text-white font-semibold">
                            {pricing.standard || 0}
                          </span>

                          <span className="mx-2 text-gray-600">•</span>

                          VIP $
                          <span className="text-white font-semibold">
                            {pricing.vip || 0}
                          </span>

                          <span className="mx-2 text-gray-600">•</span>

                          VVIP $
                          <span className="text-white font-semibold">
                            {pricing.vvip || 0}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 pt-0">
                    <button className="relative overflow-hidden w-full bg-white text-black py-2 rounded-2xl font-bold transition-all duration-300 hover:bg-gray-200 active:scale-[0.98] shadow-lg">
                      <span className="relative z-10">
                        Starting from ${safePrice}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full"
            >
              <div className="text-center text-gray-400 py-20 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[2rem] border-dashed">
                <div className="text-5xl mb-4">🎭</div>

                <p className="text-lg font-medium">
                  No live events under this category yet
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  The stage is quiet... for now.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-16 flex items-center justify-center gap-4 flex-wrap"
        >
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/10 text-white font-semibold transition-all duration-300 hover:bg-white/[0.1] hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/[0.06] disabled:hover:border-white/10"
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                  currentPage === page
                    ? "bg-white text-black shadow-lg shadow-white/20"
                    : "bg-white/[0.06] border border-white/10 text-white hover:bg-white/[0.1] hover:border-white/20"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-3 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/10 text-white font-semibold transition-all duration-300 hover:bg-white/[0.1] hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/[0.06] disabled:hover:border-white/10"
          >
            Next →
          </button>

          <div className="w-full text-center mt-4 text-sm text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length} events
          </div>
        </motion.div>
      )}

      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </motion.section>
  )
}

export default Events