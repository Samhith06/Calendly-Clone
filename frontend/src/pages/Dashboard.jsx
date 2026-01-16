import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { eventTypesAPI, meetingsAPI } from '../lib/api'

export default function Dashboard() {
  const [eventTypes, setEventTypes] = useState([])
  const [upcomingMeetings, setUpcomingMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventTypesRes, meetingsRes] = await Promise.all([
          eventTypesAPI.getAll(),
          meetingsAPI.getUpcoming()
        ])
        setEventTypes(eventTypesRes.data)
        setUpcomingMeetings(meetingsRes.data.slice(0, 5)) // Show only first 5
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600 text-lg">Manage your event types, availability, and meetings</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Event Types Card */}
        <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <Link
                to="/event-types"
                className="text-primary hover:text-blue-700 font-medium text-sm transition-colors"
              >
                View All →
              </Link>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Types</h3>
            <div className="mb-4">
              <p className="text-4xl font-bold text-gray-900">{eventTypes.length}</p>
              <p className="text-sm text-gray-500 mt-1">Total event types</p>
            </div>
            {eventTypes.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-gray-100">
                {eventTypes.slice(0, 3).map((eventType) => (
                  <div key={eventType.id} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                    <span className="text-sm font-medium text-gray-700">{eventType.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{eventType.duration_minutes} min</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Meetings Card */}
        <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <Link
                to="/meetings"
                className="text-primary hover:text-blue-700 font-medium text-sm transition-colors"
              >
                View All →
              </Link>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Meetings</h3>
            <div className="mb-4">
              <p className="text-4xl font-bold text-gray-900">{upcomingMeetings.length}</p>
              <p className="text-sm text-gray-500 mt-1">Next meetings</p>
            </div>
            {upcomingMeetings.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-gray-100">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                    <p className="text-sm font-medium text-gray-900">{meeting.invitee_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(meeting.scheduled_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-gradient-to-br from-primary to-blue-600 overflow-hidden shadow-lg rounded-xl text-white">
          <div className="p-6">
            <div className="mb-4">
              <div className="p-3 bg-white/20 rounded-lg inline-block mb-3">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
              <p className="text-sm text-blue-100">Get started quickly</p>
            </div>
            <div className="space-y-2 mt-6">
              <Link
                to="/event-types/new"
                className="block w-full bg-white text-primary font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-center text-sm"
              >
                + Create Event Type
              </Link>
              <Link
                to="/availability"
                className="block w-full bg-white/20 text-white font-medium py-2 px-4 rounded-lg hover:bg-white/30 transition-colors text-center text-sm border border-white/30"
              >
                Set Availability
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
