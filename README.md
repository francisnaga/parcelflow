# ParcelFlow - Premium Parcel Tracking Platform

A modern, production-ready parcel tracking web application built with Next.js 15, Supabase, and Framer Motion. Features real-time tracking, admin dashboard, and automated email notifications.

## Features

### Public Website
- **Modern Landing Page** - Hero section, features, benefits, and FAQ
- **Real-Time Tracking** - Enter tracking ID to get live parcel status
- **Beautiful Timeline** - Visual tracking history with status updates
- **Responsive Design** - Mobile-first, fully responsive across all devices
- **Dark/Light Mode** - Theme toggle for user preference

### Admin Dashboard
- **Secure Authentication** - Demo credentials: admin@parcelflow.com / password123
- **Parcel Management** - Create, read, update, and delete parcels
- **Tracking Updates** - Add status updates with location and description
- **Statistics Dashboard** - Quick overview of total, pending, in-transit, and delivered parcels
- **Email Notifications** - Automatic emails to receivers on parcel creation and updates

### Technical Features
- Auto-generated tracking IDs (PF-XXXXX-XXX format)
- Real-time email notifications via Resend
- Database schema with Supabase PostgreSQL
- Form validation with Zod and React Hook Form
- Loading states and error handling
- Smooth animations with Framer Motion
- Production-ready security and performance

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS 4, custom design tokens
- **Database**: Supabase PostgreSQL
- **Auth**: Token-based admin authentication
- **Email**: Resend (configured, ready for API key)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- Resend account (optional, for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd parcelflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   RESEND_API_KEY=your_resend_api_key (optional)
   ```

4. **Initialize the database**
   
   Option A: Manual SQL (Recommended)
   - Go to your Supabase dashboard
   - Open SQL Editor
   - Copy and paste the schema from `scripts/init-db.js`
   - Execute the queries
   
   Option B: Using script
   ```bash
   node --env-file-if-exists=.env.local scripts/init-db.js
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Visit http://localhost:3000

## Database Schema

### Tables

**admins**
- `id` (UUID, PK)
- `email` (VARCHAR, unique)
- `password_hash` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

**parcels**
- `id` (UUID, PK)
- `tracking_id` (VARCHAR, unique)
- `sender_name`, `sender_email` (VARCHAR)
- `receiver_name`, `receiver_email`, `receiver_phone` (VARCHAR)
- `origin`, `destination` (VARCHAR)
- `estimated_delivery_date` (TIMESTAMP)
- `current_status` (VARCHAR)
- `current_location` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

**tracking_updates**
- `id` (UUID, PK)
- `parcel_id` (UUID, FK)
- `status` (VARCHAR)
- `location` (VARCHAR)
- `description` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

## API Routes

### Public
- `GET /track?id=TRACKING_ID` - Track parcel

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/parcels` - List all parcels
- `POST /api/admin/parcels` - Create parcel
- `GET /api/admin/parcels/[id]` - Get parcel details
- `PUT /api/admin/parcels/[id]` - Update parcel
- `DELETE /api/admin/parcels/[id]` - Delete parcel
- `POST /api/admin/tracking-updates` - Add tracking update

### Email
- `POST /api/email/send-parcel-email` - Send initial parcel email
- `POST /api/email/send-update-email` - Send tracking update email

## Demo Credentials

- **Email**: admin@parcelflow.com
- **Password**: password123

## Project Structure

```
app/
├── page.tsx                 # Home/Landing page
├── track/                   # Public tracking page
├── admin/
│   ├── page.tsx            # Admin login
│   └── dashboard/          # Admin dashboard
│       ├── page.tsx        # Main dashboard
│       ├── create/         # Create parcel page
│       └── edit/           # Edit parcel page
├── api/
│   ├── admin/              # Admin APIs
│   └── email/              # Email APIs
└── layout.tsx              # Root layout with theme

components/
├── navbar.tsx              # Navigation bar
├── footer.tsx              # Footer
├── theme-provider.tsx      # Dark mode provider
├── theme-toggle.tsx        # Theme toggle button
├── sections/
│   ├── hero.tsx           # Hero section
│   ├── features.tsx       # Features section
│   ├── why-choose-us.tsx  # Benefits section
│   ├── faq.tsx            # FAQ section
│   └── contact.tsx        # Contact section
└── ui/                     # UI components
    ├── button.tsx
    ├── input.tsx
    └── textarea.tsx

lib/
├── db.ts                   # Supabase client
├── utils.ts                # Utility functions
├── types.ts                # TypeScript types
├── schemas.ts              # Zod validation schemas
└── email.ts                # Email templates
```

## Customization

### Branding
- Update logo and company name in `components/navbar.tsx`
- Modify theme colors in `app/globals.css`
- Change email templates in `lib/email.ts`

### Features
- Add more parcel statuses in `lib/schemas.ts`
- Create new dashboard pages in `app/admin/dashboard/`
- Add more tracking fields in the database schema

## Production Deployment

1. **Vercel Deployment**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Environment Variables**
   - Add all `.env.local` variables to Vercel project settings

3. **Database**
   - Ensure Supabase project is configured
   - Database schema is migrated

4. **Email (Optional)**
   - Add Resend API key for production emails
   - Update email sender domain in templates

## Security Notes

- Demo credentials are hardcoded for testing (remove in production)
- Implement proper authentication with bcrypt password hashing
- Add Row Level Security (RLS) policies to Supabase
- Validate all API inputs with Zod
- Use environment variables for sensitive data

## Future Enhancements

- [ ] OAuth integration (Google, GitHub)
- [ ] SMS notifications
- [ ] Bulk parcel upload via CSV
- [ ] Advanced analytics dashboard
- [ ] Integration with shipping providers API
- [ ] Multi-user admin accounts
- [ ] Payment integration for premium features
- [ ] Mobile app (React Native)

## License

MIT

## Support

For issues or questions, please contact support@parcelflow.com

---

Built with Next.js, Supabase, and Tailwind CSS. Inspired by Stripe, Linear, Vercel, and DHL.
