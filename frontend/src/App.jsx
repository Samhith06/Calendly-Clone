import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import EventTypes from './pages/EventTypes'
import EventTypeEdit from './pages/EventTypeEdit'
import Availability from './pages/Availability'
import Meetings from './pages/Meetings'
import BookingPage from './pages/BookingPage'
import BookingConfirm from './pages/BookingConfirm'

function App() {
  return (
    <Routes>
      {/* Public booking route - no layout */}
      <Route path="/book/:slug" element={<BookingPage />} />
      <Route path="/book/:slug/confirm" element={<BookingConfirm />} />
      
      {/* Admin routes - with layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="event-types" element={<EventTypes />} />
        <Route path="event-types/new" element={<EventTypeEdit />} />
        <Route path="event-types/:id/edit" element={<EventTypeEdit />} />
        <Route path="availability" element={<Availability />} />
        <Route path="meetings" element={<Meetings />} />
      </Route>
    </Routes>
  )
}

export default App
