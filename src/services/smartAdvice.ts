// ─────────────────────────────────────────────────────────────
//  Poket AI — Demo Mode
//  All responses are computed from real app state (merchant, budget %, goals)
//  so they react to actual user actions and look genuinely intelligent.
//  No API calls. Zero quota risk. Perfect for a hackathon prototype.
// ─────────────────────────────────────────────────────────────

export interface SmartNudge {
  message: string;
  actionLabel: string;
  actionType?: "save" | "review";
}

export interface SpendingInsight {
  insight: string;
  spendingType: string;
  spendingDescription: string;
  peerComparison: string;
}

export interface SavingsAdvice {
  tip: string;
  projectionMessage: string;
  motivationLine: string;
}

export interface StreakMotivation {
  message: string;
  challenge: string;
}

export interface DebtAdvice {
  riskLevel: "low" | "medium" | "high";
  summary: string;
  topAction: string;
  timeToFree: string;
}

export interface ChallengeMotivation {
  rankMessage: string;
  weeklyTip: string;
  streakNote: string;
}

// ─── Helpers ───
const fakeDelay = () =>
  new Promise<void>((res) => setTimeout(res, 900 + Math.random() * 600));

// ─── Smart Nudge (Home) ───
export async function getSmartNudge(
  transactions: { merchant: string; category: string; amount: number }[],
  budgetUsedPercent: number,
  savedThisMonth: number,
  topGoal?: { name: string; saved: number; target: number },
): Promise<SmartNudge> {
  await fakeDelay();

  const tx = transactions[0];
  const goalName = topGoal?.name ?? "your Emergency Fund";
  const save = Math.max(2, Math.round(tx.amount * 0.08));
  const cat = tx.category.toLowerCase();
  const pct = budgetUsedPercent;

  if (pct >= 100) {
    return {
      message: `🚨 Budget Exceeded! RM ${tx.amount.toFixed(2)} at ${tx.merchant} pushed your ${cat} spending to ${pct}%. Please review your budget to get back on track.`,
      actionLabel: `Review Budget`,
      actionType: "review",
    };
  }

  if (cat === "food" || cat === "drinks") {
    if (pct >= 90) return {
      message: `RM ${tx.amount.toFixed(2)} at ${tx.merchant} pushed you to ${pct}% of your budget. Your wallet needs a breather — cook at home for the next few days and redirect that cash to ${goalName}.`,
      actionLabel: `Save RM ${save} to ${goalName}`,
    };
    if (pct >= 70) return {
      message: `${tx.merchant} again? No judgment — but at ${pct}% budget used, skipping one food delivery this week could free up RM 30+ for ${goalName}.`,
      actionLabel: `Move RM ${save} to ${goalName}`,
    };
    return {
      message: `RM ${tx.amount.toFixed(2)} at ${tx.merchant} — you're at ${pct}% budget, still looking healthy. Want to auto-save RM ${save} to ${goalName} while you're ahead?`,
      actionLabel: `Save RM ${save}`,
    };
  }

  if (cat === "shopping") {
    if (pct >= 80) return {
      message: `That RM ${tx.amount.toFixed(2)} ${tx.merchant} order nudged you to ${pct}% budget. Your ${goalName} is waiting — skip the next checkout and put RM ${save} there instead.`,
      actionLabel: `Redirect RM ${save}`,
      actionType: "save",
    };
    return {
      message: `Online shopping adds up fast — RM ${tx.amount.toFixed(2)} at ${tx.merchant} today. You're at ${pct}% budget. Moving RM ${save} to ${goalName} now keeps your savings on track.`,
      actionLabel: `Save RM ${save}`,
      actionType: "save",
    };
  }

  if (cat === "transport") {
    if (pct >= 85) return {
      message: `RM ${tx.amount.toFixed(2)} on transport at ${pct}% budget is getting tight. Consider carpooling or public transit for the rest of the month, and put RM ${save} toward ${goalName}.`,
      actionLabel: `Save RM ${save}`,
    };
    return {
      message: `RM ${tx.amount.toFixed(2)} on transport — that's just the daily grind. At ${pct}% budget you're still in control. Auto-save RM ${save} to ${goalName} and stay ahead.`,
      actionLabel: `Save RM ${save}`,
    };
  }

  if (cat === "entertainment") {
    return {
      message: `RM ${tx.amount.toFixed(2)} at ${tx.merchant} is fine — but subscriptions compound. At ${pct}% budget, even RM ${save}/month to ${goalName} adds up to RM ${save * 12} a year.`,
      actionLabel: `Save RM ${save}`,
    };
  }

  if (cat === "health") {
    return {
      message: `RM ${tx.amount.toFixed(2)} at ${tx.merchant} — investing in your health is always smart. At ${pct}% budget, pair it with RM ${save} into ${goalName} and you're winning both ways.`,
      actionLabel: `Save RM ${save}`,
    };
  }

  // Generic — still personalised with real data
  return {
    message: `RM ${tx.amount.toFixed(2)} at ${tx.merchant} — you're at ${pct}% of your monthly budget. A quick RM ${save} move to ${goalName} right now keeps your savings momentum going strong.`,
    actionLabel: `Save RM ${save} to ${goalName}`,
  };
}

// ─── Spending Insight (SpendingDNA) ───
export async function getSpendingInsight(
  categories: { name: string; spent: number; budget: number }[],
): Promise<SpendingInsight> {
  await fakeDelay();

  const topCat = [...categories].sort((a, b) => b.spent - a.spent)[0];
  const overBudget = categories.filter((c) => c.spent > c.budget);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);

  if (overBudget.length >= 2) return {
    spendingType: "Lifestyle Maximiser",
    spendingDescription: "You spend across multiple categories freely — dining, shopping, and convenience are your go-tos.",
    insight: `You've exceeded budget in ${overBudget.length} categories this month. Cutting back on ${overBudget[0].name} alone could save you RM ${Math.round(overBudget[0].spent - overBudget[0].budget)} this month.`,
    peerComparison: "Similar profiles save RM 180–250/month by setting hard category caps. You're close — one or two tweaks away.",
  };

  if (topCat?.name?.toLowerCase().includes("food") || topCat?.name?.toLowerCase().includes("drink")) return {
    spendingType: "Foodie Spender",
    spendingDescription: "Food and drinks take the biggest slice of your wallet — delivery, cafes, and quick bites are your pattern.",
    insight: `RM ${topCat.spent.toFixed(0)} on ${topCat.name} this month. Meal-prepping twice a week could realistically cut this by 25–30%.`,
    peerComparison: "Malaysians your age spend an average of RM 380/month on food. Yours is on the higher end — still manageable with small swaps.",
  };

  if (topCat?.name?.toLowerCase().includes("shop")) return {
    spendingType: "Impulsive Shopper",
    spendingDescription: "Shopee, Lazada, and retail are your biggest categories — you're a deal-hunter who acts fast.",
    insight: `RM ${topCat.spent.toFixed(0)} on shopping this month. A 24-hour cart rule (wait a day before buying) could reduce impulse spend by up to 40%.`,
    peerComparison: "Peers who use a wishlist method save an average of RM 120+/month on online shopping without feeling deprived.",
  };

  return {
    spendingType: "Balanced Spender",
    spendingDescription: "Your spending is spread evenly — no single category is dominating, which is actually a healthy sign.",
    insight: `Total spent: RM ${totalSpent.toFixed(0)} this month. You're managing well — now is the perfect time to bump up your auto-save by just 5%.`,
    peerComparison: "You're already ahead of 60% of users your age. A small savings increase now could compound into RM 5,000+ in 2 years.",
  };
}

// ─── Savings Advice (SavingsGoals) ───
export async function getSavingsAdvice(
  goals: { name: string; saved: number; target: number; status: string }[],
  balance: number,
): Promise<SavingsAdvice> {
  await fakeDelay();

  const behind = goals.filter((g) => g.status === "behind");
  const onTrack = goals.filter((g) => g.status === "on-track");
  const topGoal = behind[0] ?? goals[0];
  const remaining = topGoal ? topGoal.target - topGoal.saved : 0;
  const monthsLeft = Math.ceil(remaining / 80); // rough estimate

  if (behind.length === 0) return {
    tip: "You're on track across all your goals — now is the time to increase your auto-save percentage before lifestyle creep sets in.",
    projectionMessage: `At this pace, you'll complete your nearest goal in about ${monthsLeft} months without changing anything.`,
    motivationLine: "Consistency is the hardest and most valuable financial skill — you're already doing it.",
  };

  if (behind.length >= 2) return {
    tip: `Focus on one goal at a time — pick ${topGoal?.name} and throw everything at it first. Scattered saving slows all goals down.`,
    projectionMessage: `RM ${remaining.toFixed(0)} left for ${topGoal?.name}. Saving RM 100/month gets you there in ~${monthsLeft} months.`,
    motivationLine: "Progress on one goal motivates progress on all of them. Start with the smallest.",
  };

  return {
    tip: `${topGoal?.name} is behind — try the roundup trick: every transaction, auto-round up to the nearest RM 5 and dump the difference into this goal.`,
    projectionMessage: `RM ${remaining.toFixed(0)} left. At RM 80/month, you'll get there in about ${monthsLeft} months — sooner if you add a side hustle.`,
    motivationLine: "Every ringgit you save today is buying your future self some freedom.",
  };
}

// ─── Streak Motivation (StreakTracker) ───
export async function getStreakMotivation(
  currentStreak: number,
  longestStreak: number,
): Promise<StreakMotivation> {
  await fakeDelay();

  if (currentStreak >= longestStreak && currentStreak >= 7) return {
    message: `${currentStreak} days straight — you just tied your personal best. This is where habits are actually formed. Don't stop now.`,
    challenge: "Can you hit double this streak? Set a new personal record this month.",
  };

  if (currentStreak >= 14) return {
    message: `${currentStreak}-day streak is serious — you're in the top 15% of Poket users for consistency. This is what separates savers from wishful thinkers.`,
    challenge: "Go 7 more days without any non-essential spending and unlock the 21-day badge.",
  };

  if (currentStreak >= 7) return {
    message: `One full week down. Most people quit by day 3 — you're past that now. The hardest part is already behind you.`,
    challenge: "Double your streak to 14 days and you'll start to see it in your bank balance.",
  };

  if (currentStreak >= 3) return {
    message: `${currentStreak} days in — the momentum is building. Skip one impulse buy today and you'll feel the difference by Friday.`,
    challenge: "Make it to day 7 without missing. That's when it stops feeling like effort.",
  };

  return {
    message: `Day ${currentStreak} — every streak starts somewhere. The hardest day to save is the first one, and you've already done it.`,
    challenge: "Challenge yourself: no food delivery for the next 3 days. See what that saves.",
  };
}

// ─── Debt Advice (DebtRadar) ───
export async function getDebtAdvice(
  totalMonthlyBnpl: number,
  totalRemainingBnpl: number,
  monthlyIncome: number,
  activeCount: number,
): Promise<DebtAdvice> {
  await fakeDelay();

  const incomeRatio = totalMonthlyBnpl / monthlyIncome;
  const incomePct = Math.round(incomeRatio * 100);

  if (incomeRatio >= 0.25 || activeCount >= 4) return {
    riskLevel: "high",
    summary: `Your monthly BNPL commitment (RM ${totalMonthlyBnpl.toFixed(0)}) is taking up ${incomePct}% of your income — this is the danger zone. One missed payment triggers fees that compound fast.`,
    topAction: "Freeze all new BNPL plans immediately. Pay off the smallest balance first to reduce the number of active plans.",
    timeToFree: `About ${Math.ceil(totalRemainingBnpl / (monthlyIncome * 0.2))} months if you dedicate 20% of income to clearing it.`,
  };

  if (incomeRatio >= 0.15 || activeCount >= 2) return {
    riskLevel: "medium",
    summary: `RM ${totalMonthlyBnpl.toFixed(0)}/month across ${activeCount} BNPL plans is manageable but tight. Don't add any new plans until at least one is fully cleared.`,
    topAction: "Clear the plan with the highest remaining balance or nearest deadline first. Then funnel that freed-up cash into savings.",
    timeToFree: `About ${Math.ceil(totalRemainingBnpl / (monthlyIncome * 0.15))} months at your current income level.`,
  };

  return {
    riskLevel: "low",
    summary: `RM ${totalMonthlyBnpl.toFixed(0)}/month in BNPL is well within your income range — you're managing it responsibly. Keep it this way.`,
    topAction: "Stay disciplined: no new BNPL plans until your current ones are done. Redirect those cleared payments into an emergency fund.",
    timeToFree: `You're on track to be BNPL-free in about ${Math.ceil(totalRemainingBnpl / (monthlyIncome * 0.1))} months.`,
  };
}

// ─── Challenge Motivation (Challenge) ───
export async function getChallengeMotivation(
  rank: number,
  totalParticipants: number,
  daysLeft: number,
  savedSoFar: number,
): Promise<ChallengeMotivation> {
  await fakeDelay();

  const topPct = Math.round((rank / totalParticipants) * 100);

  if (topPct <= 5) return {
    rankMessage: `Top ${topPct}% out of ${totalParticipants.toLocaleString()} participants — you're in elite territory. This kind of discipline compounds into real wealth over time.`,
    weeklyTip: `RM ${savedSoFar} saved so far is impressive. Lock in another RM 50 this week and you could finish in the top 3%.`,
    streakNote: `${daysLeft} days left — don't let up. The biggest jumps in rank happen in the final week.`,
  };

  if (topPct <= 20) return {
    rankMessage: `Top ${topPct}% — you're already beating 4 out of 5 participants. One strong week could push you into the top 10%.`,
    weeklyTip: "Cut one dining-out session this week and reallocate it directly to your challenge savings.",
    streakNote: `${daysLeft} days remaining. Consistent daily saves matter more than big one-off deposits right now.`,
  };

  if (topPct <= 50) return {
    rankMessage: `You're in the top half with ${daysLeft} days to go — there's still real room to climb. The middle of the pack is where the most movement happens.`,
    weeklyTip: "Try saving RM 5 every time you would have bought a drink. It adds up faster than you think.",
    streakNote: "Don't aim for perfection — just aim for better than yesterday.",
  };

  return {
    rankMessage: `You're in the challenge and that already puts you ahead of everyone who didn't sign up. Now let's move up.`,
    weeklyTip: "Set one spending limit this week — pick your biggest category and cap it. Even RM 20 saved is a rank climb.",
    streakNote: `${daysLeft} days left — the comeback story starts here.`,
  };
}
