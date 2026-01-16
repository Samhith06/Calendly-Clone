import { useLocation, Link } from 'react-router-dom'
import { format } from 'date-fns'

export default function BookingConfirm() {
  const location = useLocation()
  const meeting = location.state?.meeting

  if (!meeting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Meeting Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Go to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-gray-100">
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-6 shadow-lg animate-bounce">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Booking Confirmed!</h1>
            <p className="text-gray-600 text-lg">Your meeting has been scheduled successfully.</p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 text-left border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Meeting Details
            </h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">Meeting ID</p>
                <p className="text-lg font-bold text-gray-900">#{meeting.id}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Date & Time</p>
                <p className="text-lg font-bold text-gray-900 mb-1">
                  {format(new Date(meeting.scheduled_at), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-xl font-bold text-primary">
                  {format(new Date(meeting.scheduled_at), 'h:mm a')}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Invitee</p>
                <p className="text-lg font-bold text-gray-900">{meeting.invitee_name}</p>
                <p className="text-sm text-gray-600 mt-1">{meeting.invitee_email}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Back to Home
            </Link>
            <a
              href={`/book/${meeting.event_type?.slug || ''}`}
              className="inline-block bg-white text-primary border-2 border-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Book Another
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
