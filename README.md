# 🏠 HYDRAWIRE - Real Estate Investment Platform

HYDRAWIRE is a high-performance real estate data and investment platform designed for distressed property acquisition. It allows investors to search millions of properties, analyze equity, build targeted lead lists, and execute automated marketing campaigns.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database & Auth:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Maps:** Google Maps Platform
- **Language:** TypeScript
- **Runtime:** Node.js 18+ / Bun

---

## 🛠 Installation & Setup

### 1. Prerequisites
- Install [Node.js](https://nodejs.org/) (v18 or higher)
- Install [pnpm](https://pnpm.io/) or [Bun](https://bun.sh/) (recommended)
- A [Supabase](https://supabase.com/) account and project

### 2. Clone & Install
```bash
git clone <repository-url>
cd HYDRAWIRE-main
pnpm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Maps Configuration
GOOGLE_MAPS_API=your_google_maps_api_key
```

### 4. Database Initialization
1. Log in to your **Supabase Dashboard**.
2. Open the **SQL Editor**.
3. Copy the contents of `/database/schema.sql` from this project.
4. Paste and **Run** the script to create all necessary tables and extensions.

### 5. Seed Demo Data
To populate your database with realistic test properties, run the seed script:
```bash
bun run scripts/seed.ts
```

### 6. Run the Application
```bash
npm run dev
# The app will start on http://localhost:3050
```

---

## 📖 How To Use HYDRAWIRE

### 🔍 Finding Leads (Search & Map)
- **Map View:** Navigate to the **Search** page. Use the sidebar filters to narrow down properties.
- **Marker Colors:**
  - 🟢 **Green:** High Equity (50%+) & Free & Clear.
  - 🔴 **Red:** Foreclosure, Pre-Foreclosure, Auction, or REO.
  - 🟡 **Amber:** Vacant or Absentee Owner.
  - 🔵 **Blue:** Standard/Off-Market properties.
- **Saved Searches:** Once you've set your ideal filters, save the search to get alerts and quickly return to these criteria later.

### 📋 Managing Lead Lists
- **Create Lists:** Organize your leads into lists (e.g., "High Equity Florida" or "Hot Probates").
- **Adding Properties:** From the map or property detail page, add a property to a specific list.
- **Tracking Progress:** In the **Lists** view, update a lead's status:
  - `New` $\rightarrow$ `Contacted` $\rightarrow$ `Interested` $\rightarrow$ `Converted`.
- **Exporting:** Export your curated lists to CSV for external marketing tools.

### 🏠 Analyzing Properties
- Click any property on the map to open the **Property Detail** view.
- View critical metrics: Estimated Value, Loan Balance, and Equity Percentage.
- Check the property's history and comparable sales (Comps).

---

## 🎯 The Ultimate Goal: Automated Outreach
HYDRAWIRE is designed to move from manual searching to a single-click automated workflow:

**The "Launch" Sequence:**
`Launch` $\rightarrow$ `Select Counties` $\rightarrow$ `Select Lead Types` $\rightarrow$ `Select Outreach Channels` $\rightarrow$ `Review` $\rightarrow$ `Start Automation`

This workflow automatically handles:
1. **Data Collection** from public gov sources.
2. **Classification** of distressed indicators.
3. **Contact Enrichment** (Skip Tracing).
4. **Motivation Scoring** (0-100).
5. **Automated Outreach** via Email, SMS, and Direct Mail.

---

## 📂 Project Structure
- `src/app/`: Next.js routes and layouts.
- `src/components/`: UI components (including `ui/` for shadcn).
- `src/lib/`: Database helpers and business logic.
- `src/hooks/`: Custom React hooks for state management.
- `database/`: SQL schema and migration scripts.
