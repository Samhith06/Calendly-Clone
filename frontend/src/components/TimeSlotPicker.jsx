import { useState, useEffect } from 'react'
import { format } from 'date-fns'

export default function TimeSlotPicker({ availableSlots, onSlotSelect, selectedSlot, timezone = 'UTC' }) {
  if (!availableSlots || availableSlots.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No available time slots for this date.</p>
      </div>
    )
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return format(date, 'h:mm a')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Select a time
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {availableSlots.map((slot, index) => {
          const slotTime = formatTime(slot)
          const isSelected = selectedSlot === slot

          return (
            <button
              key={index}
              onClick={() => onSlotSelect(slot)}
              className={`
                py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 transform
                ${isSelected
                  ? 'bg-primary text-white shadow-lg scale-105 ring-2 ring-primary ring-offset-2'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105 border-2 border-gray-200 hover:border-primary/50'
                }
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              `}
            >
              {slotTime}
            </button>
          )
        })}
      </div>
    </div>
  )
}
