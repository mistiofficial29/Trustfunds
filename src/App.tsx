
import { useState } from "react";
import "./index.css";

type Campaign = {
  id: number;
  title: string;
  category: string;
  description: string;
  goal: number;
  raised: number;
  color: string;
  icon: string;
};

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    title: "Community Flood Relief",
    category: "Disaster Relief",
    description:
      "Help families access food, clean water, and essential supplies after flooding.",
    goal: 100000,
    raised: 67500,
    color: "blue",
    icon: "🌊",
  },
  {
    id: 2,
    title: "Rural Medical Supply Fund",
    category: "Healthcare",
    description:
      "Support essential medical supplies for underserved rural communities.",
    goal: 150000,
    raised: 92000,
    color: "green",
    icon: "🏥",
  },
  {
    id: 3,
    title: "School Learning Equipment",
    category: "Education",
    description:
      "Help students access books, learning materials, and classroom equipment.",
    goal: 80000,
    raised: 38400,
    color: "orange",
    icon: "📚",
  },
];

const STORAGE_KEY = "trustfund_campaigns";

function loadCampaigns(): Campaign[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved) as Campaign[];
    }
  } catch {
    console.error("Could not load saved campaigns.");
  }

  return initialCampaigns;
}

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function App() {
  const [campaigns, setCampaigns] =
  useState<Campaign[]>(loadCampaigns);
  const [activePage, setActivePage] = useState("Overview");
  const [search, setSearch] = useState("");
  const [selectedCampaign, setSelectedCampaign] =
    useState<Campaign | null>(null);
  const [donation, setDonation] = useState("500");
  const [notice, setNotice] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Healthcare");const [newDescription, setNewDescription] = useState("");
  const [newGoal, setNewGoal] = useState("50000");


  const totalRaised = campaigns.reduce(
    (total, campaign) => total + campaign.raised,
    0
  );

  const filteredCampaigns = campaigns.filter((campaign) =>
    `${campaign.title} ${campaign.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function handleDemoDonation() {
    const amount = Number(donation);

    if (!selectedCampaign || !Number.isFinite(amount) || amount <= 0) {
      setNotice("Enter a valid donation amount.");
      return;
    } 

    setCampaigns((previous) =>
      previous.map((campaign) =>
        campaign.id === selectedCampaign.id
          ? { ...campaign, raised: campaign.raised + amount }
          : campaign
      )
    );

    setNotice(
      `Demo donation of ${money(amount)} recorded in the interface. No real money or blockchain transaction was used.`
    );
    setSelectedCampaign(null);
    setDonation("500");
  }

  const navItems = [
    { label: "Overview", icon: "▦" },
    { label: "Campaigns", icon: "♡" },
    { label: "Transparency", icon: "◈" },
    { label: "TrustLens AI", icon: "✳" },
  ];

  function createCampaign() {
  const goal = Number(newGoal);

  if (
    !newTitle.trim() ||
    !newDescription.trim() ||
    !Number.isFinite(goal) ||
    goal <= 0
  ) {
    setNotice("Enter a title, description, and valid funding goal.");
    return;
  }

  const campaign: Campaign = {
    id: Date.now(),
    title: newTitle.trim(),
    category: newCategory,
    description: newDescription.trim(),
    goal,
    raised: 0,
    color:
      newCategory === "Healthcare"
        ? "green"
        : newCategory === "Education"
          ? "orange"
          : "blue",
    icon:
      newCategory === "Healthcare"
        ? "🏥"
        : newCategory === "Education"
          ? "📚"
          : "🌱",
  };

  const updated = [campaign, ...campaigns];

  setCampaigns(updated);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  setNewTitle("");
  setNewDescription("");
  setNewGoal("50000");
  setShowCreateForm(false);
  setActivePage("Campaigns");
  setNotice("Campaign created successfully in local demo storage.");
}

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#home"
          onClick={() => setActivePage("Overview")}
        >
          <span className="brand-mark">T</span>
          <span>
            <strong>TrustFund</strong>
            <small>Giving with confidence</small>
          </span>
        </a>

        <div className="side-label">WORKSPACE</div>

        <nav className="navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${
                activePage === item.label ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(item.label);
                setNotice("");
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.label === "TrustLens AI" && (
                <span className="new-tag">AI</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="trust-card">
            <div className="trust-icon">✓</div>
            <strong>Transparency first</strong>
            <p>
              Every recorded donation deserves a clear and traceable history.
            </p>
          </div>
          <div className="profile">
            <div className="avatar">TF</div>
            <div>
              <strong>Demo workspace</strong>
              <small>Development mode</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> {activePage}
          </div>
          <div className="topbar-right">
            <span className="network-indicator">
              <span className="status-dot" />
              Demo mode
            </span>
            <button
              className="wallet-button"
              onClick={() =>
                setNotice(
                  "Wallet integration will be added in the Web3 development step."
                )
              }
            >
              ◈ Connect wallet
            </button>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">TRANSPARENT GIVING, REAL ACCOUNTABILITY</div>
              <h1>
                {activePage === "Overview"
                  ? "Good things start with trust."
                  : activePage}
              </h1>
              <p className="subtitle">
                Track campaigns, understand where funds go, and explore
                transparent charitable giving.
              </p>
            </div>
            
<div className="welcome-actions">
  <button
    className="secondary-button"
    onClick={() => {
      setShowCreateForm(true);
      setNotice("");
    }}
  >
    + Create campaign
  </button>

  <button
    className="primary-button"
    onClick={() => {
      setActivePage("Campaigns");
      setSearch("");
    }}
  >
    Explore campaigns →
  </button>
</div>

          </section>

          {showCreateForm && (
  <div
    className="modal-backdrop"
    onClick={() => setShowCreateForm(false)}
  >
    <section
      className="donation-modal create-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-campaign-title"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        className="modal-close"
        onClick={() => setShowCreateForm(false)}
        aria-label="Close form"
      >
        ×
      </button>

      <div className="eyebrow">START A NEW INITIATIVE</div>
      <h2 id="create-campaign-title">Create a campaign</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          createCampaign();
        }}
      >
        <label className="amount-label" htmlFor="campaign-title">
          Campaign title
        </label>
        <input
          id="campaign-title"
          className="amount-input"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          maxLength={100}
          required
          placeholder="e.g. Community Food Support"
        />

        <label className="amount-label" htmlFor="campaign-category">
          Category
        </label>
        <select
          id="campaign-category"
          className="amount-input"
          value={newCategory}
          onChange={(event) => setNewCategory(event.target.value)}
        >
          <option>Healthcare</option>
          <option>Education</option>
          <option>Disaster Relief</option>
          <option>Community Support</option>
        </select>

        <label className="amount-label" htmlFor="campaign-description">
          Description
        </label>
        <textarea
          id="campaign-description"
          className="amount-input"
          value={newDescription}
          onChange={(event) => setNewDescription(event.target.value)}
          maxLength={1000}
          required
          rows={3}
          placeholder="Explain who the campaign will help."
        />

        <label className="amount-label" htmlFor="campaign-goal">
          Funding goal (₹)
        </label>
        <input
          id="campaign-goal"
          className="amount-input"
          type="number"
          min="1"
          step="1"
          value={newGoal}
          onChange={(event) => setNewGoal(event.target.value)}
          required
        />

        <button className="primary-button full-width" type="submit">
          Create campaign
        </button>
      </form>

      <p className="modal-disclaimer">
        Demo mode: this campaign is saved in this browser only. It is not
        yet registered on a blockchain or published to a shared database.
      </p>
    </section>
  </div>
)}

          {notice && (
            <div className="notice" role="status">
              <span>{notice}</span>
              <button onClick={() => setNotice("")} aria-label="Dismiss">
                ×
              </button>
            </div>
          )}

          {activePage === "TrustLens AI" ? (
            <section className="panel feature-panel">
              <div className="feature-icon">✳</div>
              <div className="eyebrow">TRUSTLENS</div>
              <h2>Understand expense risks.</h2>
              <p>
                TrustLens will check for duplicate evidence, unusual expense
                amounts, and budget inconsistencies. Findings will support
                human review, not automatically declare fraud.
              </p>
              <div className="coming-soon">AI MODULE · IN DEVELOPMENT</div>
            </section>
          ) : activePage === "Transparency" ? (
            <section className="panel">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">PUBLIC ACCOUNTABILITY</div>
                  <h2>Transparency overview</h2>
                </div>
                <span className="demo-label">Sample data</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Funds raised</th>
                      <th>Goal progress</th>
                      <th>Record status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id}>
                        <td>{campaign.title}</td>
                        <td>{money(campaign.raised)}</td>
                        <td>
                          {Math.round(
                            (campaign.raised / campaign.goal) * 100
                          )}
                          %
                        </td>
                        <td>
                          <span className="status-pill">Demo record</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="disclaimer">
                These totals are sample interface data, not blockchain-verified
                donations or audited charity accounts.
              </p>
            </section>
          ) : (
            <>
              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-top">
                    <span>Total shown as raised</span>
                    <span className="stat-icon purple">₹</span>
                  </div>
                  <h2>{money(totalRaised)}</h2>
                  <p>Across demo campaigns</p>
                </div>
                <div className="stat-card">
                  <div className="stat-top">
                    <span>Active campaigns</span>
                    <span className="stat-icon blue">♡</span>
                  </div>
                  <h2>{campaigns.length}</h2>
                  <p>Sample fundraising projects</p>
                </div>
                <div className="stat-card">
                  <div className="stat-top">
                    <span>Expense verification</span>
                    <span className="stat-icon green">✓</span>
                  </div>
                  <h2>Not connected</h2>
                  <p>Review system is not yet implemented</p>
                </div>
              </section>

              <section className="panel">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow">MAKE AN IMPACT</div>
                    <h2>
                      {activePage === "Campaigns"
                        ? "Explore all campaigns"
                        : "Featured campaigns"}
                    </h2>
                    <p>Find a cause you want to support.</p>
                  </div>
                  <label className="search-box">
                    <span>⌕</span>
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search campaigns"
                      aria-label="Search campaigns"
                    />
                  </label>
                </div>

                <div className="campaign-grid">
                  {filteredCampaigns.map((campaign) => {
                    const progress = Math.min(
                      100,
                      Math.round((campaign.raised / campaign.goal) * 100)
                    );

                    return (
                      <article className="campaign-card" key={campaign.id}>
                        <div className={`campaign-art ${campaign.color}`}>
                          <span className="campaign-emoji">
                            {campaign.icon}
                          </span>
                          <span className="category-tag">
                            {campaign.category}
                          </span>
                        </div>

                        <div className="campaign-body">
                          <h3>{campaign.title}</h3>
                          <p className="campaign-description">
                            {campaign.description}
                          </p>

                          <div className="progress-label">
                            <strong>{money(campaign.raised)}</strong>
                            <span>{progress}%</span>
                          </div>
                          <div
                            className="progress-track"
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${campaign.title} funding progress`}
                          >
                            <div
                              className="progress-fill"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="goal-label">
                            <span>Raised</span>
                            <span>Goal {money(campaign.goal)}</span>
                          </div>

                          <button
                            className="donate-button"
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setNotice("");
                            }}
                          >
                            View donation options <span>→</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {filteredCampaigns.length === 0 && (
                  <div className="empty-state">
                    <h3>No campaigns found</h3>
                    <p>Try another campaign name or category.</p>
                  </div>
                )}
              </section>
            </>
          )}

          <footer className="page-footer">
            <span>TrustFund · Hackathon prototype</span>
            <span>Transparent giving starts with verifiable records.</span>
          </footer>
        </div>
      </main>

      {selectedCampaign && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedCampaign(null)}
        >
          <section
            className="donation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="donation-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedCampaign(null)}
              aria-label="Close dialog"
            >
              ×
            </button>
            <div className="modal-emoji">{selectedCampaign.icon}</div>
            <div className="eyebrow">SUPPORT A CAUSE</div>
            <h2 id="donation-title">{selectedCampaign.title}</h2>
            <p>{selectedCampaign.description}</p>
            <label className="amount-label" htmlFor="donation-amount">
              Demo contribution amount (₹)
            </label>
            <input
              id="donation-amount"
              className="amount-input"
              type="number"
              min="1"
              step="1"
              value={donation}
              onChange={(event) => setDonation(event.target.value)}
            />
            <div className="amount-presets">
              {[500, 1000, 2000].map((amount) => (
                <button
                  key={amount}
                  className={Number(donation) === amount ? "selected" : ""}
                  onClick={() => setDonation(String(amount))}
                >
                  ₹{amount.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
            <button
              className="primary-button full-width"
              onClick={handleDemoDonation}
            >
              Try demo contribution
            </button>
            <p className="modal-disclaimer">
              Demo only. This changes the sample interface total; no real
              money is transferred and no blockchain transaction is created.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
