import { createContext, useContext, useState, useEffect } from "react"

const EventContext = createContext()

export function EventProvider({ children }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem("events")
    if (stored) {
      setEvents(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events))
  }, [events])

  const addEvent = (event) => {
    setEvents((prev) => [
      ...prev,
      { id: Date.now(), ...event }
    ])
  }

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const updateEvent = (id, updated) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    )
  }

  return (
    <EventContext.Provider value={{
      events,
      addEvent,
      deleteEvent,
      updateEvent
    }}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = () => useContext(EventContext)