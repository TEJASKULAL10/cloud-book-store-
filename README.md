# Cloud-Based Book Storing System (Supabase)

A simple web app where users can register, log in, upload books (PDF, DOC, DOCX, EPUB), store them in the cloud, search, view, download, and delete them.

Built with **React + Supabase (Auth + PostgreSQL Database + Storage)**. No separate backend and no credit card required.

---

## Features

- **Authentication**: Register, login, and logout (Email + Password powered by Supabase Auth).
- **Book Management**: Upload books with title, author, category, and description (up to 20 MB).
- **Progress Tracking**: Real-time upload progress bar.
- **Dashboard**: Total book count summary.
- **My Books**: Dedicated page with search (by title, author, category).
- **Details & Preview**: View details, open PDFs in browser, download any book.
- **Delete**: Safely removes the file from Supabase Storage and the record from Supabase PostgreSQL Database.
- **Security**: Row Level Security (RLS) ensures users can only view, upload, and delete their own books.
- **Responsive Layout**: Designed for desktop, tablet, and mobile.

---

## Technology Stack

- **Frontend**: React 18, React Router v6, JavaScript (ES6+), CSS3, Vite
- **Backend / Cloud Services**: Supabase
  - **Supabase Auth**: User registration & session management
  - **Supabase PostgreSQL Database**: Storing book metadata (`books` table)
  - **Supabase Storage**: Storing actual book files (`books` bucket)

---

## Project Structure

```text
src/
  components/   Navbar, BookCard, ProtectedRoute, Loading
  context/      AuthContext.jsx (Supabase session listener)
  pages/        Home, Login, Register, Dashboard, UploadBook, MyBooks, BookDetails
  services/     authService.js, bookService.js, storageService.js, errorMessages.js
  supabase/     supabaseClient.js (Supabase SDK initialization)
supabase-setup.sql  Complete SQL script for database tables, RLS policies, and storage
```

---

## Steps to Setup & Run the Project

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/sign in (Free plan, no credit card required).
2. Click **New Project**, choose a project name (e.g., `cloud-book-store`), set a strong database password, and choose a region close to you.
3. Wait a minute for the project to finish provisioning.

---

### Step 2: Create Storage Bucket and Database Tables

1. In your Supabase Dashboard, go to **Storage** (folder icon on the left menu).
2. Click **New Bucket**, enter the name `books`, enable **Public bucket**, and click **Save**.
3. Go to **SQL Editor** (terminal icon on the left menu).
4. Click **New query**, paste the entire contents of `supabase-setup.sql` (found in the root directory of this project), and click **Run**.

---

### Step 3: Configure Environment Variables

1. In your Supabase Dashboard, go to **Project Settings > API**.
2. Copy your **Project URL** and the **anon public** API key.
3. Open the `.env` file in your project root directory and update it:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_SUPABASE_BUCKET=books
```

---

### Step 4: Install Dependencies & Start the Application

Open your terminal in the project root directory and run:

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

 Open the local web address shown in your terminal (usually `http://localhost:5173`).

---

### Step 5: (Optional) Build for Production

To test or build the production bundle:

```bash
npm run build
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "Storage is not configured" or network error | Verify `.env` contains valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then restart `npm run dev`. |
| "relation public.books does not exist" | You haven't run `supabase-setup.sql` in Supabase SQL Editor. Run the SQL script to create the table. |
| Upload fails or says permission denied | Ensure the `books` bucket is set to **Public** in Supabase Storage and storage policies from `supabase-setup.sql` were executed. |
| Password error on registration | Supabase Auth requires passwords to be at least 6 characters. |
