import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, LayoutDashboard, BookOpen, Filter, Newspaper, 
  FlaskConical, Cpu, ShieldAlert, ArrowUpRight, ArrowDownRight, RefreshCw, 
  Plus, Trash2, CheckCircle2, AlertTriangle, Search, ChevronRight, Activity, 
  BarChart2, Zap, Layers, Globe, Clock, Sliders, Play, Award, DollarSign,
  Briefcase, Eye, ExternalLink, Sparkles, ChevronDown, Check, X
} from 'lucide-react';

// --- MOCK INITIAL DATA FOR INDIAN MARKETS & MULTI-BROKER HOLDINGS ---
const INITIAL_HOLDINGS = [
  {
    id: 'h1',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    broker: 'mStock',
    qty: 50,
    avgPrice: 2450.00,
    cmp: 2890.50,
    sector: 'Energy / Conglomerate',
    marketCap: '₹19.55 Lakh Cr (Large Cap)',
    dma50: 2780.00,
    dma200: 2540.00,
    rsi: 64.2,
    addedDate: '2024-01-15',
    stopLoss: 2650.00,
    target: 3200.00,
    aiRecommendation: 'HOLD',
    aiScore: 88,
    aiReason: 'Strong momentum above 50 & 200 DMA. Q3 refining margins expansion supports earnings growth. Retain trailing stop loss at ₹2,650.',
  },
  {
    id: 'h2',
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    broker: 'Goodwill',
    qty: 200,
    avgPrice: 620.00,
    cmp: 985.20,
    sector: 'Automobile',
    marketCap: '₹3.27 Lakh Cr (Large Cap)',
    dma50: 940.00,
    dma200: 820.00,
    rsi: 71.5,
    addedDate: '2023-11-10',
    stopLoss: 910.00,
    target: 1100.00,
    aiRecommendation: 'TRIM',
    aiScore: 62,
    aiReason: 'RSI > 70 indicates near-term overbought status. Account allocation currently high (19.8%). Recommend booking partial profit (25% qty) to rebalance.',
  },
  {
    id: 'h3',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    broker: 'mStock',
    qty: 120,
    avgPrice: 1680.00,
    cmp: 1510.40,
    sector: 'Banking & Financials',
    marketCap: '₹11.50 Lakh Cr (Large Cap)',
    dma50: 1530.00,
    dma200: 1610.00,
    rsi: 38.4,
    addedDate: '2024-02-01',
    stopLoss: 1440.00,
    target: 1850.00,
    aiRecommendation: 'ADD',
    aiScore: 81,
    aiReason: 'NIM recovery expected next quarter. Stock trading at multi-year low PB ratio near strong support. Good risk-reward to average down.',
  },
  {
    id: 'h4',
    symbol: 'KPITTECH',
    name: 'KPIT Technologies Ltd.',
    broker: 'Goodwill',
    qty: 80,
    avgPrice: 1540.00,
    cmp: 1380.00,
    sector: 'IT & Software',
    marketCap: '₹37,800 Cr (Mid Cap)',
    dma50: 1490.00,
    dma200: 1520.00,
    rsi: 32.1,
    addedDate: '2024-03-12',
    stopLoss: 1390.00,
    target: 1750.00,
    aiRecommendation: 'EXIT',
    aiScore: 24,
    aiReason: 'Broke below crucial 200 DMA support on high volume with trailing stop loss breached (₹1,390 threshold reached). Protect remaining capital.',
  },
  {
    id: 'h5',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    broker: 'mStock',
    qty: 30,
    avgPrice: 3800.00,
    cmp: 4120.00,
    sector: 'IT & Software',
    marketCap: '₹14.90 Lakh Cr (Large Cap)',
    dma50: 4010.00,
    dma200: 3850.00,
    rsi: 58.0,
    addedDate: '2024-01-20',
    stopLoss: 3920.00,
    target: 4500.00,
    aiRecommendation: 'HOLD',
    aiScore: 79,
    aiReason: 'Stable order book win streak in US/EU regions. Solid defensive holding yielding regular buyback dividends.',
  }
];

const INITIAL_JOURNAL = [
  {
    id: 'j1',
    symbol: 'BHARTIARTL',
    type: 'SWING BUY',
    entryDate: '2024-04-01',
    exitDate: '2024-04-12',
    entryPrice: 1210,
    exitPrice: 1340,
    qty: 100,
    pnl: 13000,
    pnlPercent: 10.74,
    status: 'CLOSED',
    setup: '50 DMA Bounce + ARPU Hike Catalyst',
    mistake: 'Exited early before target of 1380',
    tags: ['Swing', 'Breakout']
  },
  {
    id: 'j2',
    symbol: 'NIFTY 22500 CE',
    type: 'F&O BUY',
    entryDate: '2024-04-18',
    exitDate: '2024-04-18',
    entryPrice: 110,
    exitPrice: 45,
    qty: 150,
    pnl: -9750,
    pnlPercent: -59.09,
    status: 'CLOSED',
    setup: 'Options Buying Expiry Scalp',
    mistake: 'Overtraded against prevailing market trend without hard stop loss',
    tags: ['Options', 'HeroOrZero']
  },
  {
    id: 'j3',
    symbol: 'ZOMATO',
    type: 'SWING BUY',
    entryDate: '2024-03-05',
    exitDate: '2024-03-25',
    entryPrice: 155,
    exitPrice: 182,
    qty: 500,
    pnl: 13500,
    pnlPercent: 17.41,
    status: 'CLOSED',
    setup: 'Cup & Handle Breakout',
    mistake: 'None - followed trading plan strictly',
    tags: ['Breakout', 'Growth']
  }
];

const SCREENER_STOCKS = [
  { symbol: 'SUZLON', cmp: 54.2, change: 4.8, volumeSpike: '3.4x', setup: 'Multi-Month Breakout', dmaStatus: 'Above 50 & 200', rsi: 68, sector: 'Green Energy', score: 92 },
  { symbol: 'TRENT', cmp: 4210.0, change: 3.2, volumeSpike: '2.1x', setup: 'All Time High Consolidation', dmaStatus: 'Above 50 & 200', rsi: 65, sector: 'Retail / Fashion', score: 89 },
  { symbol: 'DIXON', cmp: 8450.0, change: -1.2, volumeSpike: '1.8x', setup: '50 DMA Support Pullback', dmaStatus: 'Above 200', rsi: 44, sector: 'Electronics Manufacturing', score: 84 },
  { symbol: 'HAL', cmp: 3980.0, change: 5.6, volumeSpike: '4.1x', setup: 'Defense Order Book Rally', dmaStatus: 'Above 50 & 200', rsi: 72, sector: 'Defense & Aerospace', score: 94 },
  { symbol: 'COALINDIA', cmp: 442.0, change: -0.5, volumeSpike: '0.9x', setup: 'High Dividend Value Base', dmaStatus: 'Near 200 DMA', rsi: 38, sector: 'Mining & Resources', score: 71 },
  { symbol: 'BHEL', cmp: 268.0, change: 2.1, volumeSpike: '2.8x', setup: 'Symmetrical Triangle Squeeze', dmaStatus: 'Above 50', rsi: 59, sector: 'Capital Goods', score: 81 }
];

const NEWS_FEED = [
  {
    id: 'n1',
    symbol: 'RELIANCE',
    title: 'Reliance Jio Plans IPO Launch Later This Year, Valuations Pegged at $100B+',
    source: 'Economic Times',
    time: '25 mins ago',
    sentiment: 'BULLISH',
    impact: 'High',
    summary: 'Jio Platforms is preparing for a blockbuster listing following strong tariff hikes and 5G subscriber additions.'
  },
  {
    id: 'n2',
    symbol: 'MACRO',
    title: 'US Fed Keeps Rates Unchanged; Signals Potential Rate Cuts by Q3',
    source: 'Bloomberg Quint',
    time: '1 hour ago',
    sentiment: 'BULLISH',
    impact: 'Critical',
    summary: 'Global liquidity sentiment turns favorable for emerging markets as Treasury yields ease down to 4.2%.'
  },
  {
    id: 'n3',
    symbol: 'TATAMOTORS',
    title: 'JLR Global Sales Surge 11% YoY; EV SUV Segment Gains Traction',
    source: 'CNBC TV18',
    time: '3 hours ago',
    sentiment: 'NEUTRAL',
    impact: 'Medium',
    summary: 'Jaguar Land Rover sales remain healthy, but UK manufacturing cost inflation continues to weigh on margin expansion.'
  },
  {
    id: 'n4',
    symbol: 'HDFCBANK',
    title: 'RBI Relaxes Deposit Reserve Norms, Unlocking Capital for Top Lenders',
    source: 'Mint Financial',
    time: '5 hours ago',
    sentiment: 'BULLISH',
    impact: 'High',
    summary: 'The central bank move provides liquidity relief for major private sector banks struggling with deposit growth ratios.'
  }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('portfolio');
  
  // App State
  const [holdings, setHoldings] = useState(() => {
    const saved = localStorage.getItem('protrader_holdings');
    return saved ? JSON.parse(saved) : INITIAL_HOLDINGS;
  });
  
  const [journal, setJournal] = useState(() => {
    const saved = localStorage.getItem('protrader_journal');
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL;
  });

  const [mstockStatus, setMstockStatus] = useState({
    connected: true,
    lastSync: 'Just now',
    account: 'ACC-MSTOCK-88219'
  });

  // UI Interactivity States
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [isAddHoldingModal, setIsAddHoldingModal] = useState(false);
  const [isAddJournalModal, setIsAddJournalModal] = useState(false);
  const [filterBroker, setFilterBroker] = useState('ALL');
  const [filterAction, setFilterAction] = useState('ALL');

  // New Holding Form State
  const [newHolding, setNewHolding] = useState({
    symbol: '', name: '', broker: 'mStock', qty: 10, avgPrice: 100, cmp: 105, sector: 'Technology', stopLoss: 90, target: 130
  });

  // New Journal Form State
  const [newJournal, setNewJournal] = useState({
    symbol: '', type: 'SWING BUY', entryDate: new Date().toISOString().split('T')[0], exitDate: new Date().toISOString().split('T')[0],
    entryPrice: 100, exitPrice: 110, qty: 50, setup: '50 DMA Bounce', mistake: 'None'
  });

  // Strategy Backtester State
  const [backtestParams, setBacktestParams] = useState({
    strategy: '50/200 DMA Golden Cross',
    timeframe: '1 Year',
    stopLossPct: 5,
    targetPct: 15,
    capital: 500000
  });
  const [backtestResults, setBacktestResults] = useState(null);
  const [isBacktesting, setIsBacktesting] = useState(false);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('protrader_holdings', JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem('protrader_journal', JSON.stringify(journal));
  }, [journal]);

  // Compute Master Portfolio Metrics
  const portfolioStats = useMemo(() => {
    let totalInvested = 0;
    let totalCurrent = 0;

    holdings.forEach((h) => {
      totalInvested += h.qty * h.avgPrice;
      totalCurrent += h.qty * h.cmp;
    });

    const totalPnl = totalCurrent - totalInvested;
    const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

    return { totalInvested, totalCurrent, totalPnl, totalPnlPercent };
  }, [holdings]);

  // Filtered Holdings
  const filteredHoldings = useMemo(() => {
    return holdings.filter(h => {
      const matchBroker = filterBroker === 'ALL' || h.broker === filterBroker;
      const matchAction = filterAction === 'ALL' || h.aiRecommendation === filterAction;
      return matchBroker && matchAction;
    });
  }, [holdings, filterBroker, filterAction]);

  // Calculate Journal Metrics
  const journalStats = useMemo(() => {
    const closed = journal.filter(j => j.status === 'CLOSED');
    const totalTrades = closed.length;
    const winningTrades = closed.filter(j => j.pnl > 0).length;
    const losingTrades = closed.filter(j => j.pnl <= 0).length;
    const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : 0;
    const totalPnl = closed.reduce((acc, j) => acc + j.pnl, 0);
    const totalProfit = closed.filter(j => j.pnl > 0).reduce((acc, j) => acc + j.pnl, 0);
    const totalLoss = Math.abs(closed.filter(j => j.pnl < 0).reduce((acc, j) => acc + j.pnl, 0));
    const profitFactor = totalLoss > 0 ? (totalProfit / totalLoss).toFixed(2) : totalProfit > 0 ? 'INF' : '0.00';

    return { totalTrades, winningTrades, losingTrades, winRate, totalPnl, profitFactor };
  }, [journal]);

  // Handlers
  const handleAddHolding = (e) => {
    e.preventDefault();
    const qty = Number(newHolding.qty);
    const avgPrice = Number(newHolding.avgPrice);
    const cmp = Number(newHolding.cmp);
    const dma50 = cmp * 0.95;
    const dma200 = cmp * 0.88;

    let rec = 'HOLD';
    let score = 75;
    let reason = 'Stock exhibits healthy baseline parameters. Maintain strict trailing stop loss discipline.';

    if (cmp > avgPrice * 1.15) {
      rec = 'TRIM';
      score = 65;
      reason = 'Gains exceed +15%. Consider partial profit booking to secure gains.';
    } else if (cmp < avgPrice * 0.90) {
      rec = 'EXIT';
      score = 30;
      reason = 'Stock trading 10% below average buy cost. Risk threshold exceeded.';
    }

    const item = {
      id: 'h_' + Date.now(),
      symbol: newHolding.symbol.toUpperCase(),
      name: newHolding.name || `${newHolding.symbol.toUpperCase()} Ltd.`,
      broker: newHolding.broker,
      qty,
      avgPrice,
      cmp,
      sector: newHolding.sector,
      marketCap: 'Mid/Large Cap',
      dma50,
      dma200,
      rsi: 52.4,
      addedDate: new Date().toISOString().split('T')[0],
      stopLoss: Number(newHolding.stopLoss),
      target: Number(newHolding.target),
      aiRecommendation: rec,
      aiScore: score,
      aiReason: reason
    };

    setHoldings([item, ...holdings]);
    setIsAddHoldingModal(false);
    setNewHolding({ symbol: '', name: '', broker: 'mStock', qty: 10, avgPrice: 100, cmp: 105, sector: 'Technology', stopLoss: 90, target: 130 });
  };

  const handleDeleteHolding = (id) => {
    setHoldings(holdings.filter(h => h.id !== id));
    if (selectedHolding?.id === id) setSelectedHolding(null);
  };

  const handleAddJournal = (e) => {
    e.preventDefault();
    const qty = Number(newJournal.qty);
    const entryPrice = Number(newJournal.entryPrice);
    const exitPrice = Number(newJournal.exitPrice);
    const pnl = (exitPrice - entryPrice) * qty;
    const pnlPercent = ((exitPrice - entryPrice) / entryPrice) * 100;

    const item = {
      id: 'j_' + Date.now(),
      symbol: newJournal.symbol.toUpperCase(),
      type: newJournal.type,
      entryDate: newJournal.entryDate,
      exitDate: newJournal.exitDate,
      entryPrice,
      exitPrice,
      qty,
      pnl,
      pnlPercent,
      status: 'CLOSED',
      setup: newJournal.setup,
      mistake: newJournal.mistake,
      tags: ['ManualEntry']
    };

    setJournal([item, ...journal]);
    setIsAddJournalModal(false);
  };

  const handleRunBacktest = () => {
    setIsBacktesting(true);
    setTimeout(() => {
      setIsBacktesting(false);
      setBacktestResults({
        cagr: '28.4%',
        maxDrawdown: '-8.2%',
        winRate: '68.5%',
        totalTrades: 42,
        sharpeRatio: '2.14',
        profitFactor: '2.85',
        equityCurve: [100, 108, 104, 118, 126, 122, 138, 145, 140, 158]
      });
    }, 1200);
  };

  const syncMstockData = () => {
    setMstockStatus(prev => ({ ...prev, lastSync: 'Refreshing...' }));
    setTimeout(() => {
      setMstockStatus({
        connected: true,
        lastSync: 'Just now',
        account: 'ACC-MSTOCK-88219'
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          {/* Logo Header */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-slate-800">
            <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-xl text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                ProTrader AI
              </h1>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Multi-Broker Terminal
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'portfolio' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Master Portfolio</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                {holdings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('journal')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'journal' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span>Trade Journal</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                {journalStats.winRate}% Win
              </span>
            </button>

            <button
              onClick={() => setActiveTab('screener')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'screener' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4" />
                <span>Swing Screener</span>
              </div>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full font-mono">
                6 Stocks
              </span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'news' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Newspaper className="w-4 h-4" />
                <span>Macro & News</span>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('backtest')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'backtest' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <FlaskConical className="w-4 h-4" />
                <span>Backtest Lab</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('algo')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'algo' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4" />
                <span>Algo Engine</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Broker API Connector Status */}
        <div className="mt-8 pt-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-semibold text-slate-200">mStock API</span>
              </div>
              <button 
                onClick={syncMstockData} 
                className="text-slate-400 hover:text-cyan-400 p-1 rounded transition-colors"
                title="Sync Live Prices"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Acc: {mstockStatus.account}</p>
            <p className="text-[10px] text-slate-500 mt-1">Sync: {mstockStatus.lastSync}</p>
          </div>

          <div className="px-2 text-center">
            <p className="text-[10px] text-slate-500">
              ProTrader AI Hub v2.4 • Free Cloud Setup
            </p>
          </div>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-950">
        
        {/* --- TAB 1: MASTER PORTFOLIO & AI ACTIONS --- */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            
            {/* Header & Quick Sync */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                  Consolidated Multi-Broker Portfolio
                  <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-medium border border-cyan-500/20">
                    Live Auto CMP
                  </span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Unified view across mStock & Goodwill accounts with dynamic AI recommendations
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsAddHoldingModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Add Holding
                </button>
              </div>
            </div>

            {/* Top Level Portfolio Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs font-medium text-slate-400">Total Invested Value</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2 font-mono">
                  ₹{portfolioStats.totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </h3>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  Across {holdings.length} stocks
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs font-medium text-slate-400">Current Market Value</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2 font-mono">
                  ₹{portfolioStats.totalCurrent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Auto-updated via mStock API
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs font-medium text-slate-400">Unrealized P&L</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className={`text-2xl font-bold font-mono ${portfolioStats.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {portfolioStats.totalPnl >= 0 ? '+' : ''}₹{portfolioStats.totalPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </h3>
                  <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                    portfolioStats.totalPnl >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {portfolioStats.totalPnlPercent >= 0 ? '+' : ''}{portfolioStats.totalPnlPercent.toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Overall Return</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs font-medium text-slate-400">AI Risk Health Score</p>
                <div className="flex items-center gap-3 mt-2">
                  <h3 className="text-2xl font-bold text-cyan-400 font-mono">82/100</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold">
                    Optimal Health
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">1 Stock flagged for Exit</p>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter Broker:
                </span>
                <select
                  value={filterBroker}
                  onChange={(e) => setFilterBroker(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Brokers</option>
                  <option value="mStock">mStock</option>
                  <option value="Goodwill">Goodwill</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-medium">AI Recommendation:</span>
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Actions</option>
                  <option value="BUY">BUY</option>
                  <option value="ADD">ADD</option>
                  <option value="HOLD">HOLD</option>
                  <option value="TRIM">TRIM</option>
                  <option value="EXIT">EXIT</option>
                </select>
              </div>
            </div>

            {/* Holdings Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Stock & Sector</th>
                      <th className="p-4">Broker</th>
                      <th className="p-4 text-right">Qty & Avg</th>
                      <th className="p-4 text-right">CMP & Trend</th>
                      <th className="p-4 text-right">P&L</th>
                      <th className="p-4 text-center">AI Action</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredHoldings.map((h) => {
                      const invested = h.qty * h.avgPrice;
                      const current = h.qty * h.cmp;
                      const pnl = current - invested;
                      const pnlPct = (pnl / invested) * 100;

                      let recBadgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
                      if (h.aiRecommendation === 'HOLD') recBadgeStyle = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                      if (h.aiRecommendation === 'ADD') recBadgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                      if (h.aiRecommendation === 'TRIM') recBadgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                      if (h.aiRecommendation === 'EXIT') recBadgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse';

                      return (
                        <tr key={h.id} className="hover:bg-slate-800/30 transition-colors group">
                          {/* Stock & Sector */}
                          <td className="p-4">
                            <div>
                              <div className="font-bold text-slate-100 flex items-center gap-2">
                                {h.symbol}
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                                  RSI: {h.rsi}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5">{h.name}</div>
                              <div className="text-[10px] text-slate-500 mt-1">{h.sector}</div>
                            </div>
                          </td>

                          {/* Broker Tag */}
                          <td className="p-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              h.broker === 'mStock' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            }`}>
                              {h.broker}
                            </span>
                          </td>

                          {/* Qty & Avg Price */}
                          <td className="p-4 text-right font-mono">
                            <div className="text-slate-200">{h.qty} shares</div>
                            <div className="text-xs text-slate-400 mt-0.5">₹{h.avgPrice.toFixed(2)}</div>
                          </td>

                          {/* CMP & DMA Status */}
                          <td className="p-4 text-right font-mono">
                            <div className="font-semibold text-slate-100">₹{h.cmp.toFixed(2)}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              50D: ₹{h.dma50.toFixed(0)} | 200D: ₹{h.dma200.toFixed(0)}
                            </div>
                          </td>

                          {/* P&L */}
                          <td className="p-4 text-right font-mono">
                            <div className={`font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(2)}
                            </div>
                            <div className={`text-xs ${pnlPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%)
                            </div>
                          </td>

                          {/* AI Recommendation */}
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedHolding(h)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-1.5 mx-auto ${recBadgeStyle}`}
                            >
                              <Sparkles className="w-3 h-3" />
                              {h.aiRecommendation}
                            </button>
                          </td>

                          {/* Action Button */}
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedHolding(h)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                                title="View AI Insights"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteHolding(h.id)}
                                className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                                title="Delete Holding"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Insights Modal / Panel */}
            {selectedHolding && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl space-y-5">
                  <button 
                    onClick={() => setSelectedHolding(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 text-cyan-400">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {selectedHolding.symbol} AI Diagnosis
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                          {selectedHolding.broker}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">{selectedHolding.name} • {selectedHolding.sector}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/40 p-4 rounded-xl border border-slate-800 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">CMP</span>
                      <span className="text-slate-200 font-bold">₹{selectedHolding.cmp}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Avg Price</span>
                      <span className="text-slate-200 font-bold">₹{selectedHolding.avgPrice}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Stop Loss</span>
                      <span className="text-rose-400 font-bold">₹{selectedHolding.stopLoss}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Target</span>
                      <span className="text-emerald-400 font-bold">₹{selectedHolding.target}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-200">Recommended Action</span>
                      <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                        {selectedHolding.aiRecommendation} (Score: {selectedHolding.aiScore}/100)
                      </span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm leading-relaxed text-slate-300">
                      <p className="font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
                        <Activity className="w-4 h-4" /> Actionable Thesis & Reasoning:
                      </p>
                      {selectedHolding.aiReason}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setSelectedHolding(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                    >
                      Close Analysis
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Holding Modal */}
            {isAddHoldingModal && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <form onSubmit={handleAddHolding} className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative space-y-4 shadow-2xl">
                  <button 
                    type="button"
                    onClick={() => setIsAddHoldingModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-cyan-400" /> Add New Holding
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Symbol (NSE)</label>
                      <input 
                        type="text" required placeholder="e.g. INFY"
                        value={newHolding.symbol} onChange={e => setNewHolding({...newHolding, symbol: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Broker</label>
                      <select 
                        value={newHolding.broker} onChange={e => setNewHolding({...newHolding, broker: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      >
                        <option value="mStock">mStock</option>
                        <option value="Goodwill">Goodwill</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Quantity</label>
                      <input 
                        type="number" required min="1"
                        value={newHolding.qty} onChange={e => setNewHolding({...newHolding, qty: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Avg Price (₹)</label>
                      <input 
                        type="number" required step="0.01"
                        value={newHolding.avgPrice} onChange={e => setNewHolding({...newHolding, avgPrice: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">CMP (₹)</label>
                      <input 
                        type="number" required step="0.01"
                        value={newHolding.cmp} onChange={e => setNewHolding({...newHolding, cmp: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Trailing Stop Loss (₹)</label>
                      <input 
                        type="number" required step="0.01"
                        value={newHolding.stopLoss} onChange={e => setNewHolding({...newHolding, stopLoss: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Target Price (₹)</label>
                      <input 
                        type="number" required step="0.01"
                        value={newHolding.target} onChange={e => setNewHolding({...newHolding, target: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20 mt-2"
                  >
                    Save & Run AI Diagnosis
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

        {/* --- TAB 2: AUTOMATED TRADING JOURNAL --- */}
        {activeTab === 'journal' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  Pro Trade Journal & Mistake Analytics
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Log swing setups & F&O trades to build a statistically sound edge
                </p>
              </div>

              <button 
                onClick={() => setIsAddJournalModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                Log Trade
              </button>
            </div>

            {/* Journal Metrics Header */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400">Win Rate</span>
                <h3 className="text-2xl font-bold text-emerald-400 font-mono mt-1">{journalStats.winRate}%</h3>
                <span className="text-[10px] text-slate-500">{journalStats.winningTrades} Wins / {journalStats.losingTrades} Losses</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400">Profit Factor</span>
                <h3 className="text-2xl font-bold text-cyan-400 font-mono mt-1">{journalStats.profitFactor}</h3>
                <span className="text-[10px] text-slate-500">Gross Win / Gross Loss</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400">Total Realized P&L</span>
                <h3 className={`text-2xl font-bold font-mono mt-1 ${journalStats.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {journalStats.totalPnl >= 0 ? '+' : ''}₹{journalStats.totalPnl.toLocaleString('en-IN')}
                </h3>
                <span className="text-[10px] text-slate-500">Closed Trades</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400">Top Mistake Flagged</span>
                <h3 className="text-sm font-bold text-amber-400 mt-1 truncate">Early Exit / Overtrading</h3>
                <span className="text-[10px] text-slate-500">AI behavioral feedback</span>
              </div>
            </div>

            {/* Journal Trades Log Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Symbol & Type</th>
                      <th className="p-4">Dates</th>
                      <th className="p-4 text-right">Entry / Exit</th>
                      <th className="p-4 text-right">P&L</th>
                      <th className="p-4">Setup / Strategy</th>
                      <th className="p-4">Mistake Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {journal.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white">{j.symbol}</div>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                            {j.type}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-400">
                          <div>In: {j.entryDate}</div>
                          <div>Out: {j.exitDate}</div>
                        </td>
                        <td className="p-4 text-right font-mono text-xs">
                          <div className="text-slate-300">In: ₹{j.entryPrice}</div>
                          <div className="text-slate-400">Out: ₹{j.exitPrice}</div>
                        </td>
                        <td className="p-4 text-right font-mono">
                          <div className={`font-bold ${j.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {j.pnl >= 0 ? '+' : ''}₹{j.pnl}
                          </div>
                          <div className={`text-xs ${j.pnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ({j.pnlPercent >= 0 ? '+' : ''}{j.pnlPercent.toFixed(2)}%)
                          </div>
                        </td>
                        <td className="p-4 text-xs text-slate-300">
                          <span className="px-2 py-1 bg-slate-800 rounded-md border border-slate-700/50 inline-block">
                            {j.setup}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-amber-300/80 italic">
                          "{j.mistake}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Log New Trade */}
            {isAddJournalModal && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <form onSubmit={handleAddJournal} className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative space-y-4 shadow-2xl">
                  <button 
                    type="button"
                    onClick={() => setIsAddJournalModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" /> Log Completed Trade
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Symbol</label>
                      <input 
                        type="text" required placeholder="e.g. TATAMOTORS"
                        value={newJournal.symbol} onChange={e => setNewJournal({...newJournal, symbol: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Trade Type</label>
                      <select 
                        value={newJournal.type} onChange={e => setNewJournal({...newJournal, type: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      >
                        <option value="SWING BUY">SWING BUY</option>
                        <option value="F&O BUY">F&O BUY</option>
                        <option value="F&O SELL">F&O SELL</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Quantity</label>
                      <input 
                        type="number" required
                        value={newJournal.qty} onChange={e => setNewJournal({...newJournal, qty: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Entry (₹)</label>
                      <input 
                        type="number" required step="0.01"
                        value={newJournal.entryPrice} onChange={e => setNewJournal({...newJournal, entryPrice: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Exit (₹)</label>
                      <input 
                        type="number" required step="0.01"
                        value={newJournal.exitPrice} onChange={e => setNewJournal({...newJournal, exitPrice: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Strategy / Setup Tag</label>
                    <input 
                      type="text" required placeholder="e.g. 50 DMA Bounce / Cup & Handle"
                      value={newJournal.setup} onChange={e => setNewJournal({...newJournal, setup: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Mistake / Lessons Learned</label>
                    <input 
                      type="text" placeholder="e.g. Moved stop loss during trade"
                      value={newJournal.mistake} onChange={e => setNewJournal({...newJournal, mistake: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-xs shadow-lg shadow-emerald-500/20 mt-2"
                  >
                    Log Trade Entry
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: CUSTOM SWING SCREENER --- */}
        {activeTab === 'screener' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  Custom Swing & Momentum Screener
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Filters stocks breaking out above 50/200 DMA with volume confirmation
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  ⚡ Auto-scanning NSE 500
                </span>
              </div>
            </div>

            {/* Screener Preset Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button className="px-3.5 py-1.5 bg-cyan-500 text-slate-950 font-semibold rounded-xl text-xs shadow-md shadow-cyan-500/20">
                All Breakouts
              </button>
              <button className="px-3.5 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-medium border border-slate-700">
                Volume Spikes &gt; 2x
              </button>
              <button className="px-3.5 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-medium border border-slate-700">
                50 DMA Support Pullbacks
              </button>
              <button className="px-3.5 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-medium border border-slate-700">
                RSI Momentum (60-70)
              </button>
            </div>

            {/* Screener Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SCREENER_STOCKS.map((stock, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition-all space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white font-mono">{stock.symbol}</h3>
                      <p className="text-xs text-slate-400">{stock.sector}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold rounded-lg">
                      Score: {stock.score}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between border-y border-slate-800 py-3 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">CMP</span>
                      <span className="text-slate-100 font-bold text-base">₹{stock.cmp}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">24h Change</span>
                      <span className={`text-sm font-semibold ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Setup Pattern:</span>
                      <span className="text-slate-200 font-medium">{stock.setup}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Volume Spike:</span>
                      <span className="text-emerald-400 font-semibold">{stock.volumeSpike}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>DMA Trend:</span>
                      <span className="text-cyan-400 font-medium">{stock.dmaStatus}</span>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add to Swing Watchlist
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 4: MACRO & PORTFOLIO NEWS FEED --- */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  Macro & Stock News Intelligence
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  AI-filtered headline analysis for holding stocks and RBI/Fed macro policy
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {NEWS_FEED.map((item) => {
                let badgeClass = 'bg-slate-800 text-slate-300';
                if (item.sentiment === 'BULLISH') badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                if (item.sentiment === 'BEARISH') badgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                if (item.sentiment === 'NEUTRAL') badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

                return (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-400 font-mono bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                          {item.symbol}
                        </span>
                        <span className="text-xs text-slate-500">{item.source} • {item.time}</span>
                      </div>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${badgeClass}`}>
                        {item.sentiment}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-100 hover:text-cyan-400 transition-colors cursor-pointer">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- TAB 5: STRATEGY BACKTESTER --- */}
        {activeTab === 'backtest' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                Swing & F&O Backtesting Lab
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Simulate quantitative strategies over historical Indian stock price datasets
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Backtest Config Inputs */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Strategy Configuration</h3>
                
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Strategy Rule</label>
                  <select 
                    value={backtestParams.strategy}
                    onChange={(e) => setBacktestParams({...backtestParams, strategy: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl p-2.5"
                  >
                    <option value="50/200 DMA Golden Cross">50/200 DMA Golden Cross</option>
                    <option value="RSI Oversold (30) Mean Reversion">RSI Oversold (30) Mean Reversion</option>
                    <option value="Multi-Month High Breakout + Volume">Multi-Month High Breakout + Volume</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Testing Period</label>
                  <select 
                    value={backtestParams.timeframe}
                    onChange={(e) => setBacktestParams({...backtestParams, timeframe: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl p-2.5"
                  >
                    <option value="1 Year">1 Year (2023 - 2024)</option>
                    <option value="3 Years">3 Years (2021 - 2024)</option>
                    <option value="5 Years">5 Years (2019 - 2024)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Stop Loss (%)</label>
                    <input 
                      type="number" value={backtestParams.stopLossPct}
                      onChange={(e) => setBacktestParams({...backtestParams, stopLossPct: Number(e.target.value)})}
                      className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Target (%)</label>
                    <input 
                      type="number" value={backtestParams.targetPct}
                      onChange={(e) => setBacktestParams({...backtestParams, targetPct: Number(e.target.value)})}
                      className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunBacktest}
                  disabled={isBacktesting}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isBacktesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  {isBacktesting ? 'Running Simulation...' : 'Execute Backtest'}
                </button>
              </div>

              {/* Backtest Results Area */}
              <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 mb-4">Backtest Performance Metrics</h3>

                  {backtestResults ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">CAGR Return</span>
                          <span className="text-xl font-bold text-emerald-400 font-mono">{backtestResults.cagr}</span>
                        </div>
                        <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Max Drawdown</span>
                          <span className="text-xl font-bold text-rose-400 font-mono">{backtestResults.maxDrawdown}</span>
                        </div>
                        <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Win Rate</span>
                          <span className="text-xl font-bold text-cyan-400 font-mono">{backtestResults.winRate}</span>
                        </div>
                        <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Sharpe Ratio</span>
                          <span className="text-xl font-bold text-purple-400 font-mono">{backtestResults.sharpeRatio}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs text-slate-400 mb-2">Simulated Equity Growth Curve</h4>
                        <div className="h-32 bg-slate-950 rounded-xl border border-slate-800 p-4 flex items-end justify-between gap-2">
                          {backtestResults.equityCurve.map((val, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                              <div 
                                style={{ height: `${(val / 160) * 100}%` }}
                                className="w-full bg-gradient-to-t from-cyan-600 to-blue-400 rounded-t-sm"
                              ></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center text-slate-500 space-y-2">
                      <FlaskConical className="w-8 h-8 text-slate-600" />
                      <p className="text-xs">Select strategy criteria and click 'Execute Backtest'</p>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-slate-500 text-center mt-4 border-t border-slate-800/60 pt-3">
                  Past backtested performance does not guarantee future market returns. Always manage risk.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 6: ALGO TRADING ENGINE --- */}
        {activeTab === 'algo' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  Automated Algo Rules Engine
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Connect condition triggers directly to your mStock API key for automated execution
                </p>
              </div>

              <span className="text-xs px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                mStock API Active
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-sm font-bold text-slate-200">Rule #1: Overbought Exit Trigger</span>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono">
                    STATUS: ACTIVE
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 space-y-1">
                  <p><span className="text-purple-400">IF</span> (Stock.RSI &gt; 75) <span className="text-purple-400">AND</span> (Profit_Percent &gt; 15%)</p>
                  <p><span className="text-purple-400">THEN</span> Trigger Telegram Alert + Send mStock API Sell Order (25% Qty)</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-sm font-bold text-slate-200">Rule #2: Trailing Stop Loss Defender</span>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono">
                    STATUS: ACTIVE
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-rose-300 space-y-1">
                  <p><span className="text-purple-400">IF</span> (CMP &lt; Stock.StopLoss_Threshold)</p>
                  <p><span className="text-purple-400">THEN</span> Auto Exit Full Position via mStock Market Order</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}