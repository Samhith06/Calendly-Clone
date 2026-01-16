# Quick Start Guide

Get the Calendly Clone running in 5 minutes!

## Prerequisites Check

- [ ] Node.js installed (`node --version` should show v18+)
- [ ] Python installed (`python --version` should show v3.9+)
- [ ] MySQL installed and running

## Quick Setup

### 1. Database Setup (2 minutes)

```sql
-- Open MySQL and run:
CREATE DATABASE calendly_db;
```

### 2. Backend Setup (2 minutes)

```bash
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Create .env file
# Copy env.example and update with your MySQL credentials
copy env.example .env
# Then edit .env with your MySQL username/password

# Initialize database
python database/seed.py

# Start server
uvicorn main:app --reload
```

Backend running at: http://localhost:8000

### 3. Frontend Setup (1 minute)

```bash
# In a new terminal
cd frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

Frontend running at: http://localhost:5173

## Test It Out!

1. **Admin Dashboard**: http://localhost:5173
2. **Public Booking**: http://localhost:5173/book/30min-meeting
   (Use any slug from your event types)

## Default Sample Data

After running `python database/seed.py`, you'll have:

- **3 Event Types**:
  - 30 Minute Meeting (slug: `30min-meeting`)
  - 1 Hour Consultation (slug: `1hour-consultation`)
  - 15 Minute Quick Chat (slug: `15min-quick-chat`)

- **Availability**: Set for weekdays with various time ranges

- **Sample Meetings**: A few upcoming and past meetings

## Troubleshooting

**Backend won't start?**
- Check MySQL is running
- Verify `.env` file has correct DATABASE_URL
- Make sure database `calendly_db` exists

**Frontend won't start?**
- Run `npm install` again
- Check Node.js version: `node --version`

**Can't connect to API?**
- Verify backend is running on port 8000
- Check browser console for CORS errors
- Verify `VITE_API_URL` in frontend `.env` (if set)

## Next Steps

- Create your own event types
- Set custom availability schedules
- Test the booking flow
- Customize the UI to match your brand

For detailed setup, see [SETUP_GUIDE.md](SETUP_GUIDE.md)
