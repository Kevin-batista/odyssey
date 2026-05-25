import { X } from "lucide-react"
import { useState } from "react"
import { useCart } from "../context/CartContext"

function EventModal({ event, onClose }) {
  if (!event) return null

  const { addToCart } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [selectedType, setSelectedType] = useState("Standard")
  const [confirmOpen, setConfirmOpen] = useState(false)

  const prices = {
    Standard: event.pricing?.standard || 0,
    VIP: event.pricing?.vip || 0,
    VVIP: event.pricing?.vvip || 0,
  }

  const currentUnitPrice = prices[selectedType]
  const total = currentUnitPrice * quantity

  const handleAddToCart = () => {
    addToCart({
      id: `${event.id}-${selectedType}`,
      title: event.title,
      location: event.location,
      type: selectedType,
      quantity,
      price: total,
      unitPrice: currentUnitPrice
    })

    setConfirmOpen(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 text-white"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-[2rem] bg-[#0b0f2a]/95 backdrop-blur-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] overflow-hidden max-h-[88vh] flex flex-col transition-all duration-300"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-52 h-52 bg-cyan-500/10 blur-[100px] rounded-full" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/40 backdrop-blur-xl hover:bg-white/15 p-2.5 rounded-full text-white transition z-20 border border-white/10"
        >
          <X size={16} />
        </button>

        <div className="relative shrink-0 overflow-hidden">
          <img
            src={
              event.image ||
              "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200"
            }
            className="h-52 w-full object-cover object-center transition duration-700 hover:scale-105"
            alt={event.title}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200"
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f2a] via-[#0b0f2a]/30 to-transparent" />

          <div className="absolute top-4 left-4">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] text-purple-200 font-semibold">
              {event.category || "music"}
            </div>
          </div>

          <div className="absolute bottom-5 left-5 right-5">
            <h2 className="text-2xl font-black tracking-tight leading-tight text-white drop-shadow-xl">
              {event.title}
            </h2>

            <p className="text-xs text-gray-300 mt-1">
              {event.location} {event.venue && `• ${event.venue}`}
            </p>
          </div>
        </div>

        <div className="relative p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">


          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.05] backdrop-blur-xl p-4 rounded-2xl border border-white/5">
              <span className="text-gray-400 text-[11px] block mb-1 uppercase tracking-wide">
                Selection
              </span>

              <span className="font-bold text-white text-sm">
                {selectedType} × {quantity}
              </span>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-xl p-4 rounded-2xl border border-white/5">
              <span className="text-gray-400 text-[11px] block mb-1 uppercase tracking-wide">
                Total Amount
              </span>

              <span className="text-purple-400 font-black text-lg">
                ${total}
              </span>
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-3 bg-black/30 px-3 py-2 rounded-2xl border border-white/10 shadow-inner">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 transition flex items-center justify-center text-lg font-bold"
              >
                -
              </button>

              <span className="font-mono font-black w-5 text-center text-sm">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 transition flex items-center justify-center text-lg font-bold"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-400 block uppercase tracking-wide">
                Ticket Rate
              </span>

              <span className="text-sm font-bold text-yellow-300">
                ${currentUnitPrice} each
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block pl-1">
              Select Ticket Tier
            </label>

            <div className="grid grid-cols-3 gap-2">
              {["Standard", "VIP", "VVIP"].map((type) => {
                const tierPrice = prices[type]

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`relative overflow-hidden py-3 rounded-2xl font-bold transition-all duration-300 flex flex-col items-center justify-center border ${
                      selectedType === type
                        ? "bg-white text-black border-white scale-[1.03] shadow-lg"
                        : "bg-white/[0.04] text-gray-300 border-white/5 hover:border-white/15 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="text-xs z-10">{type}</span>

                    <span
                      className={`text-[10px] font-mono mt-1 z-10 ${
                        selectedType === type
                          ? "text-purple-700"
                          : "text-gray-400"
                      }`}
                    >
                      ${tierPrice}
                    </span>

                    {selectedType === type && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-40" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
              Event Experience
            </p>

            <p className="text-sm text-gray-300 leading-relaxed">
              Secure your access and step into an unforgettable atmosphere filled with energy, lights, music, and premium vibes.
            </p>
          </div>
        </div>

        <div className="relative p-5 pt-4 shrink-0 border-t border-white/5 bg-[#0b0f2a]/70 backdrop-blur-xl">
          <button
            onClick={() => setConfirmOpen(true)}
            className="w-full bg-white text-black py-3 rounded-2xl font-black text-sm hover:scale-[1.01] active:scale-95 transition-all duration-300 shadow-xl"
          >
            Send to Cart 🛒
          </button>
        </div>
      </div>

      {confirmOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-30 p-4">
          <div className="relative bg-[#0b0f2a]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 w-full max-w-sm text-center space-y-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden">

            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/10 blur-[90px] rounded-full pointer-events-none" />

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-2xl">
                🛒
              </div>

              <h3 className="text-lg font-black text-white">
                Add to Cart?
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Review your ticket selection below
              </p>
            </div>

            <div className="relative space-y-1 text-xs bg-white/[0.04] p-4 rounded-2xl border border-white/5 text-gray-300">
              <p className="font-bold text-white text-sm mb-2 line-clamp-1">
                {event.title}
              </p>

              <p>{selectedType} Tier</p>

              <p>Quantity: {quantity}</p>

              <p className="text-purple-400 font-black text-lg mt-3 border-t border-white/5 pt-3">
                Total: ${total}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 bg-white/[0.05] text-gray-300 hover:bg-white/[0.08] border border-white/10 py-3 rounded-2xl text-xs transition font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white text-black hover:bg-gray-200 py-3 rounded-2xl text-xs font-black transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventModal