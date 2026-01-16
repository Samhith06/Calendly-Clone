# Calendly Clone

A full-stack scheduling/booking web application that replicates Calendly's design and functionality.

## Tech Stack

- **Frontend**: React.js with Vite, React Router, Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: MySQL with SQLAlchemy ORM

## Features

### Core Features
- Event Types Management (Create, Edit, Delete)
- Availability Settings (Days of week, time slots, timezone)
- Public Booking Page with calendar and time slot selection
- Meetings Management (View upcoming/past, Cancel meetings)
- Double-booking prevention

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.9 or higher)
- MySQL (v8.0 or higher)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file in the backend directory:
```
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/calendly_db
SECRET_KEY=your-secret-key-here
```

6. Create the MySQL database:
```sql
CREATE DATABASE calendly_db;
```

7. Run database migrations and seed data (after models are created):
```bash
python database/seed.py
```

8. Start the FastAPI server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Structure

```
Scalar/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities and API clients
│   │   └── App.jsx       # Main app component with routing
│   └── package.json
├── backend/          # FastAPI application
│   ├── app/
│   │   ├── api/      # API route handlers
│   │   ├── models/   # SQLAlchemy models
│   │   ├── schemas/  # Pydantic schemas
│   │   └── services/ # Business logic
│   ├── database/     # Database setup and migrations
│   └── main.py       # FastAPI app entry point
└── README.md
```

## API Endpoints

- `GET /api/event-types` - List all event types
- `POST /api/event-types` - Create event type
- `GET /api/event-types/{id}` - Get event type
- `PUT /api/event-types/{id}` - Update event type
- `DELETE /api/event-types/{id}` - Delete event type
- `GET /api/availability/{event_type_id}` - Get availability for event type
- `POST /api/availability` - Set availability
- `GET /api/bookings/available/{event_type_slug}` - Get available time slots
- `POST /api/bookings` - Create booking
- `GET /api/meetings` - List meetings
- `PUT /api/meetings/{id}/cancel` - Cancel meeting

## Assumptions

- Single default user (no authentication system)
- All times stored in UTC, converted to user's timezone for display
- Availability is set per event type
- Meeting duration matches event type duration exactly
- No recurring meetings (each booking is independent)
