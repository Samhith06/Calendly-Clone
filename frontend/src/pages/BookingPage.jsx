import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { bookingsAPI, eventTypesAPI } from '../lib/api'
import Calendar from '../components/Calendar'
import TimeSlotPicker from '../components/TimeSlotPicker'
import BookingForm from '../components/BookingForm'

export default function BookingPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [eventType, setEventType] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState(null)
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)

  useEffect(() => {
    fetchEventType()
  }, [slug])

  useEffect(() => {
    if (selectedDate && eventType) {
      fetchAvailableSlots()
    }
  }, [selectedDate, eventType])

  const fetchEventType = async () => {
    try {
      const response = await eventTypesAPI.getBySlug(slug)
      setEventType(response.data)
    } catch (err) {
      setError('Event type not found')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const response = await bookingsAPI.getAvailableSlots(slug, dateStr, timezone)
      setAvailableSlots(response.data.available_slots || [])
    } catch (err) {
      console.error('Error fetching available slots:', err)
      setAvailableSlots([])
    }
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
  }

  const handleBookingSubmit = async (formData) => {
    if (!selectedSlot) {
      alert('Please select a time slot')
      return
    }

    try {
      setBooking(true)
      setError(null)
      
      const bookingData = {
        event_type_id: eventType.id,
        invitee_name: formData.name,
        invitee_email: formData.email,
        scheduled_at: selectedSlot
      }

      const response = await bookingsAPI.create(bookingData)
      
      // Navigate to confirmation page
      navigate(`/book/${slug}/confirm`, { state: { meeting: response.data } })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create booking. Please try again.')
      console.error(err)
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (error && !eventType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-primary/10 rounded-2xl mb-4">
            <svg className="h-12 w-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">{eventType?.name}</h1>
          <div className="inline-flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{eventType?.duration_minutes} minutes</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Calendar and Time Slots */}
          <div className="space-y-6">
            <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
            
            {selectedDate && (
              <TimeSlotPicker
                availableSlots={availableSlots}
                onSlotSelect={handleSlotSelect}
                selectedSlot={selectedSlot}
                timezone={timezone}
              />
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            {selectedSlot ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                  <p className="text-sm text-blue-100 mb-2 font-medium">Selected Time</p>
                  <p className="text-xl font-bold mb-1">
                    {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-3xl font-bold">
                    {format(new Date(selectedSlot), 'h:mm a')}
                  </p>
                </div>
                <BookingForm onSubmit={handleBookingSubmit} loading={booking} />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">
                  {selectedDate ? 'Select a time slot to continue' : 'Select a date to view available times'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
