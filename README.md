# Calendly Clone

A full-stack scheduling and booking web application that replicates Calendly's core functionality. Create event types, set your availability, and let others book time with you seamlessly.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)

## ✨ Features

### Core Functionality
- **Event Types Management** - Create, edit, and delete custom event types with unique URLs
- **Availability Settings** - Configure your available days, time slots, and timezone preferences
- **Public Booking Page** - Beautiful calendar interface for clients to book meetings
- **Meetings Dashboard** - View upcoming and past meetings, cancel bookings
- **Double-booking Prevention** - Automatic conflict detection
- **Timezone Support** - All times stored in UTC and converted to user's timezone

### UI/UX Highlights
- Calendly-inspired modern design
- Responsive layout (mobile, tablet, desktop)
- Loading states and error handling
- Form validation
- Accessible components

## 🛠 Tech Stack

**Frontend:**
- React 19 with Vite
- React Router v7
- Tailwind CSS
- Axios for API calls
- date-fns for date handling

**Backend:**
- Python 3.9+ with FastAPI
- SQLAlchemy ORM
- Pydantic for validation
- PyMySQL for database connectivity

**Database:**
- MySQL 8.0+

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **Python** v3.9 or higher ([Download](https://www.python.org/))
- **MySQL** v8.0 or higher ([Download](https://dev.mysql.com/downloads/))

Verify installations:
```bash
node --version
python --version
mysql --version
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Scalar
```

### 2. Database Setup (2 minutes)

**Option A - MySQL Command Line:**
```bash
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE calendly_db;
EXIT;
```

**Option B - MySQL Workbench:**
1. Right-click on "Schemas" → "Create Schema"
2. Name: `calendly_db`
3. Click "Apply"

**Option C - phpMyAdmin:**
1. Navigate to http://localhost/phpmyadmin
2. Click "Databases" tab
3. Enter name: `calendly_db`
4. Click "Create"

### 3. Backend Setup (3 minutes)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
python create_env.py
# Or manually create .env file (see Configuration section below)

# Initialize database with sample data
python database/seed.py

# Start the backend server
uvicorn main:app --reload
```

✅ Backend running at: **http://localhost:8000**

### 4. Frontend Setup (1 minute)

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

## 🎉 You're Ready!

Access your application:
- **Admin Dashboard**: http://localhost:5173
- **Public Booking Page**: http://localhost:5173/book/30min-meeting
- **API Documentation**: http://localhost:8000/docs

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/calendly_db
SECRET_KEY=your-secret-key-here
```

**Using the helper script:**
```bash
cd backend
python create_env.py
```

The script will prompt you for:
- MySQL username (usually `root`)
- MySQL password
- MySQL host (usually `localhost`)
- MySQL port (usually `3306`)
- Database name (usually `calendly_db`)

## 📁 Project Structure

```
Scalar/
├── backend/                 # Python FastAPI Backend
│   ├── app/
│   │   ├── api/            # REST API endpoints
│   │   │   ├── event_types.py
│   │   │   ├── availability.py
│   │   │   ├── bookings.py
│   │   │   └── meetings.py
│   │   ├── models/         # SQLAlchemy database models
│   │   │   ├── event_type.py
│   │   │   ├── availability.py
│   │   │   └── meeting.py
│   │   ├── schemas/        # Pydantic validation schemas
│   │   └── services/       # Business logic layer
│   ├── database/
│   │   ├── database.py     # Database connection setup
│   │   └── seed.py         # Database seeding script
│   ├── main.py             # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   │   ├── EventTypes.jsx
│   │   │   ├── Availability.jsx
│   │   │   ├── Meetings.jsx
│   │   │   └── BookingPage.jsx
│   │   ├── lib/            # Utilities and API client
│   │   ├── App.jsx         # Main app with routing
│   │   └── main.jsx        # Application entry point
│   ├── package.json        # Node.js dependencies
│   ├── vite.config.js      # Vite configuration
│   └── tailwind.config.js  # Tailwind CSS configuration
│
└── README.md               # This file
```

## 🔌 API Endpoints

### Event Types
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/event-types` | List all event types |
| POST | `/api/event-types` | Create new event type |
| GET | `/api/event-types/{id}` | Get event type by ID |
| GET | `/api/event-types/slug/{slug}` | Get event type by slug |
| PUT | `/api/event-types/{id}` | Update event type |
| DELETE | `/api/event-types/{id}` | Delete event type |

### Availability
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/availability/event-type/{id}` | Get availability schedules |
| POST | `/api/availability` | Create availability schedule |
| POST | `/api/availability/bulk` | Create multiple schedules |
| PUT | `/api/availability/{id}` | Update schedule |
| DELETE | `/api/availability/{id}` | Delete schedule |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/available/{slug}` | Get available time slots |
| POST | `/api/bookings` | Create new booking |

### Meetings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meetings` | List all meetings (with filters) |
| GET | `/api/meetings/upcoming` | Get upcoming meetings |
| GET | `/api/meetings/past` | Get past meetings |
| GET | `/api/meetings/{id}` | Get meeting by ID |
| PUT | `/api/meetings/{id}/cancel` | Cancel meeting |

**Interactive API Documentation**: Visit http://localhost:8000/docs when the backend is running.

## 💾 Database Schema

### Tables

**event_types**
- `id` - Primary key
- `name` - Event type name
- `slug` - Unique URL slug
- `duration` - Duration in minutes
- `description` - Optional description
- `created_at` - Timestamp

**availability_schedules**
- `id` - Primary key
- `event_type_id` - Foreign key to event_types
- `day_of_week` - 0 (Monday) to 6 (Sunday)
- `start_time` - Time in HH:MM format
- `end_time` - Time in HH:MM format
- `timezone` - Timezone string

**meetings**
- `id` - Primary key
- `event_type_id` - Foreign key to event_types
- `attendee_name` - Attendee's name
- `attendee_email` - Attendee's email
- `start_time` - Meeting start datetime (UTC)
- `end_time` - Meeting end datetime (UTC)
- `status` - scheduled, cancelled, completed
- `created_at` - Timestamp

### Relationships
- EventType → AvailabilitySchedule (one-to-many)
- EventType → Meeting (one-to-many)

## 📖 Usage Guide

### For Administrators

1. **Create Event Types**
   - Navigate to "Event Types" in the dashboard
   - Click "Create Event Type"
   - Enter name, duration, and optional description
   - A unique slug will be generated automatically

2. **Set Availability**
   - Go to "Availability" page
   - Select an event type
   - Choose days of the week and time ranges
   - Set your timezone

3. **Manage Meetings**
   - View all bookings in the "Meetings" page
   - Filter by upcoming or past meetings
   - Cancel meetings if needed

### For Clients (Public Booking)

1. Visit the booking URL: `http://localhost:5173/book/{event-slug}`
2. Select a date from the calendar
3. Choose an available time slot
4. Enter your name and email
5. Confirm the booking

## 🔧 Development

### Running in Development Mode

**Backend (with auto-reload):**
```bash
cd backend
venv\Scripts\activate  # Windows
uvicorn main:app --reload
```

**Frontend (with hot module replacement):**
```bash
cd frontend
npm run dev
```

### Sample Data

The seed script (`python database/seed.py`) creates:
- **3 sample event types:**
  - 30 Minute Meeting (slug: `30min-meeting`)
  - 1 Hour Consultation (slug: `1hour-consultation`)
  - 15 Minute Quick Chat (slug: `15min-quick-chat`)
- **Availability schedules** for weekdays (9 AM - 5 PM)
- **Sample meetings** (upcoming and past)

### Resetting the Database

To start fresh:
```bash
# In MySQL
DROP DATABASE calendly_db;
CREATE DATABASE calendly_db;

# Then re-run seed script
cd backend
python database/seed.py
```

## 🐛 Troubleshooting

### Backend Issues

**"Can't connect to MySQL server"**
- Ensure MySQL service is running
- Windows: `net start MySQL80`
- Check MySQL credentials in `.env` file

**"Access denied for user"**
- Verify username and password in `.env`
- Ensure user has permissions on the database

**"Module not found" errors**
- Activate virtual environment: `venv\Scripts\activate`
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

**"Cannot GET /api/..."**
- Verify backend is running on port 8000
- Check browser console for CORS errors

**Blank page or errors**
- Check browser console for errors
- Verify Node.js version: `node --version` (should be v18+)
- Clear cache and reinstall: `rm -rf node_modules package-lock.json && npm install`

### Database Issues

**"Database doesn't exist"**
- Create database: `CREATE DATABASE calendly_db;`
- Run seed script: `python database/seed.py`

**"Table doesn't exist"**
- Run seed script to create tables: `python database/seed.py`

## 🚀 Deployment

Ready to deploy your application to production? See the comprehensive [DEPLOYMENT.md](DEPLOYMENT.md) guide.

### Quick Deployment Options

**Recommended Stack (Free Tier):**
- **Database**: PlanetScale (MySQL-compatible, free 5GB)
- **Backend**: Railway (FastAPI, 500 hrs/month free)
- **Frontend**: Vercel (React, unlimited free)

**Total Cost**: $0/month for hobby projects

The deployment guide covers:
- ✅ Multiple platform options (Railway, Render, Vercel, Netlify, DigitalOcean)
- ✅ Database deployment (PlanetScale, Railway MySQL)
- ✅ Environment configuration
- ✅ Custom domain setup
- ✅ SSL/HTTPS (automatic)
- ✅ CI/CD setup
- ✅ Monitoring and maintenance
- ✅ Cost estimates
- ✅ Troubleshooting

**[📖 Read Full Deployment Guide →](DEPLOYMENT.md)**

## 🎯 Future Enhancements

Potential features to add:
- [ ] User authentication and multi-user support
- [ ] Email notifications for bookings and reminders
- [ ] Rescheduling flow for attendees
- [ ] Buffer times between meetings
- [ ] Custom invitee questions
- [ ] Calendar integrations (Google Calendar, Outlook)
- [ ] Payment integration for paid consultations
- [ ] Team scheduling and round-robin assignment
- [ ] Analytics and reporting dashboard
- [ ] Custom branding and white-labeling
- [ ] Recurring meeting templates
- [ ] Video conferencing integration (Zoom, Meet)

## 📝 Assumptions & Limitations

- **Single user system** - No authentication or multi-user support
- **No email notifications** - Bookings are confirmed but not emailed
- **No rescheduling** - Attendees can only cancel, not reschedule
- **UTC timezone** - All times stored in UTC, converted for display
- **Fixed duration** - Meeting duration matches event type exactly
- **No recurring meetings** - Each booking is independent

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.

---

**Happy Scheduling! 📅**
