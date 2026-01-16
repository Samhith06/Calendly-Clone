# 🚀 Start Here - Calendly Clone Setup

Welcome! Follow these steps to get your Calendly Clone up and running.

## ✅ Prerequisites Check

- ✅ Python 3.13.5 installed
- ✅ Node.js v22.17.0 installed
- ⚠️ **MySQL** - Please ensure MySQL is installed and running

## 📋 Quick Setup Steps

### Step 1: Create MySQL Database

Open MySQL (command line, MySQL Workbench, or phpMyAdmin) and run:

```sql
CREATE DATABASE calendly_db;
```

**Note:** If you want a different database name, remember it for Step 2.

### Step 2: Configure Backend Environment

1. Navigate to the backend directory:
```bash
cd backend
```

2. Activate the virtual environment (if not already active):
```bash
.\venv\Scripts\Activate.ps1
```

3. Create the `.env` file using the helper script:
```bash
python create_env.py
```

Or manually create a `.env` file with:
```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/calendly_db
SECRET_KEY=your-secret-key-here
```

**Replace:**
- `username` - Your MySQL username (usually `root`)
- `password` - Your MySQL password
- `localhost:3306` - Your MySQL host and port (if different)

### Step 3: Initialize Database

With the virtual environment activated and `.env` file created:

```bash
python database/seed.py
```

This will:
- Create all database tables
- Insert sample event types
- Insert sample availability schedules
- Insert sample meetings

**Expected output:** "Database seeded successfully!"

### Step 4: Start Backend Server

```bash
uvicorn main:app --reload
```

**Expected output:** 
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

✅ Backend is now running at: **http://localhost:8000**
- API Docs: http://localhost:8000/docs

### Step 5: Start Frontend Server

Open a **new terminal window** and:

```bash
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

✅ Frontend is now running at: **http://localhost:5173**

## 🎉 You're Ready!

### Access Points:

1. **Admin Dashboard**: http://localhost:5173
   - Manage event types
   - Set availability
   - View meetings

2. **Public Booking Page**: http://localhost:5173/book/30min-meeting
   - Try booking a meeting!
   - Use any slug from your event types

3. **API Documentation**: http://localhost:8000/docs
   - Interactive API testing
   - View all endpoints

## 🧪 Test the Application

1. **View Event Types**: Go to http://localhost:5173/event-types
2. **Set Availability**: Go to http://localhost:5173/availability
3. **Book a Meeting**: Go to http://localhost:5173/book/30min-meeting
4. **View Meetings**: Go to http://localhost:5173/meetings

## 🐛 Troubleshooting

### Backend Issues

**"Module not found" errors:**
```bash
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Database connection errors:**
- Verify MySQL is running
- Check `.env` file has correct credentials
- Ensure database `calendly_db` exists
- Test connection: `mysql -u username -p`

**Port 8000 already in use:**
```bash
uvicorn main:app --reload --port 8001
```
Then update frontend `.env` with `VITE_API_URL=http://localhost:8001`

### Frontend Issues

**"Cannot find module" errors:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**API connection errors:**
- Verify backend is running
- Check browser console for CORS errors
- Verify `VITE_API_URL` in frontend `.env` (if set)

## 📚 Additional Resources

- **Detailed Setup**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Quick Reference**: See [QUICK_START.md](QUICK_START.md)
- **Project Summary**: See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## 🎯 Next Steps After Setup

1. Create your own event types
2. Customize availability schedules
3. Test the booking flow
4. Explore the API documentation
5. Customize the UI to match your brand

---

**Need Help?** Check the troubleshooting section or review the detailed setup guide.

Happy coding! 🚀
