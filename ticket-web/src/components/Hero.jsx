import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import { MapPin, Calendar, Flame, Hourglass, ArrowRight, ChevronLeft, ChevronRight, Crown } from "lucide-react"

function Hero() {
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState(0)
  const autoRotateRef = useRef(null)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snap) => {
      const events = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      const heroes = events.filter((e) => e.isHero === true).slice(0, 4)
      setFeaturedEvents(heroes)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  const startAutoRotation = () => {
    stopAutoRotation()
    if (featuredEvents.length > 1) {
      autoRotateRef.current = setInterval(() => {
        paginate(1)
      }, 5000)
    }
  }

  const stopAutoRotation = () => {
    if (autoRotateRef.current) clearInterval(autoRotateRef.current)
  }

  useEffect(() => {
    startAutoRotation()
    return () => stopAutoRotation()
  }, [featuredEvents, currentIndex])

  const paginate = (newDirection) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection
      if (nextIndex >= featuredEvents.length) return 0
      if (nextIndex < 0) return featuredEvents.length - 1
      return nextIndex
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x)
    if (swipe < -swipeConfidenceThreshold) paginate(1)
    else if (swipe > swipeConfidenceThreshold) paginate(-1)
  }

  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (section) {
      const offset = 90
      const top = section.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#050816]">
        <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-purple-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </section>
    )
  }

  const activeEvent = featuredEvents.length > 0 ? featuredEvents[currentIndex] : null

  let priceDisplay = "Free entry"
  if (activeEvent) {
    const startingPrice = Math.min(
      activeEvent.pricing?.standard ?? Infinity,
      activeEvent.pricing?.vip ?? Infinity,
      activeEvent.pricing?.vvip ?? Infinity
    )
    priceDisplay = startingPrice === Infinity ? "Free entry" : `From $${startingPrice}`
  }

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 280 : -280, scale: 0.85, opacity: 0, rotateY: dir > 0 ? 35 : -35 }),
    center: { x: 0, scale: 1, opacity: 1, rotateY: 0, zIndex: 10, transition: { duration: 0.8, ease: "easeOut" } },
    exit: (dir) => ({ x: dir > 0 ? -280 : 280, scale: 0.85, opacity: 0, rotateY: dir > 0 ? -35 : 35, zIndex: 0, transition: { duration: 0.8, ease: "easeIn" } })
  }

  // 🎠 3D LAYER (ADDED ONLY — DOES NOT REPLACE ANY LOGIC)
  const get3DStyle = (index) => {
    const offset = index - currentIndex

    const base = {
      position: "absolute",
      width: "100%",
      transition: "all 0.6s ease",
      transformStyle: "preserve-3d"
    }

    if (offset === 0) {
      return {
        ...base,
        transform: "translateX(0px) scale(1) rotateY(0deg)",
        opacity: 1,
        zIndex: 10
      }
    }

    if (offset === -1) {
      return {
        ...base,
        transform: "translateX(-180px) scale(0.85) rotateY(35deg)",
        opacity: 0.45,
        zIndex: 5
      }
    }

    if (offset === 1) {
      return {
        ...base,
        transform: "translateX(180px) scale(0.85) rotateY(-35deg)",
        opacity: 0.45,
        zIndex: 5
      }
    }

    return {
      ...base,
      transform: `translateX(${offset * 220}px) scale(0.7)`,
      opacity: 0,
      zIndex: 0
    }
  }

  return (
    <section className="min-h-[90vh] pt-28 md:pt-36 pb-16 flex items-center justify-center relative overflow-hidden bg-[#050816] font-sans perspective-1000">

      <div className="absolute w-[600px] h-[600px] bg-purple-600/15 blur-[140px] rounded-full top-[-100px] left-[-150px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full bottom-[-50px] right-[-100px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">

        {/* LEFT SIDE (UNCHANGED) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:col-span-6 space-y-6 text-left"
        >
          {featuredEvents.length > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-[3px] mt-[1px]">
                Spotlight Deck
              </p>
            </div>
          )}

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
            Discover & <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Secure
            </span> Live Tickets
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed">
            Take your pick from premium concerts, tech meetups, and nightlife listings.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => scrollToSection("events")}
              className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold transition duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.1)] flex items-center gap-2"
            >
              Explore Deck <ArrowRight size={16} />
            </button>

            {featuredEvents.length > 1 && (
              <div className="flex gap-2">
                <button onClick={() => { stopAutoRotation(); paginate(-1); }} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/5 text-white">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => { stopAutoRotation(); paginate(1); }} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/5 text-white">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* RIGHT SIDE (YOUR ORIGINAL + 3D WRAPPER ADDED) */}
        <div className="md:col-span-6 w-full relative flex justify-center items-center h-[560px] sm:h-[600px] perspective-[1200px]">

          {featuredEvents.length === 0 ? (
            <div className="w-full max-w-[420px] h-[400px] bg-white/[0.01] border border-white/5 rounded-[40px] flex flex-col items-center justify-center text-gray-500 backdrop-blur-xl shadow-2xl">
              <Crown size={24} />
              <p>No Active Showcases</p>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-[42px] blur-2xl opacity-40 pointer-events-none" />

              <div className="relative w-full max-w-[420px] h-full flex items-center">

                {/* 🎠 3D LAYER WRAP (ONLY ADDITION) */}
                {featuredEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    style={get3DStyle(i)}
                    onDragEnd={handleDragEnd}
                    className="absolute w-full"
                  >
                    <motion.div
                      key={event.id + "-inner"}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={1}
                      onMouseEnter={stopAutoRotation}
                      onMouseLeave={startAutoRotation}
                      className="w-full bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[40px] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.6)] cursor-grab"
                    >

                      {/* ALL YOUR ORIGINAL CONTENT BELOW (UNCHANGED) */}
                      <div className="relative rounded-[28px] overflow-hidden aspect-[4/5] sm:h-[380px] w-full bg-black/40 shadow-inner">
                        <img src={event.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        <div className="absolute bottom-5 left-5 right-5 space-y-1.5">
                          <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
                            {event.category}
                          </span>
                          <h2 className="text-2xl font-bold text-white">
                            {event.title}
                          </h2>
                        </div>
                      </div>

                      {/* META (UNCHANGED FULL BLOCK) */}
                      <div className="mt-5 space-y-4 pointer-events-none">
                        <div className="flex items-center gap-2.5 text-gray-300">
                          <MapPin size={16} />
                          {event.location} • {event.venue}
                        </div>

                        {event.date && (
                          <div className="flex items-center gap-2.5 text-gray-400 text-xs">
                            <Calendar size={16} />
                            {event.date} {event.time ? `at ${event.time}` : ""}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-3">
                        <div>
                          <p className="text-xs text-gray-400">Pass Admission</p>
                          <p className="text-white font-bold">{priceDisplay}</p>
                        </div>

                        {/* GET TICKETS (UNCHANGED) */}
                        <button
                          onClick={() => scrollToSection("events")}
                          className="bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-xl text-white font-bold"
                        >
                          Get Tickets
                        </button>
                      </div>

                    </motion.div>
                  </motion.div>
                ))}

              </div>
            </>
          )}

        </div>
      </div>
    </section>
  )
}

export default Hero