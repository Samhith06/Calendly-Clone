# MySQL Database Setup Guide

## Method 1: MySQL Command Line (Easiest)

### Step 1: Open MySQL Command Line

**Option A - If MySQL is in your PATH:**
```bash
mysql -u root -p
```

**Option B - Using MySQL Command Line Client:**
1. Press `Windows Key`
2. Type "MySQL Command Line Client"
3. Click on it
4. Enter your MySQL root password when prompted

**Option C - Navigate to MySQL bin directory:**
```bash
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql.exe -u root -p
```

### Step 2: Create the Database

Once you're in the MySQL prompt (you'll see `mysql>`), type:

```sql
CREATE DATABASE calendly_db;
```

Press Enter. You should see:
```
Query OK, 1 row affected (0.01 sec)
```

### Step 3: Verify Database Created

```sql
SHOW DATABASES;
```

You should see `calendly_db` in the list.

### Step 4: Exit MySQL

```sql
EXIT;
```

---

## Method 2: MySQL Workbench (GUI)

### Step 1: Open MySQL Workbench

1. Launch MySQL Workbench
2. Connect to your MySQL server (click on a connection or create a new one)
3. Enter your password if prompted

### Step 2: Create Database

1. Click on the **"Schemas"** tab in the left sidebar (or press `Ctrl+Alt+S`)
2. Right-click in the schemas area
3. Select **"Create Schema..."**
4. In the "Schema Name" field, enter: `calendly_db`
5. Click **"Apply"**
6. Click **"Finish"**

### Step 3: Verify

You should now see `calendly_db` in your schemas list.

---

## Method 3: phpMyAdmin (Web Interface)

### Step 1: Open phpMyAdmin

1. Open your web browser
2. Navigate to `http://localhost/phpmyadmin` (or your phpMyAdmin URL)
3. Log in with your MySQL credentials

### Step 2: Create Database

1. Click on the **"Databases"** tab at the top
2. In the "Create database" section:
   - Enter database name: `calendly_db`
   - Select collation: `utf8mb4_unicode_ci` (or leave default)
3. Click **"Create"**

### Step 3: Verify

You should see `calendly_db` in the database list on the left sidebar.

---

## Method 4: Using a SQL File

### Step 1: Create SQL File

Create a file named `create_database.sql` with:

```sql
CREATE DATABASE IF NOT EXISTS calendly_db;
```

### Step 2: Execute the File

**Command Line:**
```bash
mysql -u root -p < create_database.sql
```

**MySQL Workbench:**
1. File → Open SQL Script
2. Select `create_database.sql`
3. Click the Execute button (⚡)

---

## Troubleshooting

### "Access Denied" Error

**Problem:** You don't have permission to create databases.

**Solution:**
1. Make sure you're using the `root` user, or
2. Use a user with CREATE DATABASE privileges

**Grant permissions (if you're root):**
```sql
GRANT ALL PRIVILEGES ON calendly_db.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

### "Database Already Exists" Error

**Problem:** The database `calendly_db` already exists.

**Solutions:**

**Option 1 - Use existing database:**
Just use the existing database name in your `.env` file.

**Option 2 - Drop and recreate (⚠️ deletes all data):**
```sql
DROP DATABASE calendly_db;
CREATE DATABASE calendly_db;
```

**Option 3 - Use different name:**
```sql
CREATE DATABASE my_calendly_db;
```
Then use `my_calendly_db` in your `.env` file.

### "Can't Connect to MySQL Server" Error

**Problem:** MySQL service is not running.

**Solutions:**

**Windows:**
1. Press `Windows Key + R`
2. Type `services.msc` and press Enter
3. Find "MySQL80" (or similar)
4. Right-click → Start

**Command Line:**
```bash
net start MySQL80
```

**Or restart MySQL:**
```bash
net stop MySQL80
net start MySQL80
```

### "Command Not Found: mysql"

**Problem:** MySQL is not in your system PATH.

**Solutions:**

**Option 1 - Use full path:**
```bash
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

**Option 2 - Add to PATH:**
1. Add `C:\Program Files\MySQL\MySQL Server 8.0\bin` to your system PATH
2. Restart terminal

---

## Verification Checklist

After creating the database, verify:

- [ ] Database `calendly_db` exists
- [ ] You can connect to it
- [ ] You have proper permissions

**Test connection:**
```sql
USE calendly_db;
SHOW TABLES;
```

(Should show empty for now - tables will be created by seed script)

---

## Next Steps

Once the database is created:

1. ✅ Database created
2. ⏭️ Configure `.env` file (see [NEXT_STEPS.md](NEXT_STEPS.md))
3. ⏭️ Run seed script: `python database/seed.py`

---

## Quick Reference

**Create database:**
```sql
CREATE DATABASE calendly_db;
```

**Verify:**
```sql
SHOW DATABASES;
```

**Use database:**
```sql
USE calendly_db;
```

**Delete database (if needed):**
```sql
DROP DATABASE calendly_db;
```
