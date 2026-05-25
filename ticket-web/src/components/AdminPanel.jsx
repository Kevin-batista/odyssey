import { useEffect, useState } from "react"
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from "firebase/firestore"
import { db } from "../firebase"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Menu, X, LayoutDashboard, KeyRound, UserPlus, 
  LogOut, Eye, EyeOff, Save, CheckCircle2,
  Calendar, MapPin, Tag, Radio, Trash2, Edit, Crown, ShieldAlert, Users, DollarSign
} from "lucide-react"

function AdminPanel() {
  // --- 🧭 NAVIGATION VIEWPANEL STATES ---
  const [currentView, setCurrentView] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // --- 👤 AUTHENTICATED LOCAL SESSION PARAMS ---
  const currentAdminId = localStorage.getItem("adminId") || ""
  const currentAdminRole = localStorage.getItem("adminRole") || "standard"
  const currentAdminEmail = localStorage.getItem("adminEmail") || ""

  // --- 📦 CORE DATABASE STATES ---
  const [events, setEvents] = useState([])
  const [adminNodes, setAdminNodes] = useState([]) // Live directory feed of administrators
  const [editingId, setEditingId] = useState(null)
  
  const [form, setForm] = useState({
    title: "", location: "", venue: "", image: "", date: "", time: "",
    category: "music", status: "live", standard: "", vip: "", vvip: ""
  })

  // --- 👑 HERO SYSTEM MODAL STATES ---
  const [pendingHeroEvent, setPendingHeroEvent] = useState(null)
  const [showHeroPrompt, setShowHeroPrompt] = useState(false)

  // --- ⚙️ INTERACTION FEEDBACK STATES ---
  const [isSaving, setIsSaving] = useState(false)
  const [actionError, setActionError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showPass, setShowPass] = useState({ old: false, new: false })

  // --- 🔒 PASSWORDS AND REGISTRATION INPUT STATES ---
  const [passForm, setPassForm] = useState({ currentKey: "", newKey: "" })
  const [newAdminForm, setNewAdminForm] = useState({ name: "", email: "", password: "", role: "standard" })

  // --- 📡 FIRESTORE REAL-TIME SYNCHRONIZATION RUNNERS ---
  useEffect(() => {
    // 1. Sync Live Events
    const unsubEvents = onSnapshot(collection(db, "events"), (snap) => {
      setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })

    // 2. Sync Admin Users Directory (Only if active profile holds master clearance status)
    let unsubAdmins = () => {}
    if (currentAdminRole === "master") {
      unsubAdmins = onSnapshot(collection(db, "admins"), (snap) => {
        setAdminNodes(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      })
    }

    return () => { 
      unsubEvents()
      unsubAdmins() 
    }
  }, [currentAdminRole])

  // --- 📝 FORM MUTATION HANDLING ---
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handlePassChange = (e) => {
    const { name, value } = e.target
    setPassForm(prev => ({ ...prev, [name]: value }))
  }

  const handleNewAdminChange = (e) => {
    const { name, value } = e.target
    setNewAdminForm(prev => ({ ...prev, [name]: value }))
  }

  const triggerSuccessAlert = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 4000)
  }

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/"
  }

  // --- 🔐 SECURITY MANAGEMENT: CORE PASSWORD REAL-TIME OVERRIDES ---
  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setActionError("")

    if (!currentAdminId) {
      setActionError("Session trace identification token corrupted. Log in again.")
      setIsSaving(false)
      return
    }

    try {
      const adminRef = doc(db, "admins", currentAdminId)
      
      const q = query(collection(db, "admins"), where("email", "==", currentAdminEmail))
      const snap = await getDocs(q)
      
      if (!snap.empty && snap.docs[0].data().password !== passForm.currentKey) {
        setActionError("Your specified 'Current Password' does not match system logs.")
        setIsSaving(false)
        return
      }

      await updateDoc(adminRef, { password: passForm.newKey })
      
      triggerSuccessAlert("Your operational security clearance key has been rewritten inside Firestore.")
      setPassForm({ currentKey: "", newKey: "" })
    } catch (err) {
      console.error(err)
      setActionError("Failed to update password. Check database system rules.")
    } finally {
      setIsSaving(false)
    }
  }

  // --- 👤 SECURITY MANAGEMENT: DEPLOY NEW ADMIN PRIVILEGES ---
  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setActionError("")

    if (currentAdminRole !== "master") {
      setActionError("Access Denied: Only Master Admin accounts hold provision clearances.")
      setIsSaving(false)
      return
    }

    try {
      const q = query(collection(db, "admins"), where("email", "==", newAdminForm.email.trim().toLowerCase()))
      const checkSnap = await getDocs(q)
      if (!checkSnap.empty) {
        setActionError("An administrator node with that email structure is already logged.")
        setIsSaving(false)
        return
      }

      await addDoc(collection(db, "admins"), {
        name: newAdminForm.name.trim(),
        email: newAdminForm.email.trim().toLowerCase(),
        password: newAdminForm.password.trim(),
        role: newAdminForm.role,
        createdAt: serverTimestamp()
      })

      triggerSuccessAlert(`Administrative node provisioned for ${newAdminForm.name}`)
      setNewAdminForm({ name: "", email: "", password: "", role: "standard" })
    } catch (err) {
      console.error(err)
      setActionError("Error saving admin data record.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAdmin = async (targetId, targetRole, targetName) => {
    if (targetRole === "master") {
      alert("System Protection Guard: Master node elements cannot be decoupled or dropped.")
      return
    }

    if (confirm(`Revoke operational clearances and completely wipe profile for: ${targetName}?`)) {
      try {
        await deleteDoc(doc(db, "admins", targetId))
        triggerSuccessAlert("Target account structure erased from system records.")
      } catch (err) {
        console.error(err)
        alert("Execution failed. Verify your database permissions.")
      }
    }
  }

  // --- 🎟️ CORE BUSINESS FORWARD EVENT CRUD PROCESSORS ---
  const saveEvent = async () => {
    setIsSaving(true)
    const payload = {
      title: form.title, location: form.location, venue: form.venue, image: form.image, date: form.date, time: form.time, category: form.category, status: form.status.toLowerCase().trim(),
      pricing: { standard: Number(form.standard || 0), vip: Number(form.vip || 0), vvip: Number(form.vvip || 0) },
      isHero: editingId ? (events.find(e => e.id === editingId)?.isHero || false) : false,
      updatedAt: serverTimestamp()
    }

    if (!editingId) payload.createdAt = serverTimestamp()

    try {
      let eventId
      if (editingId) {
        await updateDoc(doc(db, "events", editingId), payload)
        eventId = editingId
        setEditingId(null)
        triggerSuccessAlert("Event structure updated cleanly.")
      } else {
        const ref = await addDoc(collection(db, "events"), payload)
        eventId = ref.id
      }

      if (!editingId) {
        const currentHeroCount = events.filter(e => e.isHero === true).length
        if (currentHeroCount < 4) {
          setPendingHeroEvent({ id: eventId, ...payload })
          setShowHeroPrompt(true)
        } else {
          triggerSuccessAlert("Event saved cleanly. (Carousel loop is at maximum 4 capacity).")
        }
      }

      setForm({ title: "", location: "", venue: "", image: "", date: "", time: "", category: "music", status: "live", standard: "", vip: "", vvip: "" })
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  // 🔄 CAROUSEL SLOTS MATRIX OPERATORS (Allows up to 4 items concurrently)
  const setAsHero = async (event) => {
    const currentHeroCount = events.filter(e => e.isHero === true).length

    if (currentHeroCount >= 4) {
      alert("Carousel Limit Reached: You can have a maximum of 4 featured Hero slots loop concurrently. Please disable an active spot first.")
      return
    }

    await updateDoc(doc(db, "events", event.id), { isHero: true })
    triggerSuccessAlert(`"${event.title}" deployed into active carousel track.`)
  }

  const removeHeroStatus = async (id) => {
    await updateDoc(doc(db, "events", id), { isHero: false })
    triggerSuccessAlert("Hero spotlight assignment revoked.")
  }

  const handleMakeHero = async () => {
    if (pendingHeroEvent) {
      const currentHeroCount = events.filter(e => e.isHero === true).length
      if (currentHeroCount >= 4) {
        alert("Carousel tracks are completely occupied.")
        setShowHeroPrompt(false)
        setPendingHeroEvent(null)
        return
      }
      await updateDoc(doc(db, "events", pendingHeroEvent.id), { isHero: true })
      triggerSuccessAlert(`"${pendingHeroEvent.title}" pushed into live carousel view layout.`)
    }
    setShowHeroPrompt(false)
    setPendingHeroEvent(null)
  }

  const handleSkipHero = () => {
    setShowHeroPrompt(false)
    setPendingHeroEvent(null)
    triggerSuccessAlert("Event listed cleanly to database registry.")
  }

  const deleteEvent = async (id) => {
    if (confirm("Are you sure you want to delete this event completely?")) {
      await deleteDoc(doc(db, "events", id))
      triggerSuccessAlert("Event database node wiped successfully.")
    }
  }

  const editEvent = (event) => {
    setEditingId(event.id)
    setForm({
      title: event.title || "", location: event.location || "", venue: event.venue || "", image: event.image || "", date: event.date || "", time: event.time || "", category: event.category || "music", status: event.status || "live",
      standard: event.pricing?.standard || "", vip: event.pricing?.vip || "", vvip: event.pricing?.vvip || ""
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // --- 📑 COHESIVE INTERNAL VIEW SCHEMATICS ---

  // 1. Unified Event Operations Desk Dashboard View
  const DashboardView = () => {
    const activeHeroes = events.filter(e => e.isHero === true)

    return (
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Event Operations Control</h1>
            <p className="text-gray-400 text-sm mt-1">Configure live concert profiles, coordinate tickets tier pricing, and manage real-time hero blocks.</p>
          </div>
        </div>

        {/* Grid Dashboard Aggregates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl relative overflow-hidden">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Total Active Events</p>
            <p className="text-4xl font-bold mt-2">{events.length}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Carousel Slots Occupied</p>
            <p className="text-4xl font-bold mt-2 text-yellow-400">
              {activeHeroes.length} <span className="text-sm text-gray-500 font-normal">/ 4 max</span>
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Your Access Level</p>
            <p className="text-sm font-bold mt-3 text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Crown size={14}/> {currentAdminRole} admin
            </p>
          </div>
        </div>

        {/* ACTIVE MULTI-HERO RUNNING DECK INDICATOR BANNER */}
        {activeHeroes.length > 0 && (
          <div className="p-4 bg-yellow-500/[0.03] border border-yellow-500/10 rounded-2xl space-y-2">
            <p className="text-xs font-bold text-yellow-500 tracking-widest flex items-center gap-1.5 uppercase">
              <Crown size={12}/> Live Carousel Sequence Stream Deck Tracker
            </p>
            <div className="flex flex-wrap gap-2">
              {activeHeroes.map(heroItem => (
                <span key={heroItem.id} className="text-xs bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 text-gray-200">
                  👑 {heroItem.title}
                  <button onClick={() => removeHeroStatus(heroItem.id)} className="text-red-400 hover:text-red-300 font-bold ml-1 text-sm transition">×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CRADLE FORM PIPELINE */}
          <div className="lg:col-span-5 bg-white/[0.02] border border-white/10 p-6 rounded-2xl space-y-4 relative">
            <h2 className="text-lg font-bold tracking-wide border-b border-white/5 pb-2 text-purple-300">
              {editingId ? "Modify Existing Entity" : "Deploy New Live Event"}
            </h2>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Event Title</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g., Sol Fest Live" className="w-full text-sm p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none transition" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">City Location</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="e.g., Nairobi" className="w-full text-sm p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none transition" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Specific Venue</label>
                  <input name="venue" value={form.venue} onChange={handleChange} placeholder="e.g., KICC grounds" className="w-full text-sm p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none transition" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Calendar Date</label>
                  <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full text-sm p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none transition" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gates Open Time</label>
                  <input name="time" value={form.time} onChange={handleChange} placeholder="e.g., 4:00 PM EAT" className="w-full text-sm p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none transition" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Visual Cover URL</label>
                <input name="image" value={form.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." className="w-full text-sm p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none transition" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tier Ticket Specifications ($)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input name="standard" value={form.standard} onChange={handleChange} placeholder="Regular" className="text-center text-sm p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none transition" />
                  <input name="vip" value={form.vip} onChange={handleChange} placeholder="VIP" className="text-center text-sm p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none transition" />
                  <input name="vvip" value={form.vvip} onChange={handleChange} placeholder="VVIP" className="text-center text-sm p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none transition" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full text-sm p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none transition">
                    <option value="music">Music 🎵</option>
                    <option value="tech">Tech 💻</option>
                    <option value="comedy">Comedy 🎭</option>
                    <option value="night">Nightlife 🌌</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Publication Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="w-full text-sm p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none transition">
                    <option value="live">Live Stream</option>
                    <option value="draft">Draft Shell</option>
                  </select>
                </div>
              </div>

              <button onClick={saveEvent} disabled={isSaving} className="w-full bg-white text-black py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 active:scale-[0.99] transition flex items-center justify-center gap-2 mt-4 shadow-xl">
                {isSaving ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : editingId ? "Update Event Profile" : "Commit New Event"}
              </button>

              {editingId && (
                <button onClick={() => { setEditingId(null); setForm({ title: "", location: "", venue: "", image: "", date: "", time: "", category: "music", status: "live", standard: "", vip: "", vvip: "" }) }} className="w-full bg-white/5 border border-white/10 text-gray-300 py-2 rounded-xl text-xs font-semibold hover:text-white transition">
                  Cancel Edit Routine
                </button>
              )}
            </div>
          </div>

          {/* DATA ARCHIVE FEED RENDERS */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-bold tracking-wide text-gray-300 px-1">Synchronized Collection Matrix ({events.length})</h2>
            
            {events.length === 0 ? (
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-12 text-center text-gray-500 text-sm">
                No registered deployment collections found inside firestore. Create an asset node to populate.
              </div>
            ) : (
              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center border gap-4 transition-all duration-200 ${
                      event.isHero 
                        ? "border-yellow-500/40 bg-yellow-500/[0.03] shadow-[inset_0_0_20px_rgba(234,179,8,0.02)]" 
                        : "border-white/10 bg-white/[0.01] hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="space-y-2 flex-grow min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <p className="font-bold text-base tracking-wide text-white truncate">{event.title}</p>
                        {event.isHero && (
                          <span className="text-[9px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest flex items-center gap-1">
                            <Crown size={10} /> HERO SPOT
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin size={13} className="text-gray-500 shrink-0" />
                          <span>{event.location} {event.venue && `• ${event.venue}`}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-gray-500 shrink-0" />
                          <span>{event.date} {event.time && `at ${event.time}`}</span>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center gap-3 text-xs text-gray-400 flex-wrap border-t border-white/5">
                        <span className="flex items-center gap-1 text-[11px]"><DollarSign size={12} className="text-emerald-500" /> Reg: <b className="text-gray-200">${event.pricing?.standard || 0}</b></span>
                        <span className="flex items-center gap-1 text-[11px]"><DollarSign size={12} className="text-purple-400" /> VIP: <b className="text-gray-200">${event.pricing?.vip || 0}</b></span>
                        <span className="flex items-center gap-1 text-[11px]"><DollarSign size={12} className="text-cyan-400" /> VVIP: <b className="text-gray-200">${event.pricing?.vvip || 0}</b></span>
                      </div>

                      <div className="flex gap-2 pt-0.5">
                        <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md font-mono uppercase tracking-wider flex items-center gap-1">
                          <Tag size={10} /> {event.category || "music"}
                        </span>
                        <span className={`text-[9px] border px-2 py-0.5 rounded-md font-mono uppercase tracking-wider flex items-center gap-1 ${
                          event.status === 'live' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border-white/10'
                        }`}>
                          <Radio size={10} /> {event.status}
                        </span>
                      </div>
                    </div>

                    {/* ACTION TRIGGERS PANEL */}
                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto min-w-[125px] border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                      {event.isHero ? (
                        <button onClick={() => removeHeroStatus(event.id)} className="flex-1 text-center py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-xl text-xs font-semibold transition">
                          Remove Slide
                        </button>
                      ) : (
                        <button onClick={() => setAsHero(event)} className="flex-1 text-center py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 rounded-xl text-xs font-semibold transition">
                          Feature on Slide
                        </button>
                      )}
                      <div className="flex gap-2 flex-1">
                        <button onClick={() => editEvent(event)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-semibold transition">
                          <Edit size={12} /> Edit
                        </button>
                        <button onClick={() => deleteEvent(event.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition">
                          <Trash2 size={12} /> Cut
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 2. Change Security Access Key View Configuration
  const ChangePasswordView = () => (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Update Authentication Key</h1>
        <p className="text-gray-400 text-sm mt-1">Modify your active authorization key code. Changes synchronize inside Firebase instantly.</p>
      </div>

      {actionError && (
        <div className="flex items-center gap-2 text-sm bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-xl">
          <ShieldAlert size={16}/>{actionError}
        </div>
      )}

      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Current Root Key</label>
          <div className="relative">
            <input name="currentKey" value={passForm.currentKey} onChange={handlePassChange} type={showPass.old ? "text" : "password"} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none pr-10" required />
            <button type="button" onClick={() => setShowPass({...showPass, old: !showPass.old})} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">{showPass.old ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">New Core Password</label>
          <div className="relative">
            <input name="newKey" value={passForm.newKey} onChange={handlePassChange} type={showPass.new ? "text" : "password"} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none pr-10" required />
            <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">{showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </div>

        <button type="submit" disabled={isSaving} className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition flex items-center justify-center gap-2 mt-6">
          {isSaving ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><Save size={16}/> Override Password Reference</>}
        </button>
      </form>
    </div>
  )

  // 3. Provision New Administrator Account View Configuration (Protected Layout Route Block)
  const AddAdminView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Provision Admin Node</h1>
          <p className="text-gray-400 text-sm mt-1">Authorize supplementary terminal node vectors. Added accounts gain immediate login dashboard access.</p>
        </div>

        {actionError && (
          <div className="flex items-center gap-2 text-sm bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-xl">
            <ShieldAlert size={16}/>{actionError}
          </div>
        )}

        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Full User Name</label>
            <input name="name" value={newAdminForm.name} onChange={handleNewAdminChange} type="text" placeholder="e.g., Kevin Dev" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Corporate Admin Email</label>
            <input name="email" value={newAdminForm.email} onChange={handleNewAdminChange} type="email" placeholder="username@odyssey.com" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Assigned Secure Password</label>
            <input name="password" value={newAdminForm.password} onChange={handleNewAdminChange} type="text" placeholder="Assign Core String" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">System Role Level</label>
            <select name="role" value={newAdminForm.role} onChange={handleNewAdminChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none">
              <option value="standard">Standard Admin (List Operations)</option>
              <option value="master">Master Admin (Full Clearance privileges)</option>
            </select>
          </div>
          <button type="submit" disabled={isSaving} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 mt-6 shadow-lg shadow-purple-600/10">
            {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><UserPlus size={16}/> Create Admin Document</>}
          </button>
        </form>
      </div>

      <div className="lg:col-span-7 space-y-4 w-full">
        <h2 className="text-lg font-bold tracking-tight text-gray-300 flex items-center gap-2">
          <Users size={18}/> Authorized Operator Nodes ({adminNodes.length})
        </h2>
        <div className="space-y-2 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
          {adminNodes.map((node) => (
            <div key={node.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex justify-between items-center gap-4 hover:bg-white/[0.02] transition">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm text-white">{node.name}</p>
                  {node.role === 'master' && (
                    <span className="text-[9px] text-yellow-500 border border-yellow-500/20 bg-yellow-500/5 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                      <Crown size={10}/> Root Master
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">{node.email}</p>
                <p className="text-[10px] text-gray-500 mt-1">Clearance Key Trace: <span className="text-purple-400 font-mono select-all">{node.password}</span></p>
              </div>

              {node.role !== 'master' && (
                <button onClick={() => handleDeleteAdmin(node.id, node.role, node.name)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition shrink-0">
                  <Trash2 size={16}/>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const navItems = [
    { id: "dashboard", label: "Dashboard Core", icon: LayoutDashboard, viewable: true },
    { id: "change-password", label: "Change Password", icon: KeyRound, viewable: true },
    { id: "add-admin", label: "User Management", icon: UserPlus, viewable: currentAdminRole === "master" },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6 text-white bg-[#03050e] md:bg-transparent">
      <div className="flex items-center gap-3 mb-10 select-none px-2">
        <div className="w-6 h-6 rounded-full border border-purple-500 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_8px_#a855f7]" />
        </div>
        <h1 className="text-lg font-bold tracking-widest bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">ODYSSEY HQ</h1>
      </div>

      <nav className="space-y-1.5 flex-grow">
        {navItems.filter(item => item.viewable).map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-left ${
                isActive 
                  ? "bg-purple-600/10 text-purple-400 border border-purple-500/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/[0.02] border border-transparent"
              }`}
            >
              <Icon size={18} className={isActive ? "text-purple-400" : "text-gray-400"} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-white/5 pt-4">
        <div className="px-4 pb-3 mb-1 text-left">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Active System Identity</p>
          <p className="text-xs text-purple-300 font-medium truncate mt-0.5">{currentAdminEmail}</p>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-400 hover:bg-red-500/10 transition duration-200">
          <LogOut size={18} /> Terminate Session
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050816] text-white flex relative antialiased font-sans">
      
      <header className="md:hidden fixed top-0 left-0 w-full h-16 bg-[#050816]/80 backdrop-blur-xl border-b border-white/5 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Menu size={22} className="cursor-pointer text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)} />
          <span className="text-sm font-semibold tracking-wider text-purple-400 uppercase">Control Panel</span>
        </div>
        <button onClick={handleLogout} className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition"><LogOut size={18} /></button>
      </header>

      <aside className="hidden md:block w-64 border-r border-white/5 shrink-0 fixed h-screen top-0 left-0 bg-[#050816]">
        {SidebarContent()}
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 w-72 bg-[#03050e] z-50 md:hidden shadow-2xl border-r border-white/5">
              <button onClick={() => setSidebarOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white"><X size={20} /></button>
              {SidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-grow md:pl-64 pt-20 md:pt-8 p-4 md:p-10 max-w-[1400px] mx-auto w-full min-h-screen">
        
        <AnimatePresence>
          {successMessage && (
            <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3.5 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium backdrop-blur-md">
              <CheckCircle2 size={18} className="shrink-0" /> {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full">
          {currentView === "dashboard" && DashboardView()}
          {currentView === "change-password" && ChangePasswordView()}
          {currentView === "add-admin" && AddAdminView()}
        </div>
      </main>

      <AnimatePresence>
        {showHeroPrompt && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#0b0f2a] p-6 rounded-2xl border border-white/10 w-full max-w-[360px] text-center shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center mx-auto mb-3 border border-yellow-500/20">
                <Crown size={22} />
              </div>
              <h2 className="text-xl font-bold mb-1.5 text-white">Add to Carousel Deck?</h2>
              <p className="text-gray-400 text-sm mb-6 px-2">Do you want to immediately showcase <span className="text-purple-300 font-semibold">"{pendingHeroEvent?.title}"</span> inside the premium rotating home track?</p>
              <div className="flex gap-3">
                <button onClick={handleMakeHero} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-2.5 rounded-xl font-bold text-sm transition">Yes, Feature</button>
                <button onClick={handleSkipHero} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl text-sm transition">Skip for Now</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default AdminPanel