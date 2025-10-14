# RentIntel

**RentIntel** is an AI-driven rental property intelligence platform for landlords, investors, and property managers in South Africa. Built with Next.js, Supabase, and AI-powered insights, RentIntel helps maximize rental returns through data-driven decisions.

## Features

### Core Functionality
- **AI Rent Prediction**: Get accurate rent predictions based on market data, property features, and regional trends
- **Smart Insights**: Receive AI-powered recommendations for pricing optimization, vacancy reduction, and ROI improvement
- **Portfolio Dashboard**: Track KPIs including rent yield, occupancy rate, monthly ROI, and active alerts
- **Property Management**: Full CRUD operations for properties with detailed attributes (bedrooms, bathrooms, size, amenities)
- **Tenant Management**: Track tenant information, lease dates, payment status, and risk scores
- **Monthly Reports**: Automated portfolio performance reports (framework in place)
- **Market Intelligence**: Real-time market data for Johannesburg, Cape Town, Durban, and Rosebank

### Technical Features
- Multi-tenant architecture with organization-scoped data
- Row-Level Security (RLS) policies for data isolation
- Role-based access control (OWNER, ADMIN, ANALYST, VIEWER)
- Responsive design with Tailwind CSS and shadcn/ui
- TypeScript for type safety
- Authentication with Supabase Auth

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React 18, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (for lease documents)
- **AI**: Baseline rent prediction algorithm (OpenAI integration ready)
- **Payments**: Stripe integration ready (requires setup)

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm or yarn
- Supabase account (already configured in this environment)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment variables** are already configured in `.env`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Database is already set up** with:
   - All tables and relationships
   - Row-Level Security policies
   - Seeded market data for South African regions

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
.
├── app/
│   ├── (app)/              # Authenticated app routes
│   │   ├── dashboard/      # Main dashboard with KPIs
│   │   ├── properties/     # Property management
│   │   ├── tenants/        # Tenant management
│   │   ├── insights/       # AI insights display
│   │   ├── reports/        # Monthly reports
│   │   └── settings/       # Organization & billing settings
│   ├── (auth)/             # Authentication routes
│   │   ├── signin/
│   │   └── signup/
│   ├── api/                # API routes
│   │   └── ai/
│   │       ├── predict-rent/   # Rent prediction endpoint
│   │       └── insights/       # Insights generation endpoint
│   ├── page.tsx            # Marketing home page
│   ├── layout.tsx          # Root layout with providers
│   └── globals.css         # Global styles
├── components/
│   ├── app-shell.tsx       # Main app layout with sidebar
│   ├── property-dialog.tsx # Property form dialog
│   ├── tenant-dialog.tsx   # Tenant form dialog
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── supabase.ts         # Supabase client & types
│   ├── auth-context.tsx    # Auth context provider
│   ├── org-context.tsx     # Organization context provider
│   └── utils.ts            # Utility functions
└── README.md
```

## Database Schema

### Core Tables

- **organizations**: Tenant organizations with subscription plans
- **memberships**: User-to-organization relationships with roles
- **properties**: Rental properties with full details
- **tenants**: Tenant information and lease tracking
- **market_data**: Regional market statistics (seeded for ZA)
- **insights**: AI-generated insights and alerts
- **reports**: Generated monthly reports
- **files**: Uploaded documents (leases, etc.)

All tables have Row-Level Security enabled and are organization-scoped.

## User Flows

### New User Sign-up
1. User signs up at `/signup`
2. System creates user account via Supabase Auth
3. System automatically creates organization
4. System creates membership with OWNER role
5. User is redirected to dashboard

### Adding a Property
1. Navigate to Properties page
2. Click "Add Property"
3. Fill in property details (address, region, type, size, rent, expenses)
4. Select amenities
5. Property is saved and appears in list

### Generating Insights
1. Navigate to Insights page
2. Click "Refresh Insights"
3. System analyzes all properties in portfolio
4. Compares current rent to predicted market rent
5. Calculates ROI and identifies issues
6. Creates insight records with severity levels
7. Displays actionable recommendations

## AI Features

### Rent Prediction Algorithm

The baseline algorithm considers:
- Regional market averages
- Property type (apartment, house, townhouse)
- Number of bedrooms and bathrooms
- Property size in m²
- Amenities (parking, pool, security, etc.)
- Market vacancy rates

Returns:
- Predicted rent (in cents)
- Confidence score
- Market average
- Vacancy rate

### Insights Generation

Analyzes properties for:
- **Pricing insights**: Under/overpricing vs market
- **Cashflow insights**: Low ROI warnings
- **Occupancy insights**: Vacancy alerts

Severity levels:
- **CRITICAL**: Requires immediate attention (negative ROI, etc.)
- **WARNING**: Significant optimization opportunities
- **INFO**: General market observations

## Subscription Plans

- **Free**: Up to 3 properties, basic insights
- **Pro** (R499/month): Up to 20 properties, full insights, monthly reports
- **Enterprise** (R1,999/month): Unlimited properties, advanced features

*Note: Stripe integration requires setup. See `.env.example` for required keys.*

## Security

- All database operations use Row-Level Security (RLS)
- Organization-scoped data isolation
- Role-based access control
- Secure authentication via Supabase Auth
- Input validation on all forms
- API routes protected with auth checks

## Migrating to Azure (Future)

This application is built with clean architecture for easy Azure migration:

1. **Database**: Migrate from Supabase to Azure Database for PostgreSQL
2. **Auth**: Replace Supabase Auth with Azure AD B2C
3. **Storage**: Move from Supabase Storage to Azure Blob Storage
4. **Functions**: Extract timer jobs to Azure Functions
5. **AI**: Integrate Azure OpenAI for enhanced insights
6. **Infrastructure**: Use Bicep or Terraform for provisioning

All business logic is portable and framework-agnostic.

## API Endpoints

### POST `/api/ai/predict-rent`
Predict rental price for a property.

**Request**:
```json
{
  "region": "Johannesburg",
  "property_type": "apartment",
  "bedrooms": 2,
  "bathrooms": 1,
  "size_m2": 80,
  "amenities": ["Parking", "Security"]
}
```

**Response**:
```json
{
  "predicted_rent": 850000,
  "confidence": 0.95,
  "market_avg": 850000,
  "vacancy_rate": 5.2
}
```

### POST `/api/ai/insights`
Generate insights for organization's portfolio (requires authentication).

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response**:
```json
{
  "success": true,
  "insights_generated": 5
}
```

## Development

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Database Migrations

Migrations are managed via Supabase. The following migrations are already applied:
- `001_initial_schema.sql`: Core tables and structure
- `002_rls_policies.sql`: Row-Level Security policies

## Contributing

This is a production-ready template. To customize:

1. Update branding in `app/page.tsx` and `components/app-shell.tsx`
2. Modify color scheme in Tailwind config
3. Enhance AI algorithms in `app/api/ai/`
4. Add OpenAI integration for natural language insights
5. Implement Stripe webhooks for billing
6. Add PDF report generation
7. Implement email notifications

## License

Proprietary - All rights reserved.

## Support

For Azure migration assistance or custom development, contact your development team.

---

**Built with ❤️ for South African property managers**
