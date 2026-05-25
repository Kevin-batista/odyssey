import { useEffect } from "react"
import BackgroundGlow from "./BackgroundGlow"

function FooterContentPage({ title, children }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [title])

  return (
    // ⚡ Stripped out Navbar and Footer so it opens as a pure, clean independent window
    <div className="bg-[#050816] text-white min-h-screen flex flex-col relative overflow-x-hidden">
      <BackgroundGlow />

      <main className="flex-grow max-w-3xl mx-auto px-6 py-20 w-full relative z-10">
        <button 
          onClick={() => window.close()} // ⚡ Closes the current tab cleanly to go back to the app
          className="text-xs text-purple-400 hover:text-purple-300 font-mono mb-6 inline-flex items-center gap-1 group transition"
        >
          ← Close Window
        </button>
        
        <h1 className="text-3xl font-extrabold tracking-tight mb-6 text-white border-b border-white/10 pb-4">
          {title}
        </h1>

        <div className="prose prose-invert text-gray-400 text-sm space-y-6 leading-relaxed max-w-none">
          {children}
        </div>
      </main>
    </div>
  )
}

export default FooterContentPage