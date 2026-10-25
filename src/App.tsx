import { useMemo, useState, useEffect } from 'react';
import { AccountSummary } from './components/AccountSummary';
import { SpendingTrends } from './components/SpendingTrends';
import { RecentTransactions } from './components/RecentTransactions';
import { SavingsGoals } from './components/SavingsGoals';
import { QuickActions } from './components/QuickActions';
import { DashboardHeader } from './components/DashboardHeader';
import { ActionModal } from './components/ActionModal';
import { AllAccountsView } from './components/AllAccountsView';
import { AccountDetailModal } from './components/AccountDetailModal';
import { ReportModal } from './components/ReportModal';
import { GoalsModal } from './components/GoalsModal';
import './styles/global.css';
import { supabase } from './lib/supabaseClient';
import { useAuth } from './auth/AuthProvider';

type Account = {
  name: string;
  balance: number;
  available: number;
  number: string;
  currency: string;
};

type Goal = {
  title: string;
  progress: number;
  target: number;
  current: number;
};

type Transaction = {
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
};

const initialAccounts: Account[] = [
  {
    name: 'Everyday Checking',
    balance: 8124.34,
    available: 7934.75,
    number: '••• 1342',
    currency: 'USD',
  },
  {
    name: 'Savings Vault',
    balance: 14290.22,
    available: 14290.22,
    number: '••• 7489',
    currency: 'USD',
  },
];

const initialTransactions: Transaction[] = [
  { date: 'Jul 25', description: 'Payroll deposit', amount: 3250.0, type: 'credit' },
  { date: 'Jul 24', description: 'Grocery market', amount: -124.76, type: 'debit' },
  { date: 'Jul 23', description: 'Utility bill', amount: -89.45, type: 'debit' },
  { date: 'Jul 22', description: 'Coffee shop', amount: -14.6, type: 'debit' },
  { date: 'Jul 21', description: 'Travel refund', amount: 98.22, type: 'credit' },
];

const trends = [
  { category: 'Food & Dining', amount: 420, color: '#4f46e5' },
  { category: 'Shopping', amount: 360, color: '#10b981' },
  { category: 'Bills', amount: 290, color: '#f59e0b' },
  { category: 'Transport', amount: 180, color: '#ec4899' },
];

const initialGoals: Goal[] = [
  { title: 'Vacation Fund', progress: 58, target: 5000, current: 2900 },
  { title: 'Emergency Cash', progress: 82, target: 12000, current: 9840 },
];

const quickActions = ['Send money', 'Pay bill', 'Deposit check', 'Freeze card'] as const;

type QuickAction = (typeof quickActions)[number];

function App() {
  const [activeAction, setActiveAction] = useState<QuickAction | null>(null);
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [showAccountsView, setShowAccountsView] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [transactionsState, setTransactions] = useState<Transaction[]>(initialTransactions);
  const auth = useAuth();
  const [loadingRemote, setLoadingRemote] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth?.user) return;
      setLoadingRemote(true);
      try {
        // Fetch accounts
        const { data: accData, error: accErr } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', auth.user.id);
        if (!accErr && accData && accData.length > 0) {
          setAccounts(
            accData.map((r: any) => ({
              name: r.name ?? 'Account',
              balance: Number(r.balance ?? 0),
              available: Number(r.available ?? r.balance ?? 0),
              number: r.number ?? '•••',
              currency: r.currency ?? 'USD',
            })),
          );
        }

        // Fetch transactions
        const { data: txData, error: txErr } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', auth.user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        if (!txErr && txData && txData.length > 0) {
          setTransactions(
            txData.map((t: any) => ({
              date: t.date ?? '',
              description: t.description ?? '',
              amount: Number(t.amount ?? 0),
              type: Number(t.amount ?? 0) >= 0 ? 'credit' : 'debit',
            })),
          );
        }

        // Fetch goals
        const { data: gData, error: gErr } = await supabase
          .from('savings_goals')
          .select('*')
          .eq('user_id', auth.user.id);
        if (!gErr && gData && gData.length > 0) {
          setGoals(
            gData.map((g: any) => ({ title: g.title ?? 'Goal', progress: Number(g.progress ?? 0), target: Number(g.target ?? 0), current: Number(g.current ?? 0) })),
          );
        }
      } catch (err) {
        console.warn('Remote fetch error', err);
      } finally {
        setLoadingRemote(false);
      }
    };

    fetchData();
  }, [auth?.user]);

  const closeModal = () => setActiveAction(null);

  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[number] | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [showGoals, setShowGoals] = useState(false);

  const handleActionClick = (action: QuickAction) => {
    setActionMessage('');
    setActiveAction(action);
  };

  const handleSubmit = (payload: { recipient?: string; amount?: number; biller?: string; checkAmount?: number }) => {
    console.log('submit', activeAction, payload);
    if (activeAction === 'Send money' && payload.recipient && payload.amount) {
      setAccounts((currentAccounts) =>
        currentAccounts.map((account) =>
          account.name === 'Everyday Checking' ? { ...account, balance: account.balance - payload.amount! } : account,
        ),
      );
      setActionMessage(`Sent $${payload.amount.toFixed(2)} to ${payload.recipient}.`);
    }

    if (activeAction === 'Pay bill' && payload.biller && payload.amount) {
      setAccounts((currentAccounts) =>
        currentAccounts.map((account) =>
          account.name === 'Everyday Checking' ? { ...account, balance: account.balance - payload.amount! } : account,
        ),
      );
      setActionMessage(`Paid $${payload.amount.toFixed(2)} to ${payload.biller}.`);
    }

    if (activeAction === 'Deposit check' && payload.checkAmount) {
      setAccounts((currentAccounts) =>
        currentAccounts.map((account) =>
          account.name === 'Everyday Checking' ? { ...account, balance: account.balance + payload.checkAmount! } : account,
        ),
      );
      setActionMessage(`Deposited $${payload.checkAmount.toFixed(2)} via check.`);
    }

    // Persist transaction and update account in Supabase (best-effort, non-blocking)
    (async () => {
      try {
        if (!auth?.user) return;

        const userId = auth.user.id;
        let amt = 0;
        let desc = '';
        let type: 'credit' | 'debit' = 'debit';

        if (activeAction === 'Send money' && payload.recipient && payload.amount) {
          amt = -Math.abs(payload.amount);
          desc = `Sent to ${payload.recipient}`;
          type = 'debit';
        }

        if (activeAction === 'Pay bill' && payload.biller && payload.amount) {
          amt = -Math.abs(payload.amount);
          desc = `Paid ${payload.biller}`;
          type = 'debit';
        }

        if (activeAction === 'Deposit check' && payload.checkAmount) {
          amt = Math.abs(payload.checkAmount);
          desc = `Deposit check`;
          type = 'credit';
        }

        if (amt !== 0) {
          // Upsert account (find by name 'Everyday Checking')
          const accName = 'Everyday Checking';
          const { data: foundAcc } = await supabase.from('accounts').select('*').eq('user_id', userId).eq('name', accName).limit(1).maybeSingle();
          if (foundAcc) {
            const newBalance = Number(foundAcc.balance ?? 0) + amt;
            await supabase.from('accounts').update({ balance: newBalance }).eq('id', foundAcc.id).eq('user_id', userId);
          } else {
            await supabase.from('accounts').insert([{ user_id: userId, name: accName, balance: amt, available: amt, number: '••• 0000', currency: 'USD' }]);
          }

          // Insert transaction
          await supabase.from('transactions').insert([{ user_id: userId, amount: amt, description: desc, type, date: new Date().toISOString() }]);
        }
      } catch (err) {
        console.warn('Failed to persist transaction', err);
      }
    })();

    closeModal();
  };

  const handleToggleFreeze = () => {
    setIsCardFrozen((value) => {
      const nextValue = !value;
      setActionMessage(`Card ${nextValue ? 'frozen' : 'unfrozen'} successfully.`);
      return nextValue;
    });
    closeModal();
  };

  const totalNetWorth = useMemo(() => accounts.reduce((sum, account) => sum + account.balance, 0), [accounts]);

  const handleGoalUpdate = (title: string, nextProgress: number) => {
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.title === title ? { ...goal, progress: nextProgress, current: Math.round((nextProgress / 100) * goal.target) } : goal,
      ),
    );

    // Persist to Supabase if available; do not block UI.
    (async () => {
      try {
        if (!auth?.user) return;
        const payload = { title, progress: nextProgress, target: 0, current: Math.round((nextProgress / 100) * 0), user_id: auth.user.id };
        // Try update by title + user_id
        const res = await supabase.from('savings_goals').update({ progress: nextProgress, current: Math.round((nextProgress / 100) * 0) }).eq('user_id', auth.user.id).eq('title', title);
        const data = (res as any).data;
        const error = (res as any).error;
        if (error) {
          // Try insert if update failed
          await supabase.from('savings_goals').insert([{ title, progress: nextProgress, target: 0, current: Math.round((nextProgress / 100) * 0), user_id: auth.user.id }]);
        } else if (!Array.isArray(data) || data.length === 0) {
          await supabase.from('savings_goals').insert([{ title, progress: nextProgress, target: 0, current: Math.round((nextProgress / 100) * 0), user_id: auth.user.id }]);
        }
      } catch (err) {
        // Swallow remote errors — UI remains functional with local state
        console.warn('Failed to persist goal update', err);
      }
    })();
  };

  const handleDownload = () => {
    // Export transactions as CSV
    const header = ['date', 'description', 'amount', 'type'];
    const rows = transactionsState.map((t) => [t.date, t.description, t.amount.toString(), t.type]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setActionMessage('Downloaded transactions.csv');
  };

  return (
    <div className="app-shell">
      <DashboardHeader cardFrozen={isCardFrozen} />
      <main className="dashboard-grid">
        <section className="panel panel-welcome">
          <div>
            <p className="eyebrow">Welcome back, Nora</p>
            <h1>Hush Bank Dashboard</h1>
            <p className="text-muted">
              Monitor balances, track spending patterns, and manage savings goals with secure, modern banking tools.
            </p>
          </div>
          <div className="hero-stat">
            <span>Total net worth</span>
            <strong>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalNetWorth)}
            </strong>
          </div>
        </section>

        {showAccountsView ? (
          <AllAccountsView
            accounts={accounts}
            onClose={() => setShowAccountsView(false)}
            onViewAccount={(acc) => {
              setSelectedAccount(acc);
              setShowAccountsView(false);
            }}
          />
        ) : (
          <AccountSummary
            accounts={accounts}
            onViewAllAccounts={() => setShowAccountsView(true)}
            onViewAccount={(acc) => setSelectedAccount(acc)}
          />
        )}

        <QuickActions actions={quickActions} onAction={handleActionClick} />

        <SpendingTrends trends={trends} onViewReport={() => setShowReport(true)} />

        <section className="panel panel-transactions">
          <RecentTransactions transactions={transactionsState} onDownload={() => handleDownload()} />
        </section>

        <SavingsGoals goals={goals} onManageGoals={() => setShowGoals(true)} />
      </main>

      {actionMessage ? <div className="action-message">{actionMessage}</div> : null}

      {selectedAccount ? (
        <AccountDetailModal account={selectedAccount} onClose={() => setSelectedAccount(null)} />
      ) : null}

      {showReport ? <ReportModal trends={trends} transactions={transactionsState} onClose={() => setShowReport(false)} /> : null}

      {showGoals ? <GoalsModal goals={goals} onClose={() => setShowGoals(false)} onUpdateGoal={handleGoalUpdate} /> : null}

      {activeAction ? (
        <ActionModal
          action={activeAction}
          onClose={closeModal}
          onSubmit={handleSubmit}
          isCardFrozen={isCardFrozen}
          onToggleFreeze={handleToggleFreeze}
        />
      ) : null}
    </div>
  );
}

export default App;
