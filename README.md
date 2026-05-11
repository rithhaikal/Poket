# 🟣 Poket — Smart Savings by GXBank

**Prototype Link** - https://poket-babycoder.netlify.app/

> A modern, Gen Z-focused financial wellness app built for the UTMxHackathon'26.

---

## 📱 What is Poket?

**Poket** is a mobile-first personal finance assistant that helps young Malaysians build better saving habits through dynamic insights and gamification:

- **Smart Nudges** — Contextual AI-powered financial advice after every spend
- **Live Spending Tracker** — Simulated transactions update your budget and spending breakdown in real-time
- **Savings Goals** — Create, track, and fund goals with one tap from the smart nudge
- **Debt Radar** — BNPL risk assessment with a monthly commitment vs. income ratio calculator
- **Daily Streak** — Gamified savings streaks with freeze & recovery sprint mechanics
- **Poket Challenge** — National savings leaderboard with milestone rewards
- **Spending DNA** — Category-level spending breakdown that updates live from your transactions
- **Aura Evolution** — Gamified identity system where consistent saving unlocks new visual cores
- **Dynamic Theming** — Seamless Dark/Light mode toggle with adaptive UI elements

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo SDK 54) |
| Styling | Inline StyleSheet + expo-linear-gradient |
| State | React Context API |
| AI Advice | Google Gemini API |
| Icons | lucide-react-native |
| Animations | React Native Reanimated, Lottie & Animated API |

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Expo dev server (clear cache recommended)
npx expo start --clear

# 3. Scan the QR code with Expo Go on your phone
#    OR press I for iOS simulator / A for Android emulator
```

> **Note:** This app is compatible with **Expo Go**. No development build required.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── Layout.tsx        # Material Top Tab navigator (bottom-positioned)
│   │   ├── AuraCore.tsx      # Animated gamification orb (Reanimated API)
│   │   ├── GoalCard.tsx      # Savings goal card component
│   │   ├── TextShimmer.tsx   # Loading shimmer animation
│   │   ├── BNPLRow.tsx       # BNPL plan row card
│   │   ├── Logo.tsx          # Custom SVG logo
│   │   └── StreakDayCircle.tsx
│   └── screens/
│       ├── Onboarding.tsx    # Animated welcome flow
│       ├── Home.tsx          # Dashboard + Smart Nudge + Transaction Simulator
│       ├── SpendingDNA.tsx   # Live category spending breakdown
│       ├── SavingsGoals.tsx  # Goals CRUD + Savings Coach
│       ├── StreakTracker.tsx  # Gamified streak + recovery sprint
│       ├── DebtRadar.tsx     # BNPL risk calculator
│       ├── Challenge.tsx     # National savings leaderboard
│       └── Profile.tsx       # User stats + Aura Evolution + Tools
├── context/
│   └── AppContext.tsx        # Global state: transactions, goals, balance, theme, energy
├── services/
│   └── smartAdvice.ts        # Gemini AI financial advice engine
└── theme.ts                  # Dark/Light palette + useTheme hook
```

---

## ✨ Demo Flow

1. Open the app → swipe through the **Animated Onboarding** screens to see the value prop.
2. Tap **"Get Started"** → land on the **Home** dashboard.
3. **The Smart Nudge Trap:**
   - Tap **"Simulate Transaction"** and select **GrabFood**. Notice the friendly nudge telling you you're healthy and offering to auto-save RM 2 to your goals.
   - Tap **"Simulate Transaction"** and select **Shopee**. Notice the AI immediately reacts to your category spending hitting 80%, changing its tone to warn you and suggesting you "redirect" that money instead.
   - Tap **"Simulate Transaction"** and select **Shopee** AGAIN. The AI detects you've breached 100% of your Shopping budget and instantly throws a red **🚨 Budget Exceeded** alert, forcing you to Review your Budget.
4. On the **Spending** page, show how the category spending rings have updated in real-time.
5. Navigate to **Goals** → showcase the round-up savings engine, AI-generated savings insights, and add a new savings goal using the predefined emoji selector.
6. **The Gamified Streak Recovery:**
   - Navigate to the **Streak** tab.
   - Show how the gamification engine reacted to your overspending: your 11-day streak is frozen, the flame is dead, and the red **Streak Frozen** penalty box has appeared.
   - Tap **"Start 3-Day Sprint"** to simulate successfully passing the recovery mode. Watch the 11-day streak instantly restore!
7. Navigate to **Profile** → showcase the user's Aura Core, XP level progress, financial stats (Top 4% National rank), and the Earn Sparks / Evolution Chamber system.
8. From the **Tools** section on Profile, navigate to **Debt Radar** → explain the BNPL risk calculator and how it protects Gen-Z credit scores.
9. From the **Tools** section on Profile, navigate to the **Challenge** leaderboard → show the national university rankings and gamified milestones.
10. Scroll down to **Appearance** on the Profile screen → toggle the **Dark/Light Mode** switch and watch the entire app instantly adapt its colors and gradients.
11. Finally, tap **Log Out** on the Profile screen to loop back to the Onboarding screen.

---

*Built with ❤️ for UTMxHackathon'26*
