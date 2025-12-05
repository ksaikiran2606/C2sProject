# 🐘 PostgreSQL Setup Guide for Production

## Why PostgreSQL for 10,000 Users?
- ✅ Better performance with many concurrent users
- ✅ Advanced features (transactions, constraints, indexes)
- ✅ Better data integrity
- ✅ Scalable for production

---

## Step 1: Install PostgreSQL

### Download & Install:
1. Go to: https://www.postgresql.org/download/windows/
2. Download **PostgreSQL Installer** (latest version)
3. Run the installer
4. **Important:** Remember the password you set for `postgres` user!
5. Default port: `5432` (keep it)
6. Complete the installation

### Verify Installation:
Open **Command Prompt** or **PowerShell** and run:
```bash
psql --version
```

---

## Step 2: Create Database

### Option A: Using pgAdmin (GUI - Recommended)
1. Open **pgAdmin** (installed with PostgreSQL)
2. Connect to PostgreSQL server (use the password you set)
3. Right-click on **Databases** → **Create** → **Database**
4. Name: `marketplace_db`
5. Owner: `postgres`
6. Click **Save**

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
5. Exit: `\q`

---

## Step 3: Configure Backend

### Create `.env` file in `backend/` folder:
```env
# Database Configuration
USE_POSTGRES=True
DB_NAME=marketplace_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
DB_HOST=localhost
DB_PORT=5432

# Django Settings
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006
```

**⚠️ Important:** Replace `your_postgres_password_here` with your actual PostgreSQL password!

---

## Step 4: Install PostgreSQL Driver (if not installed)

The `psycopg2-binary` package should already be in requirements.txt, but verify:

```bash
cd backend
.\venv\Scripts\Activate.ps1
pip install psycopg2-binary
```

---

## Step 5: Run Migrations

```bash
cd backend
.\venv\Scripts\Activate.ps1
python manage.py migrate
```

This will create all tables in PostgreSQL.

---

## Step 6: Create Superuser

```bash
python manage.py createsuperuser
```

---

## Step 7: Test Connection

```bash
python manage.py dbshell
```

If you see `marketplace_db=#`, it's working! Type `\q` to exit.

---

## Step 8: Load Initial Data (Categories)

```bash
python create_categories.py
```

---

## Troubleshooting

### Error: "password authentication failed"
- Check your password in `.env` file
- Make sure PostgreSQL is running

### Error: "database does not exist"
- Create the database first (Step 2)

### Error: "could not connect to server"
- Make sure PostgreSQL service is running
- Check if port 5432 is correct

### Check PostgreSQL Service:
```bash
# Windows PowerShell
Get-Service -Name postgresql*
```

---

## Production Recommendations

1. **Create a dedicated database user** (not `postgres`):
   ```sql
   CREATE USER marketplace_user WITH PASSWORD 'strong_password';
   GRANT ALL PRIVILEGES ON DATABASE marketplace_db TO marketplace_user;
   ```

2. **Use environment variables** for sensitive data
3. **Enable SSL** for production connections
4. **Set up database backups**
5. **Monitor performance** with pgAdmin or similar tools

---

**Ready to set up? Follow the steps above!** 🚀


