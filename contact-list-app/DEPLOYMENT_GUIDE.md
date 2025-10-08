# 🚀 Vercel Deployment Guide

## Phase 2: Deployment Instructions

This guide will walk you through deploying your Contact Manager app to Vercel.

---

## Prerequisites

✅ Code pushed to GitHub: `https://github.com/Zioraan/practice.git`  
✅ Supabase project created: `contact-manager-app`  
✅ Production build tested locally

---

## Step-by-Step Deployment

### 1. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find and select your repository: **`Zioraan/practice`**
4. Click **"Import"**

### 2. Configure Project Settings

When prompted, configure these settings:

**Framework Preset:** Next.js (should auto-detect)

**Root Directory:** `contact-list-app`  
⚠️ **IMPORTANT**: Click **"Edit"** and set this to `contact-list-app` since your app is in a subdirectory

**Build Command:** `npm run build` (default is fine)

**Output Directory:** `.next` (default is fine)

**Install Command:** `npm install` (default is fine)

### 3. Add Environment Variables

Before deploying, you MUST add your Supabase credentials:

Click **"Environment Variables"** and add:

#### Variable 1:

- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://knrppqppafmuyvtbvhli.supabase.co`
- **Environments:** Production, Preview, Development (select all)

#### Variable 2:

- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtucnBwcXBwYWZtdXl2dGJ2aGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjE4ODUsImV4cCI6MjA3NTQ5Nzg4NX0.Vs-fHYVKgjBBpmX4a8WzGYo4OvtLKagzueBV1rCOAlQ`
- **Environments:** Production, Preview, Development (select all)

### 4. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (~2-3 minutes)
3. Once deployed, you'll get a URL like: `https://your-app.vercel.app`

---

## Post-Deployment Verification

### Phase 2: Smoke Testing Checklist

After deployment, test these features:

#### ✅ Authentication

- [ ] Visit your deployed URL
- [ ] Click "Sign Up" and create a test account
- [ ] Verify you receive the signup confirmation
- [ ] Sign in with your new account
- [ ] Verify redirect to `/contacts` page

#### ✅ CRUD Operations

- [ ] **Create**: Add a new contact with all fields
- [ ] **Read**: Verify the contact appears in the list
- [ ] **Read**: Click on a contact to view details
- [ ] **Update**: Click "Edit" and modify the contact
- [ ] **Update**: Verify changes are saved
- [ ] **Delete**: Delete a contact with confirmation
- [ ] **Delete**: Verify contact is removed

#### ✅ Search & Filter

- [ ] Use the search bar to find contacts by name
- [ ] Search by email
- [ ] Search by company
- [ ] Verify results update in real-time

#### ✅ UI/UX

- [ ] Test dark/light theme toggle
- [ ] Verify theme persists on page refresh
- [ ] Test on mobile device (responsive design)
- [ ] Check all buttons and links work
- [ ] Verify loading states appear correctly

#### ✅ Security

- [ ] Log out
- [ ] Try to access `/contacts` without authentication
- [ ] Verify redirect to login page
- [ ] Create a second test account
- [ ] Verify you can only see your own contacts (not the first account's)

---

## Troubleshooting

### Build Fails

- Check that `contact-list-app` is set as the Root Directory
- Verify all environment variables are added correctly
- Check the build logs for specific errors

### "Invalid API Key" Error

- Verify environment variables are copied exactly (no extra spaces)
- Make sure both variables are set for all environments
- Redeploy after adding/fixing environment variables

### Authentication Not Working

- Check Supabase project is active (not paused)
- Verify the Supabase URL and key match your project
- Check browser console for specific error messages

### Can't See Contacts

- Verify you're logged in with the correct account
- Check Row Level Security policies in Supabase dashboard
- Look at Network tab to see if API calls are succeeding

---

## Vercel Dashboard Features

After deployment, you can:

- **View Deployments**: See all your deployments and their status
- **Analytics**: Monitor page views and performance
- **Logs**: View runtime and build logs
- **Domains**: Add custom domains to your project
- **Environment Variables**: Update credentials without redeploying

---

## Continuous Deployment

Your app is now set up for continuous deployment!

**What this means:**

- Every time you push to the `main` branch on GitHub
- Vercel automatically builds and deploys your changes
- You'll get a new production deployment with the latest code

**Preview Deployments:**

- Pull requests get their own preview URLs
- Test changes before merging to main

---

## Production URL

After successful deployment, your Contact Manager will be live at:

🌐 **`https://[your-project-name].vercel.app`**

Share this URL with others to let them use your Contact Manager!

---

## Phase 2 Complete! 🎉

Once you've completed all the smoke tests, Phase 2 is done!

### What's Next?

**Phase 3: Post-MVP Enhancements** (Optional)

- Add contact grouping/tagging
- Implement CSV import/export
- Enhanced theming options
- Performance optimizations
- Additional features as needed

---

## Support

If you encounter any issues:

1. Check the Vercel build logs
2. Check the browser console for errors
3. Verify environment variables are set correctly
4. Check Supabase dashboard for database/auth issues

Happy deploying! 🚀
