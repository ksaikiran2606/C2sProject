# 🚀 Quick PostgreSQL Setup (10,000 Users)

## Prerequisites
- PostgreSQL installed on your system
- Database `marketplace_db` created

---

## Quick Setup Steps

### 1️⃣ Install PostgreSQL (if not installed)
- Download: https://www.postgresql.org/download/windows/
- Install with default settings
- **Remember your postgres user password!**

### 2️⃣ Create Database

**Using pgAdmin (Easiest):**
1. Open **pgAdmin**
2. Connect to PostgreSQL server
3. Right-click **Databases** → **Create** → **Database**
4. Name: `marketplace_db`
5. Click **Save**

**OR Using Command Line:**
```bash
psql -U postgres
# Enter your password
CREATE DATABASE marketplace_db;
\q
```

### 3️⃣ Create `.env` File

```bash
cd backend
copy .env.example .env
```

Then edit `.env` and set:
```env
USE_POSTGRES=True
DB_NAME=marketplace_db
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
DB_HOST=localhost
DB_PORT=5432
```

### 4️⃣ Test Connection

```bash
cd backend
.\venv\Scripts\Activate.ps1
python setup_postgresql.py
```

### 5️⃣ Run Migrations

```bash
python manage.py migrate
```

### 6️⃣ Create Superuser

```bash
python manage.py createsuperuser
```

### 7️⃣ Load Categories

```bash
python create_categories.py
```

### 8️⃣ Start Server

```bash
python manage.py runserver
```

---

## ✅ Verification

Check if it's working:
```bash
python manage.py dbshell
```

You should see: `marketplace_db=#`

Type `\q` to exit.

---

## 🎯 That's It!

Your app is now using PostgreSQL and ready for 10,000+ users!

---

## Need Help?

See `POSTGRESQL_SETUP_GUIDE.md` for detailed instructions.


