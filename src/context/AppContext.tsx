import { createContext, useContext, useState, useMemo, ReactNode } from "react";

// ─── Types ───
export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  label: string;
}

export interface CategorySpending {
  name: string;
  spent: number;
  budget: number;
  percentage: number;
  status: "safe" | "warning" | "over";
}

export type GoalStatus = "on-track" | "behind" | "achieved";

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  saved: number;
  target: number;
  deadline: string | null;
  autoSavePerDay: number;
  status: GoalStatus;
}

interface AppState {
  transactions: Transaction[];
  goals: Goal[];
  balance: number;
  totalSpent: number;
  budgetLimit: number;
  categorySpending: CategorySpending[];
  isOnboarded: boolean;
  energy: number;
  unlockedAuras: string[];
  equippedAura: string;
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
  // Confetti state and actions
  showConfetti: boolean;
  triggerConfetti: () => void;
  resetConfetti: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  addGoal: (goal: Omit<Goal, "id" | "saved" | "status" | "autoSavePerDay">) => void;
  removeGoal: (id: string) => void;
  addSavedAmount: (id: string, amount: number) => void;
  earnEnergy: (amount: number) => void;
  unlockAura: (id: string, price: number) => boolean;
  equipAura: (id: string) => void;
}

// ─── Default data ───
const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: "3", merchant: "Shopee", category: "Shopping", amount: 155.0, label: "S" },
  { id: "1", merchant: "Tealive", category: "Drinks", amount: 18.0, label: "T" },
  { id: "2", merchant: "RapidKL", category: "Transport", amount: 4.5, label: "R" },
];

const DEFAULT_GOALS: Goal[] = [
  { id: "1", name: "Raya Fund", emoji: "🌙", saved: 360, target: 500, deadline: "28 Mar 2026", autoSavePerDay: 2.40, status: "on-track" },
  { id: "2", name: "Emergency Fund", emoji: "🛡️", saved: 220, target: 1000, deadline: null, autoSavePerDay: 1.20, status: "behind" },
  { id: "3", name: "Travel Fund", emoji: "✈️", saved: 80, target: 1500, deadline: "Dec 2026", autoSavePerDay: 0.80, status: "behind" },
];

const DEFAULT_BALANCE = 1240.50;
const BUDGET_LIMIT = 1000; // monthly budget for demo

const DEFAULT_CATEGORY_BUDGETS: Record<string, number> = {
  "Food & drinks": 350,
  "Transport": 120,
  "Entertainment": 150,
  "Shopping": 300,
  "Health": 100,
};

// ─── Context ───
const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [balance, setBalance] = useState(DEFAULT_BALANCE);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [energy, setEnergy] = useState(120);
  const [unlockedAuras, setUnlockedAuras] = useState<string[]>(["origin"]);
  const [showConfetti, setShowConfetti] = useState(false);
  const triggerConfetti = () => setShowConfetti(true);
  const resetConfetti = () => setShowConfetti(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const [equippedAura, setEquippedAura] = useState("origin");
  const [totalSpent, setTotalSpent] = useState(
    DEFAULT_TRANSACTIONS.reduce((sum, tx) => sum + tx.amount, 0)
  );

  const completeOnboarding = () => setIsOnboarded(true);
  const resetOnboarding = () => setIsOnboarded(false);

  const categorySpending: CategorySpending[] = useMemo(() => {
    return Object.keys(DEFAULT_CATEGORY_BUDGETS).map((catName) => {
      // Map transaction categories to budget categories. e.g., "Food", "Drinks" -> "Food & drinks"
      const spent = transactions
        .filter((tx) => {
          const tCat = tx.category.toLowerCase();
          if (catName === "Food & drinks") return tCat === "food" || tCat === "drinks";
          return tCat === catName.toLowerCase();
        })
        .reduce((sum, tx) => sum + tx.amount, 0);

      const budget = DEFAULT_CATEGORY_BUDGETS[catName];
      const percentage = Math.min(100, Math.round((spent / budget) * 100));
      const status = percentage >= 100 ? "over" : percentage >= 80 ? "warning" : "safe";

      return { name: catName, spent, budget, percentage, status };
    });
  }, [transactions]);

  const addTransaction = (tx: Omit<Transaction, "id">) => {
    const newTx: Transaction = { ...tx, id: Date.now().toString() };
    setTransactions((prev) => [newTx, ...prev.slice(0, 9)]);
    setBalance((prev) => Math.max(0, parseFloat((prev - tx.amount).toFixed(2))));
    setTotalSpent((prev) => parseFloat((prev + tx.amount).toFixed(2)));
  };

  const addGoal = (goal: Omit<Goal, "id" | "saved" | "status" | "autoSavePerDay">) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      saved: 0,
      status: "behind",
      autoSavePerDay: 0,
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const removeGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const addSavedAmount = (id: string, amount: number) => {
    setGoals((prev) => prev.map((g) => {
      if (g.id !== id) return g;
      const newSaved = g.saved + amount;
      const status = newSaved >= g.target ? "achieved" : g.status;
      return { ...g, saved: newSaved, status };
    }));
    setBalance((prev) => Math.max(0, parseFloat((prev - amount).toFixed(2))));
  };

  const earnEnergy = (amount: number) => {
    setEnergy((prev) => prev + amount);
  };

  const unlockAura = (id: string, price: number) => {
    if (energy >= price) {
      setEnergy((prev) => prev - price);
      setUnlockedAuras((prev) => [...prev, id]);
      return true;
    }
    return false;
  };

  const equipAura = (id: string) => {
    if (unlockedAuras.includes(id)) {
      setEquippedAura(id);
    }
  };

  return (
    <AppContext.Provider value={{ transactions, goals, balance, totalSpent, budgetLimit: BUDGET_LIMIT, categorySpending, isOnboarded, energy, unlockedAuras, equippedAura, isDarkMode, toggleTheme, showConfetti, triggerConfetti, resetConfetti, completeOnboarding, resetOnboarding, addTransaction, addGoal, removeGoal, addSavedAmount, earnEnergy, unlockAura, equipAura }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
