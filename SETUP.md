# RentIntel Setup Guide

This guide walks you through setting up and deploying RentIntel from development to production.

## Quick Start (Development)

The development environment is already configured and ready to use:

### 1. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 2. Create Your First Account

1. Navigate to the home page
2. Click "Get Started Free"
3. Fill in your details:
   - Full name
   - Email address
   - Password (minimum 6 characters)
4. Click "Create account"

The system will:
- Create your user account
- Create an organization automatically
- Set you as the OWNER
- Redirect you to the dashboard

### 3. Add Your First Property

1. Navigate to "Properties" in the sidebar
2. Click "Add Property"
3. Fill in property details:
   - Address (e.g., "12 Main Street, Rosebank")
   - Region (Johannesburg, Cape Town, Durban, or Rosebank)
   - Property Type (apartment, house, townhouse)
   - Bedrooms, Bathrooms, Size in m²
   - Select amenities
   - Current Rent (in Rands)
   - Target Rent (in Rands)
   - Monthly Expenses (in Rands)
4. Click "Add Property"

### 4. Add a Tenant

1. Navigate to "Tenants" in the sidebar
2. Click "Add Tenant"
3. Fill in tenant details:
   - Full name
   - Email and phone (optional)
   - Lease start and end dates
   - Payment status
   - Last payment date (optional)
   - Risk score (0-100)
4. Click "Add Tenant"

### 5. Generate Insights

1. Navigate to "Insights" in the sidebar
2. Click "Refresh Insights"
3. The system will:
   - Analyze all your properties
   - Compare rents to market data
   - Calculate ROI for each property
   - Identify vacant properties
   - Generate actionable recommendations
4. View insights organized by severity (Critical, Warning, Info)

## Environment Variables

### Required Variables (Already Configured)

The following are already set in your `.env` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Optional Variables (For Enhanced Features)

Copy `.env.example` to `.env.local` and add these for full functionality:

```bash
# OpenAI (for enhanced AI insights)
OPENAI_API_KEY=sk-...

# Stripe (for payment processing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL (for webhooks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

### Current Status
✅ Database is already provisioned and configured
✅ All migrations have been applied
✅ Market data has been seeded

### Database Structure

The database includes:

**8 Core Tables**:
- `organizations` - Multi-tenant organizations
- `memberships` - User-organization relationships
- `properties` - Rental property records
- `tenants` - Tenant information
- `market_data` - Regional market statistics
- `insights` - AI-generated insights
- `reports` - Monthly reports
- `files` - Document storage metadata

**Security Features**:
- Row-Level Security (RLS) on all tables
- Organization-scoped data access
- Role-based permissions (OWNER, ADMIN, ANALYST, VIEWER)

### Viewing Database

You can view your database at:
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor

## Authentication Setup

### Current Configuration
✅ Supabase Auth is configured
✅ Email/password authentication enabled
✅ Organization creation on signup automated

### Test User Creation

1. Sign up at `/signup`
2. Check your email for verification (if enabled)
3. Sign in at `/signin`

### Adding Team Members (Coming Soon)

To add team members to an organization:
1. Navigate to Settings
2. Click "Team Members" tab
3. Invite via email
4. Assign role (ADMIN, ANALYST, or VIEWER)

## Stripe Setup (Optional)

To enable subscription billing:

### 1. Create Stripe Account
Visit https://dashboard.stripe.com/register

### 2. Get API Keys
1. Go to Developers → API Keys
2. Copy your publishable key (starts with `pk_`)
3. Copy your secret key (starts with `sk_`)
4. Add to `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 3. Create Products

Create three products in Stripe Dashboard:
- **Free** - R0/month (for testing)
- **Pro** - R499/month
- **Enterprise** - R1,999/month

### 4. Configure Webhooks

1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Listen for events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook secret to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. Test Payments

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

More info: https://bolt.new/setup/stripe

## OpenAI Setup (Optional)

To enable enhanced AI insights with natural language generation:

### 1. Get API Key
1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `.env.local`:

```bash
OPENAI_API_KEY=sk-...
```

### 2. Update Insights Endpoint

Modify `app/api/ai/insights/route.ts` to use OpenAI for generating insight messages instead of the baseline templates.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit https://vercel.com
3. Click "Import Project"
4. Select your repository
5. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY` (if using)
   - `STRIPE_SECRET_KEY` (if using)
   - `STRIPE_WEBHOOK_SECRET` (if using)
6. Deploy

### Update Supabase Settings

After deployment, update these in Supabase Dashboard:

1. **Authentication → URL Configuration**:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/**`

2. **API → CORS**:
   - Add your production domain

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Supabase Auth redirect URLs updated
- [ ] Stripe webhook endpoint configured (if using)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Error monitoring setup (Sentry, LogRocket, etc.)

## Testing

### Manual Testing Checklist

- [ ] Sign up flow works
- [ ] Sign in flow works
- [ ] Dashboard displays correctly
- [ ] Can create property
- [ ] Can edit property
- [ ] Can delete property
- [ ] Can create tenant
- [ ] Can edit tenant
- [ ] Can generate insights
- [ ] Insights display correctly
- [ ] Settings page loads
- [ ] Organization name can be updated
- [ ] Sign out works

### Test Data

The system includes seeded market data for:
- Johannesburg (apartment, house, townhouse)
- Cape Town (apartment, house, townhouse)
- Durban (apartment, house, townhouse)
- Rosebank (apartment, house, townhouse)

## Monitoring

### Supabase Dashboard

Monitor your application at:
https://supabase.com/dashboard/project/YOUR_PROJECT_ID

Check:
- **Database**: Table sizes, query performance
- **Auth**: User signups, sessions
- **Storage**: File uploads (if implemented)
- **Logs**: API calls, errors

### Application Logs

In production, view logs in your deployment platform:
- **Vercel**: Project → Logs
- **Netlify**: Site → Logs
- **Railway**: Project → Logs

## Troubleshooting

### "Unauthorized" Error on API Calls
- Check that `Authorization` header is being sent
- Verify Supabase session is active
- Ensure RLS policies are correct

### Properties Not Showing
- Verify user has membership in organization
- Check organization ID matches properties
- Verify RLS policies allow SELECT

### Insights Not Generating
- Check that properties exist in database
- Verify market data exists for property region/type
- Check browser console for errors

### Build Failures
- Run `npm run typecheck` to find TypeScript errors
- Ensure all dependencies are installed
- Check for missing environment variables

## Migrating to Azure

For Azure deployment, follow these steps:

### 1. Provision Azure Resources

Use Bicep or Terraform to create:
- Azure Database for PostgreSQL Flexible Server
- Azure App Service (or Static Web Apps)
- Azure Blob Storage
- Azure OpenAI
- Azure AD B2C
- Azure Functions (for background jobs)
- Application Insights

### 2. Migrate Database

Export from Supabase:
```bash
pg_dump $SUPABASE_DB_URL > rentintel.sql
```

Import to Azure:
```bash
psql $AZURE_DB_URL < rentintel.sql
```

### 3. Update Authentication

Replace Supabase Auth with Azure AD B2C:
- Update `lib/auth-context.tsx`
- Configure OIDC/OAuth flows
- Update RLS policies to use Azure AD tokens

### 4. Update Storage

Replace Supabase Storage with Azure Blob Storage:
- Update file upload logic
- Generate SAS tokens for secure access
- Update file paths in database

### 5. Deploy Application

Deploy to Azure App Service:
```bash
az webapp up --name rentintel --resource-group rentintel-rg
```

### 6. Configure CI/CD

Set up GitHub Actions for automated deployments.

## Support

For issues or questions:
1. Check this documentation
2. Review the README.md
3. Check Supabase docs: https://supabase.com/docs
4. Check Next.js docs: https://nextjs.org/docs

---

**Ready to optimize rental property portfolios!**
