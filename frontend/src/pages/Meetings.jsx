import { useEffect, useState } from 'react'
import { meetingsAPI } from '../lib/api'
import { format } from 'date-fns'

export default function Meetings() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMeetings()
  }, [activeTab])

  const fetchMeetings = async () => {
    try {
      setLoading(true)
      const response = activeTab === 'upcoming'
        ? await meetingsAPI.getUpcoming()
        : await meetingsAPI.getPast()
      setMeetings(response.data)
    } catch (err) {
      console.error('Error fetching meetings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this meeting?')) {
      return
    }

    try {
      await meetingsAPI.cancel(id)
      fetchMeetings()
    } catch (err) {
      alert('Failed to cancel meeting')
      console.error(err)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold text-gray-900 mb-2">Meetings</h2>
      <p className="text-gray-600 text-lg mb-8">View and manage your scheduled meetings</p>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-100 inline-flex mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
            activeTab === 'upcoming'
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
            activeTab === 'past'
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Past
        </button>
      </div>

      {/* Meetings List */}
      {meetings.length === 0 ? (
        <div className="bg-white shadow-lg rounded-2xl p-12 text-center border border-gray-100">
          <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">No {activeTab} meetings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{meeting.invitee_name}</h3>
                <p className="text-sm text-gray-600 mb-4">{meeting.invitee_email}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {format(new Date(meeting.scheduled_at), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {format(new Date(meeting.scheduled_at), 'h:mm a')}
                </div>
                {activeTab === 'upcoming' && meeting.status === 'scheduled' && (
                  <button
                    onClick={() => handleCancel(meeting.id)}
                    className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Meeting
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
