import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { CartProvider } from "./context/CartContext"
import { EventProvider } from "./context/EventContext"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EventProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </EventProvider>
  </StrictMode>
)