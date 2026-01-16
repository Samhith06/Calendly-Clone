# Setup Guide

Follow these steps to get the Calendly Clone application running.

## Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://www.python.org/downloads/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)

## Step 1: Database Setup

1. Start your MySQL server
2. Create a new database:
```sql
CREATE DATABASE calendly_db;
```

3. Note your MySQL credentials (username, password, host, port)

## Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - **Windows**: `venv\Scripts\activate`
   - **Linux/Mac**: `source venv/bin/activate`

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file in the backend directory:
```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/calendly_db
SECRET_KEY=your-secret-key-here-change-this-in-production
```

Replace `username`, `password`, and adjust `localhost:3306` if needed.

6. Initialize the database and seed sample data:
```bash
python database/seed.py
```

This will:
- Create all database tables
- Insert sample event types
- Insert sample availability schedules
- Insert sample meetings

7. Start the FastAPI server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

## Step 3: Frontend Setup

1. Navigate to the frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file if you need to change the API URL:
```env
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Step 4: Access the Application

### Admin Interface
- Navigate to: `http://localhost:5173`
- You'll see the Dashboard with links to:
  - Event Types
  - Availability Settings
  - Meetings

### Public Booking Page
- Navigate to: `http://localhost:5173/book/{slug}`
- Example: `http://localhost:5173/book/30min-meeting`
- Use the slug from any event type you've created

## Troubleshooting

### Backend Issues

**Database Connection Error**
- Verify MySQL is running
- Check your `.env` file has the correct DATABASE_URL
- Ensure the database `calendly_db` exists
- Verify username/password are correct

**Import Errors**
- Make sure you're running commands from the `backend` directory
- Verify all dependencies are installed: `pip list`

**Port Already in Use**
- Change the port: `uvicorn main:app --reload --port 8001`

### Frontend Issues

**API Connection Error**
- Verify the backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify `VITE_API_URL` in frontend `.env` if you set one

**Build Errors**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version: `node --version` (should be v18+)

**Styling Not Working**
- Verify Tailwind CSS is configured correctly
- Check `tailwind.config.js` and `postcss.config.js` exist
- Restart the dev server

## Testing the Application

1. **Create an Event Type**:
   - Go to Event Types page
   - Click "+ New Event Type"
   - Fill in name, duration, and slug
   - Save

2. **Set Availability**:
   - Go to Availability page
   - Select the event type
   - Check days of the week
   - Set start/end times for each day
   - Select timezone

3. **Test Booking**:
   - Copy the booking URL (e.g., `/book/your-slug`)
   - Open it in a new tab/incognito window
   - Select a date
   - Select a time slot
   - Fill in name and email
   - Confirm booking

4. **View Meetings**:
   - Go to Meetings page
   - See upcoming and past meetings
   - Test canceling a meeting

## Production Deployment

### Backend
- Use a production ASGI server like Gunicorn with Uvicorn workers
- Set up proper environment variables
- Use a production database
- Enable HTTPS
- Configure proper CORS origins

### Frontend
- Build for production: `npm run build`
- Deploy the `dist` folder to a static host (Vercel, Netlify, etc.)
- Update `VITE_API_URL` to point to your production API

## Next Steps

- Add authentication (currently assumes single user)
- Add email notifications
- Implement rescheduling
- Add buffer times
- Custom invitee questions
- Multiple availability schedules
