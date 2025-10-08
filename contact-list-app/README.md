# Contact Manager - Setup Guide

A modern contact management web application built with Next.js, Supabase, and shadcn/ui.

## Features

- ✅ Full CRUD operations for contacts
- 🔐 User authentication with Supabase
- 🎨 Beautiful UI with shadcn/ui components
- 🌓 Dark/Light theme support
- 📱 Responsive design
- 🔒 Row-level security with Supabase RLS

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (this may take a few minutes)
3. Once ready, go to **Project Settings** → **API**
4. Copy the following values:
   - Project URL
   - anon public key

### 3. Configure Environment Variables

1. Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Database Migrations

1. In your Supabase project dashboard, go to the **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to execute the SQL

This will:

- Create the `contacts` table
- Enable Row Level Security (RLS)
- Set up security policies

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
contact-list-app/
├── app/
│   ├── auth/              # Authentication pages
│   ├── contacts/          # Contact management pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── providers/         # Context providers
│   ├── ui/                # shadcn/ui components
│   └── *.tsx              # Custom components
├── lib/
│   ├── supabase/          # Supabase client setup
│   └── utils.ts           # Utility functions
├── supabase/
│   └── schema.sql         # Database schema
└── memory-bank/           # Project documentation
```

## Usage

1. **Sign Up**: Create a new account at `/auth/signup`
2. **Login**: Sign in at `/auth/login`
3. **View Contacts**: Browse all your contacts at `/contacts`
4. **Add Contact**: Click "Add Contact" to create a new contact
5. **Edit Contact**: Click on a contact to edit its details
6. **Delete Contact**: Remove a contact with the delete button

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database & Auth**: Supabase
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **State Management**: SWR for data fetching

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

This project is ready to deploy on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your environment variables in Vercel's project settings
4. Deploy!

## License

MIT
