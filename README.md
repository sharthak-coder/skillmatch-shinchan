# SkillMatch ⚡ (Crayon Shin-chan Edition)

> **University Student Project Partner Matching Platform** powered by weighted Jaccard skill-overlap algorithms and a light-themed, playful Crayon Shin-chan aesthetic.

SkillMatch solves the painful university problem of chaotic, uncoordinated group project partner searches and hackathon team formation. Instead of generic, unstyled admin panels or random spreadsheet sign-ups, SkillMatch matches students based on **complementary skill coverage**, shared hackathon passions, and celebratory **Action Kamen SyncChain™** lock-ins.

---

## 🎨 Design System — Crayon Shin-chan Theme

- **Base Background**: Warm Cream / Off-white (`#FFFDF9` / `#FFF9EE`) with a subtle crayon dot grid pattern.
- **Shin-chan Red**: `#EF4444` / `#DC2626` — iconic energetic t-shirt red used for primary CTAs and active states.
- **Shin-chan Yellow**: `#FACC15` / `#F59E0B` — shorts yellow used for skill badges, highlight chips, and Chocobi stars.
- **Action Kamen Sky Blue**: `#0284C7` / `#38BDF8` — superhero sky blue for links, category tags, and team progress meters.
- **Shiro White**: Crisp `#FFFFFF` card surfaces framed by playful borders (`border-2 border-slate-900`) and tactile drop shadows (`shadow-[4px_4px_0px_0px_#1E293B]`).
- **Character Stamps & Easter Eggs**:
  - 🛡️ **Action Kamen Approved**: Awarded to high-synergy projects and verified profiles.
  - 🐶 **Shiro's Cotton Candy Seal**: Guarantees verified university majors and zero ghosting.
  - ⚡ **Kasukabe Defense Corps**: Team unity indicators and collaborative hackathon values.

---

## 🔗 The Signature `<SyncChain percentage={n} />` Component

The signature **SyncChain** connects two circular nodes ("You" and "Project/Partner") via an animated pulse line:
1. **Low Match (< 30%)**: Muted slate dashes with a slow, subtle drift.
2. **Medium Match (30% - 79%)**: Action Kamen sky-blue dashes with an energetic flow.
3. **High Match (80% - 99%)**: Shin-chan red and yellow dual-stream particles.
4. **100% Match / Accepted Request**: The **"Action Beam Lock-In"**! A spring bounce (`scale: [1, 1.25, 1]`), starburst glow, and celebratory confetti burst.

### Reused across 4 core contexts:
1. **Every Project Card**: Live client-side match % computed relative to the logged-in student's skill set.
2. **Interactive Hero Simulator**: Visitors can drag the synergy slider on the landing page to test the 100% lock-in.
3. **Project Detail Page**: Displays detailed skill intersection and complementary coverage.
4. **Dashboard Accept Flow**: When a project owner clicks "Accept Teammate", the chain locks in with celebration.

---

## 🧮 Pure Skill-Match Algorithm

Implemented in `lib/match/algorithm.ts`:

$$\text{Coverage Ratio} = \frac{|U_{\text{skills}} \cap P_{\text{skills}}|}{|P_{\text{skills}}|}$$

$$\text{Jaccard Index} = \frac{|U_{\text{skills}} \cap P_{\text{skills}}|}{|U_{\text{skills}} \cup P_{\text{skills}}|}$$

$$\text{RawScore} = (0.80 \times \text{Coverage}) + (0.15 \times \text{Jaccard}) + (0.05 \times \text{Affinity})$$

- **Primary Coverage (80% weight)**: Ensures the student satisfies the project's actual requirements.
- **Jaccard Index (15% weight)**: Penalizes unrelated excess skills to favor focused builders.
- **Interest Affinity (5% weight)**: Awards bonus points when student interests overlap with project category.

---

## 📁 Architecture Overview

```
e:/MiniInternetProduct/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx        # Split-screen auth with 1-click demo personas
│   │   └── signup/page.tsx       # Account creation with email confirmation notice
│   ├── auth/
│   │   └── callback/route.ts     # Supabase PKCE auth callback exchange route
│   ├── onboarding/page.tsx       # 4-step wizard (Identity -> Skills -> Interests -> Shiro Seal)
│   ├── dashboard/page.tsx        # Incoming requests, My projects, Sent requests, quick stats
│   ├── projects/
│   │   ├── page.tsx              # Debounced search, category filters, skill chips, skeleton loading
│   │   ├── [id]/page.tsx         # Full project breakdown & Send Join Request modal
│   │   └── new/page.tsx          # Real-time side-by-side Live Preview Card project creation
│   ├── profile/[id]/page.tsx     # Public student profile with animated skill badges
│   ├── settings/page.tsx         # Update profile credentials and superpower skills
│   ├── layout.tsx                # App router root layout with DataProvider & Navbar
│   └── globals.css               # Playful Crayon Shin-chan theme variables & pop utilities
├── components/
│   ├── shared/
│   │   ├── Navbar.tsx            # Header with persona switcher and mobile drawer
│   │   ├── Footer.tsx            # Footer with Kasukabe Defense Corps values
│   │   ├── SyncChain.tsx         # Signature animated spring chain-link sync
│   │   ├── ProjectCard.tsx       # Project card with live match % SyncChain
│   │   └── RequestItem.tsx       # Interactive Accept/Reject card with celebratory lock-in
│   ├── landing/
│   │   ├── HeroNetwork.tsx       # Scrollytelling hero with interactive SyncChain simulator
│   │   ├── FeatureBento.tsx      # Feature highlights (Jaccard formula, Action Kamen lock-in)
│   │   └── Testimonials.tsx      # Kasukabe university student achievements
│   └── ui/                       # Button, Card, Input, TagInput, Badge, Skeleton
├── lib/
│   ├── match/
│   │   └── algorithm.ts          # Pure weighted Jaccard match calculator
│   ├── store/
│   │   └── data-provider.tsx     # Supabase session single source of truth + demo switcher
│   ├── supabase/                 # Supabase client, server, and cookie helpers
│   ├── types.ts                  # TypeScript definitions for Profiles, Projects, Requests
│   └── seed-data.ts              # Pre-seeded Kasukabe student personas (Shin-chan, Kazama, Nene)
├── supabase/
│   └── schema.sql                # Full Postgres migration with Row Level Security (RLS) policies
├── tailwind.config.ts            # Shin-chan light color palette, animations, box-shadows
└── vercel.json                   # Zero-config Vercel deployment configuration
```

---

## 🚀 Quickstart & Localhost Setup Instructions

### Prerequisites
- **Node.js**: v18.18+ or v20+ (recommended)
- **Git**
- A free **Supabase** account ([supabase.com](https://supabase.com))

---

### Step 1: Clone the Repository & Install Dependencies

```bash
git clone https://github.com/sharthak-coder/skillmatch-shinchan.git
cd skillmatch-shinchan

npm install
```

---

### Step 2: Configure Environment Variables

1. Copy the example environment file to create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and paste your Supabase project credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   *(You can find these in your **Supabase Dashboard** under **Project Settings** → **API**).*

> [!NOTE]
> `.env.local` is included in `.gitignore` and will never be committed to GitHub.

---

### Step 3: Run Database Migration (Supabase)

1. In your [Supabase Dashboard](https://supabase.com/dashboard), navigate to the **SQL Editor** in the left sidebar.
2. Open the file `supabase/schema.sql` from this project.
3. Copy its entire content, paste it into the Supabase SQL Editor, and click **Run**.
   - This creates all necessary tables (`profiles`, `skills`, `interests`, `projects`, `join_requests`).
   - Configures Row Level Security (RLS) policies.
   - Sets up the `on_auth_user_created` trigger for automatic profile generation upon user registration.

---

### Step 4: Configure Supabase Auth URLs (for Localhost & Production)

In your **Supabase Dashboard** → **Authentication** → **URL Configuration**:

1. **Site URL**:
   - For local development: `http://localhost:3000`
   - For production (Vercel): `https://skillmatch-shinchan.vercel.app`

2. **Redirect URLs**: Add the following URLs to the allowlist:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**`
   - `https://skillmatch-shinchan.vercel.app/auth/callback`
   - `https://skillmatch-shinchan.vercel.app/**`

Click **Save**.

---

### Step 5: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Step 6: Testing Authentication & Demo Accounts

- **New User Flow**: Register a new student account at `/signup`. Check your email for the confirmation link and click it to access your personal dashboard.
- **1-Click Demo Personas**: On the `/login` page, you can instantly test pre-seeded Kasukabe accounts (**Shinnosuke**, **Toru Kazama**, or **Nene**) with 1 click.
- **Clean Logout**: Clicking **Log Out** terminates the session and returns you to a clean, unauthenticated state with zero automatic demo fallback.

---

## 🚢 Deployment to Vercel

SkillMatch is deployed live at: **[https://skillmatch-shinchan.vercel.app](https://skillmatch-shinchan.vercel.app)**

To deploy your own copy on Vercel:
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **Add New... → Project**.
3. Select your `skillmatch-shinchan` repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**!
