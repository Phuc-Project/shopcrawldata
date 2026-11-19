/**
 * OpportunityOS Main Application Controller (Giao diện Tiếng Việt)
 * Matching template design & preserving 100% of OpportunityOS features
 */

import { OPPORTUNITIES, EARLY_ALERTS, PRINTWAY_CATALOG } from './data.js';
import { CopilotSimulator } from './copilot.js';
import { ReportManager } from './report.js';

class OpportunityApp {
  constructor() {
    this.opportunities = [...OPPORTUNITIES];
    this.alerts = [...EARLY_ALERTS];
    this.copilot = null;
    this.reportManager = null;
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.categoryFilter = 'all';
    this.sortBy = 'score';

    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initMagneticCursor();
      this.initModules();
      this.renderFeed(this.getFilteredOpportunities());
      this.renderComparisonTable();
      this.renderTrendAlerts();
      this.bindEvents();
    });
  }

  initMagneticCursor() {
    const dot = document.querySelector('.custom-cursor-dot');
    const ring = document.querySelector('.custom-cursor-ring');
    if (!dot || !ring) return;

    let targetX = 0, targetY = 0;
    let ringX = 0, ringY = 0;

    const interactiveSelectors = 'a, button, select, input, .chip, .prompt-btn, .view-report-btn';

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      dot.style.transform = `translate(${targetX}px, ${targetY}px)`;

      const target = e.target;
      const interactive = target ? target.closest(interactiveSelectors) : null;
      if (interactive) {
        ring.classList.add('hovering');
        const rect = interactive.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = targetX - centerX;
        const deltaY = targetY - centerY;
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (dist < 70) {
          targetX = targetX - deltaX * 0.25;
          targetY = targetY - deltaY * 0.25;
        }
      } else {
        ring.classList.remove('hovering');
      }
    });

    const render = () => {
      ringX += (targetX - ringX) * 0.2;
      ringY += (targetY - ringY) * 0.2;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  initModules() {
    this.copilot = new CopilotSimulator('chat-history', 'chat-input', 'chat-send-btn');
    this.reportManager = new ReportManager('report-modal', 'modal-title-text', 'modal-body-content', 'modal-close-btn');
  }

  getFilteredOpportunities() {
    let items = this.opportunities.filter(opp => {
      const search = this.searchTerm.toLowerCase();
      const matchSearch = !this.searchTerm || 
        opp.title.toLowerCase().includes(search) ||
        (opp.title_en && opp.title_en.toLowerCase().includes(search)) ||
        opp.niche.toLowerCase().includes(search) ||
        opp.category.toLowerCase().includes(search) ||
        opp.material.toLowerCase().includes(search);

      const matchStatus = this.statusFilter === 'all' || 
        opp.recommendation.toLowerCase() === this.statusFilter.toLowerCase();

      const matchCategory = this.categoryFilter === 'all' || 
        opp.category_id === this.categoryFilter ||
        opp.category.toLowerCase().includes(this.categoryFilter.toLowerCase());

      return matchSearch && matchStatus && matchCategory;
    });

    // Sorting
    if (this.sortBy === 'score') {
      items.sort((a, b) => b.score - a.score);
    } else if (this.sortBy === 'growth') {
      items.sort((a, b) => b.metrics.growth - a.metrics.growth);
    } else if (this.sortBy === 'fit') {
      items.sort((a, b) => b.printway_fit - a.printway_fit);
    }

    return items;
  }

  bindEvents() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const mobileClose = document.getElementById('mobile-menu-close');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => mobileDrawer.classList.add('active'));
    }
    if (mobileClose && mobileDrawer) {
      mobileClose.addEventListener('click', () => mobileDrawer.classList.remove('active'));
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileDrawer) mobileDrawer.classList.remove('active');
      });
    });

    // Hero search bar input
    const heroInput = document.getElementById('hero-search-input');
    const heroBtn = document.getElementById('hero-search-btn');

    if (heroInput && heroBtn) {
      const handleSearch = () => {
        const query = heroInput.value.trim();
        if (query) {
          const copilotSec = document.getElementById('copilot-section');
          if (copilotSec) copilotSec.scrollIntoView({ behavior: 'smooth' });
          if (this.copilot) this.copilot.ask(query);
        }
      };
      heroBtn.addEventListener('click', handleSearch);
      heroInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
      });
    }

    // Prompt chips
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-prompt') || chip.textContent;
        const copilotSec = document.getElementById('copilot-section');
        if (copilotSec) copilotSec.scrollIntoView({ behavior: 'smooth' });
        if (this.copilot) this.copilot.ask(text);
      });
    });

    // Copilot Sidebar suggested prompt buttons
    document.querySelectorAll('.prompt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-prompt');
        if (this.copilot && text) this.copilot.ask(text);
      });
    });

    // Feed Search & Filter Controls
    const feedSearchInput = document.getElementById('feed-search-input');
    const statusFilter = document.getElementById('filter-status');
    const categoryFilter = document.getElementById('filter-category');
    const sortByFilter = document.getElementById('feed-sort-by');

    const updateFeed = () => {
      this.searchTerm = feedSearchInput ? feedSearchInput.value.trim() : '';
      this.statusFilter = statusFilter ? statusFilter.value : 'all';
      this.categoryFilter = categoryFilter ? categoryFilter.value : 'all';
      this.sortBy = sortByFilter ? sortByFilter.value : 'score';

      const filtered = this.getFilteredOpportunities();
      const countBadge = document.getElementById('feed-count');
      if (countBadge) countBadge.textContent = filtered.length;

      this.renderFeed(filtered);
    };

    if (feedSearchInput) feedSearchInput.addEventListener('input', updateFeed);
    if (statusFilter) statusFilter.addEventListener('change', updateFeed);
    if (categoryFilter) categoryFilter.addEventListener('change', updateFeed);
    if (sortByFilter) sortByFilter.addEventListener('change', updateFeed);

    // Dynamic Delegate for "View Report" buttons
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.view-report-btn');
      if (target) {
        const oppId = target.getAttribute('data-opp-id');
        if (this.reportManager && oppId) {
          this.reportManager.open(oppId);
        }
      }
      
      const copyBtn = e.target.closest('#copy-markdown-btn');
      if (copyBtn) {
        const oppId = copyBtn.getAttribute('data-opp-id');
        const opp = OPPORTUNITIES.find(o => o.id === oppId);
        if (opp) {
          const md = `# BÁO CÁO NGHIÊN CỨU SẢN PHẨM: ${opp.title.toUpperCase()}
Kết luận: ${opp.recommendation}
Điểm số cơ hội: ${opp.score}/100

Tốc độ nhu cầu: ${opp.metrics.demand}/100
Tốc độ tăng trưởng: ${opp.metrics.growth}/100
Mức độ cạnh tranh: ${opp.metrics.competition}/100
Độ phù hợp xưởng Printway: ${opp.metrics.production_fit}/100

Lý do đánh giá R&D:
${opp.reasoning}

Chất liệu khuyến nghị: ${opp.material}
Giá bán lẻ khuyến nghị: ${opp.recommended_price}
Thời điểm mở bán đề xuất: ${opp.suggested_launch}`;

          navigator.clipboard.writeText(md);
          copyBtn.textContent = '✅ Đã sao chép!';
          setTimeout(() => { copyBtn.textContent = '📋 Sao chép Markdown'; }, 2000);
        }
      }
    });
  }

  renderMockup(oppId) {
    switch (oppId) {
      case 'opp-01':
        return `
          <div class="product-mockup-wrapper mockup-acrylic">
            <div class="acrylic-circle">
              <div class="acrylic-loop"></div>
              <div style="font-size:1.1rem; margin-bottom:0.25rem;">🐾</div>
              <div style="font-size:0.75rem; font-weight:700; color:#09090b; letter-spacing:-0.02em;">Forever in Our Hearts</div>
              <div style="font-size:0.65rem; color:#b45309; font-style:italic; margin-top:2px;">"Bella" • 2012 - 2026</div>
              <div style="font-size:0.55rem; color:#71717a; margin-top:4px; font-family:var(--font-mono);">Mica trong suốt 3mm</div>
            </div>
            <div style="position:absolute; bottom:8px; right:8px; background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.4); color:#059669; font-size:0.65rem; font-weight:700; padding:2px 8px; border-radius:9999px; font-family:var(--font-mono);">
              MICA IN UV
            </div>
          </div>
        `;

      case 'opp-02':
        return `
          <div class="product-mockup-wrapper mockup-wood">
            <div class="wood-plaque">
              <div style="font-size:1rem; margin-bottom:2px;">🎣</div>
              <div style="font-size:0.8rem; font-weight:800; font-family:serif; letter-spacing:0.04em;">GRANDPA'S FISHING BUDDIES</div>
              <div style="font-size:0.65rem; color:#fde68a; margin-top:3px; font-family:var(--font-mono);">Leo • Noah • Emma</div>
              <div style="font-size:0.55rem; color:#d97706; margin-top:3px; font-family:var(--font-mono);">Gỗ Plywood • Hợp xưởng 94%</div>
            </div>
            <div style="position:absolute; bottom:8px; right:8px; background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.4); color:#b45309; font-size:0.65rem; font-weight:700; padding:2px 8px; border-radius:9999px; font-family:var(--font-mono);">
              GỖ CẮT LASER
            </div>
          </div>
        `;

      case 'opp-03':
        return `
          <div class="product-mockup-wrapper mockup-canvas">
            <div class="canvas-frame">
              <div style="font-size:1.1rem; margin-bottom:2px;">🌿 🌸</div>
              <div style="font-size:0.75rem; font-weight:700; color:#09090b; font-family:serif;">Grandma's Garden</div>
              <div style="font-size:0.65rem; color:#059669; font-style:italic; margin-top:2px;">Where Love Grows Deep</div>
              <div style="font-size:0.55rem; color:#71717a; margin-top:4px; font-family:var(--font-mono);">Tranh Canvas 8×10"</div>
            </div>
            <div style="position:absolute; bottom:8px; right:8px; background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.4); color:#059669; font-size:0.65rem; font-weight:700; padding:2px 8px; border-radius:9999px; font-family:var(--font-mono);">
              TRANH VẢI CANVAS
            </div>
          </div>
        `;

      case 'opp-04':
      default:
        return `
          <div class="product-mockup-wrapper mockup-metal">
            <div class="metal-tag">
              <div style="font-size:0.85rem; font-weight:800; font-family:var(--font-mono); letter-spacing:0.06em;">MILO</div>
              <div style="font-size:0.65rem; color:#52525b; font-family:var(--font-mono);">555-0199 • LOST DOG</div>
              <div style="font-size:0.55rem; color:#dc2626; font-weight:700; margin-top:3px; text-transform:uppercase;">Giới hạn thiết bị laser</div>
            </div>
            <div style="position:absolute; bottom:8px; right:8px; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.4); color:#dc2626; font-size:0.65rem; font-weight:700; padding:2px 8px; border-radius:9999px; font-family:var(--font-mono);">
              BỎ QUA • HỢP XƯỞNG 34%
            </div>
          </div>
        `;
    }
  }

  renderFeed(items) {
    const grid = document.getElementById('opportunity-feed-grid');
    if (!grid) return;

    if (items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:4rem; color:var(--text-secondary); background:#ffffff; border:1px solid var(--border); border-radius:var(--radius-xl);">
          <div style="font-size:2rem; margin-bottom:0.75rem;">🔍</div>
          <p style="font-size:1.1rem; font-weight:600; color:var(--text-primary); margin-bottom:0.35rem;">Không tìm thấy cơ hội phù hợp</p>
          <p style="font-size:0.875rem; color:var(--text-muted);">Hãy thử điều chỉnh từ khóa tìm kiếm, kết luận trạng thái hoặc danh mục bộ lọc.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = items.map(opp => {
      const badgeClass = opp.recommendation === 'BUILD' ? 'badge-build' : (opp.recommendation === 'WATCH' ? 'badge-watch' : 'badge-skip');
      const scoreColor = opp.score >= 80 ? '#10b981' : (opp.score >= 60 ? '#f59e0b' : '#ef4444');
      const strokeDashoffset = 238.76 * (1 - opp.score / 100);

      const fitColor = opp.printway_fit >= 75 ? '#8b5cf6' : '#ef4444';

      return `
        <article class="opportunity-card">
          <!-- Card Header -->
          <div class="card-header-row">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem; flex-wrap:wrap;">
                <span class="badge ${badgeClass}">${opp.recommendation}</span>
                <span class="chip" style="font-size:0.75rem; padding:0.2rem 0.65rem; font-family:var(--font-mono);">${opp.badge}</span>
              </div>
              <h3 class="card-title">${opp.title}</h3>
              <div class="card-meta">
                <span>${opp.category}</span> • <span style="color:var(--text-secondary);">${opp.niche}</span> • <span>${opp.season}</span>
              </div>
            </div>
            
            <div class="score-ring-container">
              <svg class="score-ring-svg" viewBox="0 0 90 90">
                <circle class="score-ring-bg" cx="45" cy="45" r="38" fill="transparent"></circle>
                <circle class="score-ring-bar" cx="45" cy="45" r="38" fill="transparent"
                        stroke="${scoreColor}" stroke-dasharray="238.76" stroke-dashoffset="${strokeDashoffset}"></circle>
              </svg>
              <div class="score-value">${opp.score}<sub>/100</sub></div>
            </div>
          </div>

          <!-- Realistic Product Mockup (Acrylic, Wood, Canvas, Metal) -->
          ${this.renderMockup(opp.id)}

          <!-- Detailed Metrics Breakdown -->
          <div class="metrics-list">
            <div class="metric-item">
              <span class="metric-label">Tăng trưởng nhu cầu</span>
              <div class="metric-bar-bg"><div class="metric-bar-fill" style="width:${opp.metrics.growth}%; background:#10b981;"></div></div>
              <span class="metric-val" style="color:#059669;">${opp.growth_30d}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Khoảng trống cơ hội</span>
              <div class="metric-bar-bg"><div class="metric-bar-fill" style="width:${opp.metrics.demand}%; background:#203eec;"></div></div>
              <span class="metric-val" style="color:#203eec;">${opp.opportunity_gap}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Độ phù hợp xưởng</span>
              <div class="metric-bar-bg"><div class="metric-bar-fill" style="width:${opp.printway_fit}%; background:${fitColor};"></div></div>
              <span class="metric-val" style="color:${fitColor};">${opp.printway_fit}%</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.775rem; color:var(--text-muted); border-top:1px solid #e4e4e7; padding-top:0.4rem; margin-top:0.1rem;">
              <span>Giá bán lẻ đề xuất: <strong style="color:var(--text-primary); font-family:var(--font-mono);">${opp.recommended_price}</strong></span>
              <span>Ra mắt: <strong style="color:var(--text-primary);">${opp.suggested_launch}</strong></span>
            </div>
          </div>

          <!-- R&D Audit Quote Box -->
          <div class="rd-audit-quote">
            <strong>Đánh giá R&D: </strong>${opp.reasoning}
          </div>

          <!-- Card Footer Actions -->
          <div class="card-footer">
            <div style="font-size:0.8rem; color:var(--text-secondary);">
              Chất liệu: <strong style="color:var(--text-primary);">${opp.material}</strong>
            </div>
            <button class="btn btn-secondary btn-sm view-report-btn" data-opp-id="${opp.id}">
              📄 Mở hồ sơ kỹ thuật ↗
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  renderComparisonTable() {
    const tableBody = document.getElementById('matrix-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = OPPORTUNITIES.map(opp => {
      const badgeClass = opp.recommendation === 'BUILD' ? 'badge-build' : (opp.recommendation === 'WATCH' ? 'badge-watch' : 'badge-skip');
      return `
        <tr>
          <td>
            <strong style="color:var(--text-primary); font-size:0.95rem;">${opp.title}</strong><br/>
            <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">${opp.niche}</span>
          </td>
          <td><strong style="color:#203eec; font-family:var(--font-mono); font-size:1.1rem;">${opp.score}</strong></td>
          <td style="color:#059669; font-family:var(--font-mono);">${opp.metrics.growth}/100 (${opp.growth_30d})</td>
          <td style="color:#d97706; font-family:var(--font-mono);">${opp.metrics.competition}/100</td>
          <td style="color:${opp.printway_fit >= 75 ? '#8b5cf6' : '#dc2626'}; font-family:var(--font-mono);">${opp.metrics.production_fit}%</td>
          <td>${opp.material}</td>
          <td><span class="badge ${badgeClass}">${opp.recommendation}</span></td>
        </tr>
      `;
    }).join('');
  }

  renderTrendAlerts() {
    const alertBox = document.getElementById('radar-alerts-container');
    if (!alertBox) return;

    alertBox.innerHTML = this.alerts.map(a => `
      <div class="radar-alert-card">
        <div style="display:flex; align-items:center; gap:0.85rem;">
          <div class="radar-beacon"></div>
          <div>
            <strong style="color:#dc2626; font-size:0.95rem;">🚨 Phát hiện tăng trưởng sớm: "${a.keyword}"</strong>
            <p style="font-size:0.825rem; color:var(--text-secondary); margin-top:0.2rem;">
              Tốc độ nhu cầu: <strong style="color:#059669;">${a.demand_velocity}</strong> &nbsp;|&nbsp; 
              Tốc độ cạnh tranh: <strong style="color:#d97706;">${a.competition_velocity}</strong>
            </p>
          </div>
        </div>
        <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">${a.time_ago}</span>
      </div>
    `).join('');
  }
}

// Global App instantiation
window.app = new OpportunityApp();
