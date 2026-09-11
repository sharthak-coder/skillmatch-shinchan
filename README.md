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
│   │   └── signup/page.tsx       # Account creation with validation
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
│   │   └── data-provider.tsx     # Unified data layer (Supabase + zero-config Local Demo mode)
│   ├── supabase/                 # Supabase client, server, and middleware helpers
│   ├── types.ts                  # TypeScript definitions for Profiles, Projects, Requests
│   └── seed-data.ts              # Pre-seeded Kasukabe student personas (Shin-chan, Kazama, Nene)
├── supabase/
│   └── schema.sql                # Full Postgres migration with Row Level Security (RLS) policies
├── tailwind.config.ts            # Shin-chan light color palette, animations, box-shadows
└── vercel.json                   # Zero-config Vercel deployment configuration
```

---

## 🚀 Quickstart & Setup Instructions

### 1. Zero-Config Local Mode (Instant Out-of-the-Box)
The application includes a seamless **Local Demo Provider** pre-seeded with Kasukabe student personas (`Shin-chan`, `Kazama`, `Nene`, `Masao`, `Bo-chan`). You can run it immediately with zero database configuration!

```bash
# Clone repository
git clone https://github.com/your-username/skillmatch-shinchan.git
cd skillmatch-shinchan

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Optional: Connect Real Supabase Database
To connect your own Supabase instance:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the SQL Editor in Supabase and paste the contents of `supabase/schema.sql`.
3. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. Restart the development server: `npm run dev`.

---

## 🎬 Screen Recording Walkthrough Script

When presenting or demoing SkillMatch:
1. **Landing Page Hero (0:00 - 0:15)**:
   - Showcase the playful light-themed Shin-chan aesthetic.
   - Demonstrate the **Live SyncChain Simulator slider**: drag from 0% to 100% to show the animated pulses transition into the "Action Beam Lock-In" starburst!
2. **Project Exploration & Filter (0:15 - 0:30)**:
   - Navigate to `/projects`.
   - Type in the debounced search bar (e.g., "AI", "React").
   - Filter by categories and click "Matching My Skills" to witness instant client-side filtering with skeleton states.
   - Point out the per-card `<SyncChain />` displaying match percentages calculated relative to the logged-in user.
3. **Project Creation with Live Preview (0:30 - 0:45)**:
   - Go to `/projects/new`.
   - As you type the title, description, and required skill tags, show how the **Live Preview Card** on the right updates simultaneously in real time.
4. **Join Request Flow (0:45 - 1:00)**:
   - Open a project (e.g., Kazama's *Action Kamen Vision*).
   - Show the detailed skill breakdown and pitch note input.
   - Send the join request.
5. **Account Switch & Celebratory Lock-In (1:00 - 1:20)**:
   - Open the top profile menu and switch to **Toru Kazama**.
   - Navigate to `/dashboard`.
   - Point to the incoming application from Shin-chan.
   - Click **Accept Teammate** → watch the celebratory Action Kamen 100% Lock-in, spring bounce, and confetti explosion!

---

## 🚢 Deployment to Vercel

SkillMatch is pre-configured for zero-config deployment on Vercel:
1. Push your code to GitHub.
2. Import repository into [Vercel](https://vercel.com).
3. (Optional) Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables. If left blank, the app will deploy in fully functional zero-config Demo Mode!
4. Deploy!
