# Database Setup Instructions

## Supabase Setup

You've added the Supabase environment variables, now you need to set up the database schema. Follow these steps:

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the URL and anon key to your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL=your_supabase_url`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`

### 2. Set Up Database Schema
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `scripts/setup-database.sql` in your SQL editor

This will create:
- `profiles` table for user information
- `patterns` table for saved crochet patterns
- Row Level Security (RLS) policies
- Proper indexes for performance

### 3. Authentication Setup
The NextAuth integration is already configured to automatically create user profiles when users sign in with Google.

### 4. Environment Variables Required
Make sure you have these environment variables set up:

```env
# NextAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_postgres_connection_string
DIRECT_URL=your_postgres_direct_connection_string
```

## Features Implemented

### ✅ User Profile Page
- View and edit user profile information
- Display saved patterns
- Edit/delete patterns
- Profile creation date and statistics

### ✅ Save Functionality in Create Page
- Save button in the create page header
- Save dialog with title, description, and public/private settings
- Integration with Supabase database
- Real-time pattern saving

### ✅ API Routes
- `/api/profile` - GET/PUT user profile
- `/api/patterns` - GET/POST user patterns
- `/api/patterns/[id]` - GET/PUT/DELETE specific patterns
- Proper authentication and authorization

### ✅ Database Schema
- User profiles with authentication integration
- Pattern storage with user ownership
- Row Level Security for data protection
- Public/private pattern visibility

## Usage

1. **Profile Page**: Visit `/profile` to view your profile and saved patterns
2. **Save Patterns**: In the create page, click the "Save" button in the header to save your pattern
3. **Manage Patterns**: Edit or delete patterns from your profile page
4. **Public Patterns**: Make patterns public to share with others

## Next Steps

You may want to add:
- Toast notifications for save success/error
- Pattern loading from URL parameters
- Pattern sharing features
- Search and filtering in profile page
- Export patterns in different formats 