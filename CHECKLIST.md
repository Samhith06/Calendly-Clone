# Pre-Launch Checklist

Use this checklist to verify everything is set up correctly before running the application.

## ✅ Backend Setup

- [ ] Python 3.9+ installed (`python --version`)
- [ ] Virtual environment created (`python -m venv venv`)
- [ ] Virtual environment activated
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] MySQL database created (`CREATE DATABASE calendly_db;`)
- [ ] `.env` file created in `backend/` directory
- [ ] `.env` file contains correct `DATABASE_URL`
- [ ] Database tables created (`python database/seed.py` runs successfully)
- [ ] Sample data seeded (check for success message)

## ✅ Frontend Setup

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Dependencies installed (`npm install` in `frontend/` directory)
- [ ] No npm errors during installation
- [ ] `vite.config.js` exists and is configured
- [ ] `tailwind.config.js` exists and is configured
- [ ] `postcss.config.js` exists

## ✅ Configuration

- [ ] Backend `.env` file configured with MySQL credentials
- [ ] Frontend `.env` file created (optional, for custom API URL)
- [ ] CORS settings in `backend/main.py` include frontend URL
- [ ] Database connection string is correct

## ✅ File Structure

- [ ] `backend/main.py` exists
- [ ] `backend/app/api/` contains all API files
- [ ] `backend/app/models/` contains all model files
- [ ] `backend/database/seed.py` exists
- [ ] `frontend/src/App.jsx` exists
- [ ] `frontend/src/main.jsx` exists
- [ ] `frontend/src/components/` contains component files
- [ ] `frontend/src/pages/` contains page files
- [ ] `frontend/src/lib/api.js` exists

## ✅ Testing

- [ ] Backend starts without errors (`uvicorn main:app --reload`)
- [ ] Backend API accessible at `http://localhost:8000`
- [ ] API docs accessible at `http://localhost:8000/docs`
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Frontend accessible at `http://localhost:5173`
- [ ] No console errors in browser
- [ ] Admin dashboard loads
- [ ] Event types page loads
- [ ] Can create an event type
- [ ] Can set availability
- [ ] Public booking page loads (`/book/{slug}`)
- [ ] Can select date and time slot
- [ ] Can create a booking
- [ ] Meetings page shows bookings

## ✅ Functionality Tests

### Event Types
- [ ] Create new event type
- [ ] Edit existing event type
- [ ] Delete event type
- [ ] View event type list
- [ ] Slug is unique

### Availability
- [ ] Select event type
- [ ] Toggle days of week
- [ ] Set start/end times
- [ ] Change timezone
- [ ] Save availability

### Booking Flow
- [ ] Navigate to booking page with valid slug
- [ ] Calendar displays correctly
- [ ] Can select a date
- [ ] Available time slots display
- [ ] Can select a time slot
- [ ] Booking form appears
- [ ] Can submit booking with name/email
- [ ] Confirmation page shows after booking
- [ ] Double-booking prevented

### Meetings
- [ ] Upcoming meetings tab works
- [ ] Past meetings tab works
- [ ] Can cancel a meeting
- [ ] Meeting status updates correctly

## 🚨 Common Issues

If something doesn't work, check:

1. **Backend won't start**
   - MySQL is running
   - Database exists
   - `.env` file is correct
   - Port 8000 is not in use

2. **Frontend won't start**
   - Node modules installed
   - Port 5173 is not in use
   - No syntax errors in JSX files

3. **API connection fails**
   - Backend is running
   - CORS is configured
   - API URL is correct
   - Check browser console for errors

4. **Database errors**
   - MySQL is running
   - Database exists
   - Credentials are correct
   - Tables were created (run seed.py)

5. **Styling issues**
   - Tailwind is configured
   - `index.css` imports Tailwind
   - PostCSS is configured

## 📝 Notes

- Keep backend and frontend running in separate terminals
- Check terminal output for errors
- Use browser developer tools to debug
- API documentation available at `/docs` endpoint

## 🎉 Ready to Launch!

Once all items are checked, your Calendly Clone is ready to use!
