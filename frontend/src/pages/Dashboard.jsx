const navItems = [
  { id: 'home', label: 'Home', icon: 'H' },
  { id: 'scan', label: 'Scan', icon: 'S' },
  { id: 'coach', label: 'AI Coach', icon: 'A' },
  { id: 'progress', label: 'Progress', icon: 'P' },
  { id: 'profile', label: 'Profile', icon: 'F' },
]

function Sidebar({ activePage, onNavigate, onLogout }) {
  return (
    <aside className="dashboard-sidebar">
      <button type="button" className="sidebar-brand" onClick={() => onNavigate('home')} aria-label="Go to home">
        <span className="brand-dot">NF</span>
        <span>NutriFit AI</span>
      </button>

      <nav className="sidebar-nav" aria-label="Dashboard navigation">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`sidebar-link ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <button type="button" className="sidebar-logout" onClick={onLogout}>
        <span className="nav-icon" aria-hidden="true">L</span>
        Logout
      </button>
    </aside>
  )
}

function HomePage({ user, bmi, onNavigate }) {
  const stats = [
    { label: 'Age', value: user.age },
    { label: 'Height', value: `${user.height} cm` },
    { label: 'Weight', value: `${user.weight} kg` },
    { label: 'BMI', value: bmi },
  ]

  return (
    <>
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Home</p>
          <h1>Hello, {user.fullname}</h1>
          <p>Your current goal is <strong>{user.fitnessGoal}</strong>. Keep your numbers updated and make today's meals count.</p>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((item) => (
          <article className="stat-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="dashboard-section quick-actions">
        <div>
          <p className="eyebrow">Your routine</p>
          <h2>Make today count</h2>
          <p className="muted">Use your tools to stay consistent with your fitness goal.</p>
        </div>
        <div className="action-grid">
          <button type="button" onClick={() => onNavigate('scan')}><strong>Scan a meal</strong><span>Get a nutrition snapshot</span></button>
          <button type="button" onClick={() => onNavigate('coach')}><strong>Ask your coach</strong><span>Get a guided suggestion</span></button>
        </div>
      </section>
    </>
  )
}

function StaticPage({ activePage, user, onNavigate }) {
  const content = {
    scan: {
      eyebrow: 'Nutrition tool',
      title: 'Scan your meal',
      description: 'Upload or scan a meal to see its nutrition details. This feature is ready for your camera and food database integration.',
      action: 'Start a scan',
    },
    coach: {
      eyebrow: 'Personal guidance',
      title: 'AI Coach',
      description: `Your coach will help you stay on track with your goal to ${user.fitnessGoal}. Ask questions and get practical next steps here.`,
      action: 'Start a conversation',
    },
    progress: {
      eyebrow: 'Your journey',
      title: 'Progress',
      description: 'Track your weight, measurements, meals, and habits over time. Progress charts will appear here once tracking is connected.',
      action: 'Log an update',
    },
    profile: {
      eyebrow: 'Account details',
      title: 'Profile',
      description: 'Review your personal information and fitness goal. Editing will be connected here in the next step.',
      action: 'Edit profile',
    },
  }[activePage]

  return (
    <section className="static-page">
      <div className="static-heading">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="muted">{content.description}</p>
      </div>
      <div className="placeholder-panel">
        <span className="placeholder-icon" aria-hidden="true">{activePage.slice(0, 1).toUpperCase()}</span>
        <h2>{content.title} workspace</h2>
        <p className="muted">Static preview for now. Your data and actions will be connected here.</p>
        <button type="button" className="primary-btn" onClick={() => onNavigate('home')}>Back to home</button>
      </div>
    </section>
  )
}

export default function Dashboard({ user, activePage = 'home', onLogout, onNavigate }) {
  if (!user) {
    return (
      <main className="dashboard-page">
        <section className="empty-state">
          <h1>Login Required</h1>
          <p>Please login first to view your dashboard.</p>
          <button type="button" className="primary-btn" onClick={() => onNavigate('login')}>
            Go to Login
          </button>
        </section>
      </main>
    )
  }

  const bmi = user.height && user.weight
    ? (Number(user.weight) / ((Number(user.height) / 100) ** 2)).toFixed(1)
    : 'N/A'

  return (
    <main className="dashboard-layout">
      <Sidebar activePage={activePage} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="dashboard-main">
        <header className="mobile-topbar">
          <button type="button" className="sidebar-brand" onClick={() => onNavigate('home')}>
            <span className="brand-dot">NF</span>
            <span>NutriFit AI</span>
          </button>
          <button type="button" className="mobile-logout" onClick={onLogout}>Logout</button>
        </header>
        {activePage === 'home' ? <HomePage user={user} bmi={bmi} onNavigate={onNavigate} /> : <StaticPage activePage={activePage} user={user} onNavigate={onNavigate} />}
      </div>
    </main>
  )
}
