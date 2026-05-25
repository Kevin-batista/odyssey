import { useCart } from "../context/CartContext"
import { useState, useRef, useEffect } from "react"
import { X, Trash2 } from "lucide-react"

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart()

  const [open, setOpen] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  const phone = "254706878210"

  const audioRef = useRef(null)

  /* 🎧 click sound */
  const playTick = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "https://www.myinstants.com/media/sounds/mouse-click.mp3"
      )
    }
    audioRef.current.currentTime = 0
    audioRef.current.volume = 0.2
    audioRef.current.play()
  }

  /* 🪐 cursor movement */
  useEffect(() => {
    const move = (e) => {
      setCursor({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      })
    }

    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  /* 💰 GET PRICE (FROM EVENT DATA OR FALLBACK) */
  const getUnitPrice = (item) => {
    // If cart already has resolved price
    if (typeof item.price === "number") return item.price

    // fallback mapping (safe default)
    if (item.type === "VIP") return 0
    if (item.type === "VVIP") return 0
    return 0
  }

  /* 🧮 TOTAL (USD) */
  const total = cart.reduce((sum, item) => {
    const price = getUnitPrice(item)
    return sum + price * item.quantity
  }, 0)

  /* 🧾 BOOKING OBJECT */
  const createBooking = () => {
    return cart.map((item) => {
      const unitPrice = getUnitPrice(item)

      return {
        id: Date.now().toString(),
        eventId: item.id,
        title: item.title,
        location: item.location,
        type: item.type,
        quantity: item.quantity,
        unitPrice,
        total: unitPrice * item.quantity,
        currency: "USD",
        status: "pending",
        createdAt: new Date().toISOString(),
      }
    })
  }

  /* 🚀 CHECKOUT */
  const sendToWhatsApp = () => {
    playTick()

    const bookings = createBooking()

    const message = `
🎟️ FINAL ORDER

${bookings
  .map(
    (b, i) =>
      `${i + 1}. ${b.title} — ${b.type} x${b.quantity} = $${b.total}`
  )
  .join("\n")}

💰 TOTAL: $${total}

Status: Pending confirmation
    `

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    )
  }

  return (
    <>
      {/* 🛒 FLOATING CART */}
      <div
        onClick={() => {
          setOpen(true)
          playTick()
        }}
        className="fixed bottom-6 right-6 z-[9999] cursor-pointer"
        style={{
          transform: `translate(${cursor.x}px, ${cursor.y}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <div className="px-5 py-3 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20">
          <span className="text-white font-semibold">
            🛒 {cart.length}
          </span>
        </div>
      </div>

      {/* 🌊 PANEL */}
      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-2xl flex justify-end">

          <div
            className="w-full max-w-md h-full bg-white/5 border-l border-white/10 p-5 overflow-y-auto"
            style={{
              transform: `perspective(1200px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              transition: "transform 0.2s ease-out",
            }}
            onMouseMove={(e) => {
              const x = (e.clientY / window.innerHeight - 0.5) * -8
              const y = (e.clientX / window.innerWidth - 0.5) * 8
              setTilt({ x: y, y: x })
            }}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          >

            {/* HEADER */}
            <div className="flex justify-between mb-6">
              <h2 className="text-white font-semibold">Cart</h2>
              <button onClick={() => setOpen(false)}>
                <X className="text-white/60" />
              </button>
            </div>

            {/* EMPTY */}
            {cart.length === 0 ? (
              <p className="text-white/40 text-center mt-24">
                No items in cart
              </p>
            ) : (
              <>
                {/* ITEMS */}
                <div className="space-y-3">
                  {cart.map((item) => {
                    const price = getUnitPrice(item)

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="text-white font-medium">
                              {item.title}
                            </p>
                            <p className="text-white/40 text-sm">
                              {item.type} × {item.quantity}
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              removeFromCart(item.id)
                              playTick()
                            }}
                          >
                            <Trash2 size={18} className="text-red-400" />
                          </button>
                        </div>

                        <p className="text-purple-300 mt-2 font-semibold">
                          ${price * item.quantity}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* TOTAL */}
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/40 text-sm">Total</p>
                  <p className="text-white text-2xl font-bold">
                    ${total}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={sendToWhatsApp}
                    className="w-full bg-white text-black py-3 rounded-xl font-semibold"
                  >
                    Checkout 🚀
                  </button>

                  <button
                    onClick={() => {
                      clearCart()
                      playTick()
                    }}
                    className="w-full bg-white/5 border border-white/10 text-white py-2 rounded-xl"
                  >
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Cart