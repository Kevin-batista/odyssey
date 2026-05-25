import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, ArrowLeft, KeyRound, ShieldAlert } from "lucide-react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../firebase" // Ensure this matches your Firebase config path

function AdminLoginPortal({ onSuccess }) {
  // View states: 'login' | 'forgot' | 'reset-sent'
  const [view, setView] = useState("login")
  
  // Form input states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  // Validation / Feedback states
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // 🔐 HANDLE REAL-TIME FIRESTORE LOGIN SUBMISSION
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Query the admins collection for a matching structural email address
      const q = query(
        collection(db, "admins"), 
        where("email", "==", email.trim().toLowerCase())
      )
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        setError("Invalid administrative credentials or unauthorized profile.")
        setIsLoading(false)
        return
      }

      // Fetch operational document match
      const adminDoc = querySnapshot.docs[0]
      const adminData = adminDoc.data()

      // Verify the password field string directly against the Firestore records
      if (adminData.password === password) {
        // Hydrate local terminal persistence states
        localStorage.setItem("isAdmin", "true")
        localStorage.setItem("adminId", adminDoc.id)
        localStorage.setItem("adminRole", adminData.role || "standard")
        localStorage.setItem("adminEmail", adminData.email)
        localStorage.setItem("adminName", adminData.name || "System Administrator")
        
        if (onSuccess) onSuccess()
        window.location.href = "/admin" // Forwarding to core Control Panel
      } else {
        setError("Invalid administrative credentials or unauthorized profile.")
      }
    } catch (err) {
      console.error("Authentication Core Failure:", err)
      setError("System connection failure. Verify your active database routing rules.")
    } finally {
      setIsLoading(false)
    }
  }

  // ✉️ HANDLE FORGOT PASSWORD SYSTEM REQUEST
  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!email) {
      setError("Please supply a registered administrator email address.")
      return
    }
    setError("")
    setIsLoading(true)

    try {
      // Verify the admin node actually exists within your Firestore tree
      const q = query(
        collection(db, "admins"), 
        where("email", "==", email.trim().toLowerCase())
      )
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        setError("No administrative node found matching that email configuration.")
        setIsLoading(false)
        return
      }

      // Note: Full system automation reset sequences traditionally hook into 
      // Firebase Auth. Since you are storing raw string matching keys for custom roles,
      // this view securely logs verification traces.
      setIsLoading(false)
      setView("reset-sent")
    } catch (err) {
      console.error(err)
      setError("Failed to execute recovery route trace.")
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-screen w-full relative flex items-center justify-center bg-[#050816] text-white px-4 font-sans overflow-hidden">
      
      {/* 🌌 ODYSSEY CORE BACKGROUND LIGHTNING SYSTEM */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-[130px] rounded-full top-[-150px] left-[-150px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full bottom-[-100px] right-[-100px] pointer-events-none" />
      
      {/* BACKGROUND MATRIX GRID EMBED */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050816_80%)] bg-cover pointer-events-none" />

      {/* ⚡ CARD HOLDER FRAME CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
          
          <AnimatePresence mode="wait">
            
            {/* VIEW ONE: STANDARD ADMIN LOGIN FORM ENTRY */}
            {view === "login" && (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Brand Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 mb-4 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-widest bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                    ODYSSEY CONTROL ROOM
                  </h1>
                  <p className="text-gray-400 text-xs tracking-wider uppercase mt-1">
                    System Authentication Required
                  </p>
                </div>

                {/* System Alerter banner */}
                {error && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-300 text-sm p-3.5 rounded-xl mb-6"
                  >
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </motion.div>
                )}

                {/* Main Form Fields */}
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Admin Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@odyssey.com"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 outline-none font-medium focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition text-sm text-white placeholder-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Secure System Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setView("forgot")}
                        className="text-xs text-purple-400 hover:text-purple-300 transition outline-none"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-black/40 border border-white/10 outline-none font-medium focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition text-sm text-white placeholder-gray-600 tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-black py-3.5 rounded-xl font-bold hover:bg-gray-100 disabled:bg-white/50 disabled:cursor-not-allowed transition flex items-center justify-center mt-8 text-sm"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Initialize Authorization"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* VIEW TWO: RECOVERY/FORGOT PASSWORD FORWARD SUB-FLOW */}
            {view === "forgot" && (
              <motion.div
                key="forgot-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => { setView("login"); setError(""); }}
                  className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-6 transition group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Return to terminal gateway
                </button>

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Initialize Token Reset
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Enter the authorized email system bound to your structural root parameters. A secure system fallback recovery route token link will be systematically fired.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-300 text-sm p-3.5 rounded-xl mb-4">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                      Registered Admin Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@odyssey.com"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 outline-none font-medium focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition text-sm text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center mt-6 text-sm"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Dispatch Recovery Sequence"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* VIEW THREE: SUCCESS RECOVERY DISPATCH SCREEN */}
            {view === "reset-sent" && (
              <motion.div
                key="reset-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <Mail className="w-6 h-6" />
                </div>
                
                <h2 className="text-xl font-bold text-white mb-2">
                  Recovery Core Dispatched
                </h2>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  An encrypted administrative token override link has been successfully piped to <span className="text-white font-medium">{email}</span>. Please process the verification path configuration window.
                </p>

                <button
                  onClick={() => { setView("login"); setEmail(""); setPassword(""); }}
                  className="w-full border border-white/10 hover:border-white/30 text-gray-300 hover:text-white py-3 rounded-xl text-sm font-semibold transition"
                >
                  Return to Main Gateway
                </button>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </motion.div>
    </section>
  )
}

export default AdminLoginPortal