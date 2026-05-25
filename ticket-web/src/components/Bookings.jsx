function HowItWorks() {
  return (
    <section className="py-20 px-6 text-center max-w-4xl mx-auto">

      <h2 className="text-3xl font-bold mb-6">
        How Booking Works
      </h2>

      <div className="grid md:grid-cols-3 gap-6 text-left">

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-bold mb-2">1. Choose Event</h3>
          <p className="text-gray-400 text-sm">
            Browse concerts, nightlife, and VIP experiences.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-bold mb-2">2. Select Ticket</h3>
          <p className="text-gray-400 text-sm">
            Pick Standard, VIP, or VVIP and quantity.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-bold mb-2">3. Confirm on WhatsApp</h3>
          <p className="text-gray-400 text-sm">
            We finalize your booking instantly via chat.
          </p>
        </div>

      </div>

    </section>
  )
}

export default HowItWorks