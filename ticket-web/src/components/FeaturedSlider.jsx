import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules"
import { motion } from "framer-motion"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"

function FeaturedSlider({ events = [], onSelect }) {

  const featuredEvents = events.filter(
    (e) => e.isHero || e.featured
  )

  return (
    <div className="max-w-5xl mx-auto px-6 mt-8">

      <Swiper
        modules={[Autoplay, Pagination, EffectCoverflow]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop={true}
        effect="coverflow"
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 20,
          stretch: 0,
          depth: 120,
          modifier: 2,
          slideShadows: true
        }}
      >

        {featuredEvents.map((event) => (
          <SwiperSlide key={event.id} className="!w-full md:!w-[70%] lg:!w-[60%]">

            <div
              onClick={() => onSelect(event)}
              className="relative h-[220px] md:h-[300px] lg:h-[340px] rounded-3xl overflow-hidden cursor-pointer group transition-transform duration-500 hover:scale-[1.01]"
            >

              <img
                src={event.image}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay" />

              <div className="absolute top-6 left-6">
                <div className="px-3 py-1 text-xs uppercase tracking-widest bg-white/10 border border-white/20 backdrop-blur-md rounded-full text-white animate-pulse">
                  Featured Event
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute bottom-4 left-4 text-white max-w-md"
              >
                <h2 className="text-xl md:text-2xl font-bold leading-tight">
                  {event.title}
                </h2>

                <p className="text-gray-300 mt-1 text-sm">
                  {event.location}
                </p>

                <p className="mt-1 text-purple-300 font-semibold text-sm">
                  {event.price || "Tickets Available"}
                </p>
              </motion.div>

            </div>

          </SwiperSlide>
        ))}

      </Swiper>

    </div>
  )
}

export default FeaturedSlider