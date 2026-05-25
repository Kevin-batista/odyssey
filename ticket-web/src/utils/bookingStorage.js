const KEY = "bookings"

export const getBookings = () => {
  const data = localStorage.getItem(KEY)
  return data ? JSON.parse(data) : []
}

export const addBooking = (booking) => {
  const existing = getBookings()
  const updated = [...existing, booking]
  localStorage.setItem(KEY, JSON.stringify(updated))
}

export const clearBookings = () => {
  localStorage.removeItem(KEY)
}