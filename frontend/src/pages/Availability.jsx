import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { availabilityAPI, eventTypesAPI } from '../lib/api'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Availability() {
  const [eventTypes, setEventTypes] = useState([])
  const [selectedEventType, setSelectedEventType] = useState(null)
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [timezone, setTimezone] = useState('UTC')

  useEffect(() => {
    fetchEventTypes()
  }, [])

  useEffect(() => {
    if (selectedEventType) {
      fetchAvailability()
    }
  }, [selectedEventType])

  const fetchEventTypes = async () => {
    try {
      const response = await eventTypesAPI.getAll()
      setEventTypes(response.data)
      if (response.data.length > 0) {
        setSelectedEventType(response.data[0].id)
      }
    } catch (err) {
      console.error('Error fetching event types:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailability = async () => {
    try {
      const response = await availabilityAPI.getByEventType(selectedEventType)
      setAvailability(response.data)
      if (response.data.length > 0) {
        setTimezone(response.data[0].timezone)
      }
    } catch (err) {
      console.error('Error fetching availability:', err)
    }
  }

  const handleDayToggle = (dayIndex) => {
    const existing = availability.find(a => a.day_of_week === dayIndex)
    if (existing) {
      // Remove
      handleDelete(existing.id)
    } else {
      // Add with default times
      handleAddDay(dayIndex)
    }
  }

  const handleAddDay = async (dayIndex) => {
    try {
      await availabilityAPI.create({
        event_type_id: selectedEventType,
        day_of_week: dayIndex,
        start_time: '09:00:00',
        end_time: '17:00:00',
        timezone: timezone
      })
      fetchAvailability()
    } catch (err) {
      alert('Failed to add availability')
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await availabilityAPI.delete(id)
      fetchAvailability()
    } catch (err) {
      alert('Failed to delete availability')
      console.error(err)
    }
  }

  const handleTimeUpdate = async (id, field, value) => {
    try {
      const schedule = availability.find(a => a.id === id)
      await availabilityAPI.update(id, {
        ...schedule,
        [field]: value
      })
      fetchAvailability()
    } catch (err) {
      alert('Failed to update availability')
      console.error(err)
    }
  }

  const handleTimezoneChange = async (newTimezone) => {
    setTimezone(newTimezone)
    // Update all schedules with new timezone
    try {
      const updates = availability.map(schedule =>
        availabilityAPI.update(schedule.id, { ...schedule, timezone: newTimezone })
      )
      await Promise.all(updates)
      fetchAvailability()
    } catch (err) {
      console.error('Error updating timezone:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (eventTypes.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-12 text-center border border-gray-100">
        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
          <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-gray-600 text-lg mb-4">Please create an event type first.</p>
        <Link
          to="/event-types/new"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Create Event Type
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Availability Settings</h2>
        <p className="text-gray-600 text-lg">Set your weekly availability schedule</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Event Type
          </label>
          <select
            value={selectedEventType || ''}
            onChange={(e) => setSelectedEventType(Number(e.target.value))}
            className="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          >
            {eventTypes.map((et) => (
              <option key={et.id} value={et.id}>
                {et.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => handleTimezoneChange(e.target.value)}
            className="block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Weekly Schedule
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {DAYS.map((day, index) => {
            const schedule = availability.find(a => a.day_of_week === index)
            return (
              <div key={index} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={!!schedule}
                      onChange={() => handleDayToggle(index)}
                      className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                    />
                    <label className="ml-3 text-base font-semibold text-gray-900 cursor-pointer">
                      {day}
                    </label>
                  </div>
                  {schedule && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500 font-semibold">Start</label>
                        <input
                          type="time"
                          value={schedule.start_time}
                          onChange={(e) => handleTimeUpdate(schedule.id, 'start_time', e.target.value)}
                          className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500 font-semibold">End</label>
                        <input
                          type="time"
                          value={schedule.end_time}
                          onChange={(e) => handleTimeUpdate(schedule.id, 'end_time', e.target.value)}
                          className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
