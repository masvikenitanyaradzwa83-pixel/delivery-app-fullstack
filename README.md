:root {
  --bg: #f5f7fb;
  --panel: #ffffff;
  --primary: #ff7a18;
  --primary-dark: #e56400;
  --secondary: #1f3a5f;
  --text: #1a1d2a;
  --muted: #69748a;
  --border: #e7ebf2;
  --success: #11998e;
  --shadow: 0 18px 40px rgba(28, 39, 60, 0.08);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #f8fafc 0%, #eef3ff 100%);
  color: var(--text);
}

button, input, textarea, select {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.brand-area {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--primary), #ffb166);
  color: white;
  display: grid;
  place-items: center;
  font-weight: 800;
  box-shadow: var(--shadow);
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: var(--muted);
}

h1 {
  margin: 4px 0 0;
  font-size: clamp(1.8rem, 2.3vw, 2.5rem);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-tag {
  border: 1px solid var(--border);
  background: white;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 700;
  color: var(--secondary);
}

.auth-switcher {
  display: inline-flex;
  border: 1px solid var(--border);
  background: white;
  border-radius: 999px;
  padding: 4px;
}

.auth-switcher button,
.secondary-btn {
  border: none;
  background: transparent;
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 700;
  color: var(--secondary);
}

.auth-switcher button.active,
.secondary-btn {
  background: rgba(31, 58, 95, 0.08);
}

.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow);
  padding: 28px;
}

.auth-panel {
  max-width: 560px;
  margin: 0 auto;
}

.auth-form, .order-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.section-heading {
  margin-bottom: 20px;
}

.section-heading h2 {
  margin: 12px 0 0;
  font-size: 1.7rem;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 600;
  color: var(--secondary);
}

input, textarea, select {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  background: #f9fbff;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.badge {
  display: inline-block;
  background: rgba(255, 122, 24, 0.12);
  color: var(--primary-dark);
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.badge.alt {
  background: rgba(31, 58, 95, 0.08);
  color: var(--secondary);
}

.payment-block {
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
  background: #fafcff;
}

.payment-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 600;
}

.payment-option input {
  width: auto;
  accent-color: var(--primary);
}

.cash-box {
  margin-top: 12px;
  background: rgba(17, 153, 142, 0.08);
  border: 1px solid rgba(17, 153, 142, 0.15);
  border-radius: 12px;
  padding: 14px;
}

.cash-box p {
  margin: 6px 0 0;
  color: var(--secondary);
}

.submit-btn {
  border: none;
  border-radius: 12px;
  padding: 14px 18px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  font-weight: 800;
  box-shadow: 0 18px 28px rgba(255, 122, 24, 0.26);
}

.submit-btn.small {
  padding: 10px 12px;
  font-size: 0.82rem;
}

.main-grid {
  display: grid;
  grid-template-columns: 1.5fr 0.9fr;
  gap: 26px;
}

.summary-panel {
  align-self: start;
}

.summary-card {
  background: linear-gradient(180deg, #fff6f0 0%, #fffdfd 100%);
  border: 1px solid rgba(255, 122, 24, 0.12);
  border-radius: 18px;
  padding: 18px;
}

.small-label {
  margin: 0 0 10px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
}

.summary-card h3 {
  margin: 0 0 18px;
  font-size: 1.5rem;
}

.row, .total-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(31, 58, 95, 0.08);
  color: var(--secondary);
}

.total-row {
  margin-top: 10px;
  border-bottom: none;
  font-size: 1.1rem;
}

.recent-orders, .admin-section, .driver-section {
  margin-top: 28px;
}

.recent-orders h3, .admin-section h3 {
  margin-bottom: 12px;
}

.order-item, .admin-order-row, .driver-order-card {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 12px;
}

.order-item h4, .driver-order-card h4 {
  margin: 0 0 6px;
}

.order-item p, .driver-order-card p, .admin-order-row p {
  margin: 0;
  color: var(--muted);
  font-size: 0.82rem;
}

.order-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  font-weight: 700;
  color: var(--secondary);
}

.order-meta small {
  color: var(--muted);
  font-weight: 600;
}

.admin-panel, .driver-panel {
  width: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-box {
  background: #f9fbff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-box span {
  color: var(--muted);
}

.stat-box strong {
  font-size: 1.5rem;
  color: var(--secondary);
}

.driver-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

@media (max-width: 900px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .two-col, .stats-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }

  .panel {
    padding: 20px 18px;
  }
}
