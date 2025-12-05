# 🐘 PostgreSQL Setup - Step by Step

## ✅ Step 1: Install PostgreSQL (if not installed)

1. **Download PostgreSQL:**
   - Go to: https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Download **PostgreSQL 15 or 16** (latest)

2. **Install:**
   - Run the installer
   - **Remember the password** you set for `postgres` user!
   - Keep default port: `5432`
   - Complete installation

3. **Verify Installation:**
   ```bash
   psql --version
   ```

---

## ✅ Step 2: Create Database

### Option A: Using pgAdmin (Easiest) ⭐

1. Open **pgAdmin** (installed with PostgreSQL)
2. Enter your PostgreSQL password when prompted
3. Expand **Servers** → **PostgreSQL 15** (or your version)
4. Right-click **Databases** → **Create** → **Database**
5. **Database name:** `marketplace_db`
6. **Owner:** `postgres`
7. Click **Save**

### Option B: Using Command Line

1. Open **Command Prompt** or **PowerShell**
2. Run:
   ```bash
   psql -U postgres
   ```
3. Enter your PostgreSQL password
4. Run:
   ```sql
   CREATE DATABASE marketplace_db;
   ```
5. Exit: Type `\q` and press Enter

---

## ✅ Step 3: Create `.env` File

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Copy template:**
   ```bash
   Copy-Item env.template .env
   ```

3. **Edit `.env` file** (use Notepad or any editor):
   ```env
   USE_POSTGRES=True
   DB_NAME=marketplace_db
   DB_USER=postgres
   DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
   DB_HOST=localhost
   DB_PORT=5432
   ```
   
   **⚠️ IMPORTANT:** Replace `YOUR_POSTGRES_PASSWORD_HERE` with your actual PostgreSQL password!

---

## ✅ Step 4: Test Connection

```bash
cd backend
.\venv\Scripts\Activate.ps1
python setup_postgresql.py
```

**Expected output:**
```
[OK] Connected to PostgreSQL!
[OK] Using database: marketplace_db
```

---

## ✅ Step 5: Run Migrations

```bash
python manage.py migrate
```

This creates all tables in PostgreSQL.

---

## ✅ Step 6: Create Superuser

```bash
python manage.py createsuperuser
```

Enter:
- Username: `admin` (or your choice)
- Email: `admin@example.com`
- Password: (choose a strong password)

---

## ✅ Step 7: Load Categories

```bash
python create_categories.py
```

---

## ✅ Step 8: Start Server

```bash
python manage.py runserver
```

---

## 🎉 Done!

Your app is now using PostgreSQL and ready for 10,000+ users!

---

## ❌ Troubleshooting

### Error: "password authentication failed"
- Check your password in `.env` file
- Make sure it matches your PostgreSQL password

### Error: "database does not exist"
- Create the database first (Step 2)

### Error: "could not connect to server"
- Make sure PostgreSQL service is running
- Check if port 5432 is correct

### Check PostgreSQL Service:
```bash
Get-Service -Name postgresql*
```

If stopped, start it:
```bash
Start-Service postgresql-x64-15
```
(Replace `15` with your PostgreSQL version)

---

**Follow these steps one by one!** 🚀


