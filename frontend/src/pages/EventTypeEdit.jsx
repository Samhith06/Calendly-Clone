import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { eventTypesAPI } from '../lib/api'

export default function EventTypeEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'
  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState(null)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()

  useEffect(() => {
    if (!isNew) {
      fetchEventType()
    }
  }, [id])

  const fetchEventType = async () => {
    try {
      const response = await eventTypesAPI.getById(id)
      const eventType = response.data
      setValue('name', eventType.name)
      setValue('duration_minutes', eventType.duration_minutes)
      setValue('slug', eventType.slug)
    } catch (err) {
      setError('Failed to load event type')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setError(null)
      if (isNew) {
        await eventTypesAPI.create(data)
      } else {
        await eventTypesAPI.update(id, data)
      }
      navigate('/event-types')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save event type')
      console.error(err)
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
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          {isNew ? 'Create Event Type' : 'Edit Event Type'}
        </h2>
        <p className="text-gray-600 text-lg">
          {isNew ? 'Set up a new event type for bookings' : 'Update your event type settings'}
        </p>
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

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-gray-100">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Event Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Event name is required' })}
            className="mt-1 block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            placeholder="e.g., 30 Minute Meeting"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="duration_minutes" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration_minutes"
            {...register('duration_minutes', {
              required: 'Duration is required',
              min: { value: 1, message: 'Duration must be at least 1 minute' }
            })}
            className="mt-1 block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            placeholder="30"
          />
          {errors.duration_minutes && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.duration_minutes.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            URL Slug
          </label>
          <input
            type="text"
            id="slug"
            {...register('slug', {
              required: 'Slug is required',
              pattern: {
                value: /^[a-z0-9-]+$/,
                message: 'Slug can only contain lowercase letters, numbers, and hyphens'
              }
            })}
            className="mt-1 block w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-mono"
            placeholder="30min-meeting"
          />
          {errors.slug && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.slug.message}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span className="font-semibold">Booking URL:</span> <code className="text-primary">/book/your-slug</code>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/event-types')}
            className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {isNew ? 'Create Event Type' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
