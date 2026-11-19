/**
 * OpportunityOS Product Research Report Renderer & Exporter (Giao diện Tiếng Việt)
 * Styled with template design tokens from mẫu.zip
 */

import { OPPORTUNITIES } from './data.js';

export class ReportManager {
  constructor(modalOverlayId, modalTitleId, modalBodyId, closeBtnId) {
    this.overlay = document.getElementById(modalOverlayId);
    this.titleEl = document.getElementById(modalTitleId);
    this.bodyEl = document.getElementById(modalBodyId);
    this.closeBtn = document.getElementById(closeBtnId);

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });
    }

    // Escape key listener to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay && this.overlay.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(oppId) {
    const opp = OPPORTUNITIES.find(o => o.id === oppId) || OPPORTUNITIES[0];
    if (!this.overlay || !this.bodyEl || !this.titleEl) return;

    this.titleEl.textContent = `HỒ SƠ NGHIÊN CỨU SẢN PHẨM: ${opp.title.toUpperCase()}`;
    this.bodyEl.innerHTML = this.buildReportHtml(opp);
    this.overlay.classList.add('active');
  }

  close() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
  }

  buildReportHtml(opp) {
    const badgeClass = opp.recommendation === 'BUILD' ? 'badge-build' : (opp.recommendation === 'WATCH' ? 'badge-watch' : 'badge-skip');
    
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.75rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <span class="badge ${badgeClass}" style="font-size:0.85rem; padding:0.35rem 0.9rem;">KẾT LUẬN R&D: ${opp.recommendation}</span>
          <p style="color:var(--text-secondary); font-size:0.85rem; margin-top:0.4rem;">Điểm số cơ hội: <strong style="color:var(--text-primary); font-size:1.15rem; font-family:var(--font-mono);">${opp.score}/100</strong></p>
        </div>
        <div style="display:flex; gap:0.6rem;">
          <button class="btn btn-secondary btn-sm" id="copy-markdown-btn" data-opp-id="${opp.id}">📋 Sao chép Markdown</button>
          <button class="btn btn-electric btn-sm" onclick="window.print()">🖨️ In / Lưu PDF</button>
        </div>
      </div>

      <!-- Executive Summary -->
      <div class="report-section-box">
        <h3 class="report-h3">1. Tóm tắt điều hành (Executive Summary)</h3>
        <p style="margin-bottom:0.4rem; color:var(--text-secondary);"><strong>Dòng sản phẩm:</strong> <span style="color:var(--text-primary);">${opp.product_type}</span></p>
        <p style="margin-bottom:0.4rem; color:var(--text-secondary);"><strong>Ngách mục tiêu:</strong> <span style="color:var(--text-primary);">${opp.niche}</span> &nbsp;|&nbsp; <strong>Mùa vụ:</strong> <span style="color:var(--text-primary);">${opp.season}</span></p>
        <p style="color:var(--text-secondary); background:rgba(32,62,236,0.04); border-left:3px solid var(--accent-blue); padding:0.85rem; border-radius:6px; margin-top:0.6rem; font-size:0.9rem; line-height:1.6;">
          <strong>Đánh giá R&D:</strong> ${opp.reasoning}
        </p>
      </div>

      <!-- Metrics Breakdown -->
      <div class="report-section-box">
        <h3 class="report-h3">2. Chi tiết điểm số theo công thức R&D</h3>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:0.75rem; text-align:center;">
          <div style="background:#ffffff; border:1px solid var(--border); padding:0.85rem; border-radius:12px;">
            <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">Nhu cầu (20%)</div>
            <div style="font-size:1.35rem; font-weight:700; color:#203eec; font-family:var(--font-mono); margin-top:0.25rem;">${opp.metrics.demand}/100</div>
          </div>
          <div style="background:#ffffff; border:1px solid var(--border); padding:0.85rem; border-radius:12px;">
            <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">Tăng trưởng (20%)</div>
            <div style="font-size:1.35rem; font-weight:700; color:#10b981; font-family:var(--font-mono); margin-top:0.25rem;">${opp.metrics.growth}/100</div>
          </div>
          <div style="background:#ffffff; border:1px solid var(--border); padding:0.85rem; border-radius:12px;">
            <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">Cạnh tranh (15%)</div>
            <div style="font-size:1.35rem; font-weight:700; color:#f59e0b; font-family:var(--font-mono); margin-top:0.25rem;">${opp.metrics.competition}/100</div>
          </div>
          <div style="background:#ffffff; border:1px solid var(--border); padding:0.85rem; border-radius:12px;">
            <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">Hợp xưởng (25%)</div>
            <div style="font-size:1.35rem; font-weight:700; color:#8b5cf6; font-family:var(--font-mono); margin-top:0.25rem;">${opp.metrics.production_fit}/100</div>
          </div>
        </div>
      </div>

      <!-- Marketplace Evidence -->
      <div class="report-section-box">
        <h3 class="report-h3">3. Bằng chứng dữ liệu đa sàn thương mại</h3>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
          <div style="background:#ffffff; padding:0.95rem; border-radius:12px; border:1px solid var(--border);">
            <strong style="color:#f97316; font-size:0.9rem;">Etsy OpenAPI v3</strong>
            <p style="font-size:0.825rem; color:var(--text-secondary); margin-top:0.35rem; line-height:1.6;">
              Đã kiểm toán: <strong>${opp.marketplace_evidence.etsy.listings_count}</strong> sản phẩm đang bán<br/>
              Giá bán trung vị: <strong>$${opp.marketplace_evidence.etsy.median_price}</strong><br/>
              Tăng trưởng doanh số ước tính: <strong style="color:#059669;">${opp.marketplace_evidence.etsy.est_sales_growth}</strong>
            </p>
          </div>
          <div style="background:#ffffff; padding:0.95rem; border-radius:12px; border:1px solid var(--border);">
            <strong style="color:#203eec; font-size:0.9rem;">Amazon PA API</strong>
            <p style="font-size:0.825rem; color:var(--text-secondary); margin-top:0.35rem; line-height:1.6;">
              Đã kiểm toán: <strong>${opp.marketplace_evidence.amazon.listings_count}</strong> SKU sản phẩm<br/>
              Giá bán trung vị: <strong>$${opp.marketplace_evidence.amazon.median_price}</strong><br/>
              Thứ hạng BSR: <strong>#${opp.marketplace_evidence.amazon.bsr_rank}</strong>
            </p>
          </div>
        </div>
      </div>

      <!-- Design Insights & Angles -->
      <div class="report-section-box">
        <h3 class="report-h3">4. Bảng màu xu hướng & Câu trích dẫn nổi bật</h3>
        <p style="margin-bottom:0.4rem; color:var(--text-secondary);"><strong>Bảng màu thịnh hành:</strong> <span style="color:var(--text-primary);">${opp.design_insights.colors.join(', ')}</span></p>
        <p style="margin-bottom:0.4rem; color:var(--text-secondary);"><strong>Chủ đề thiết kế:</strong> <span style="color:var(--text-primary);">${opp.design_insights.themes.join(', ')}</span></p>
        <p style="margin-bottom:0.4rem; color:var(--text-secondary);"><strong>Câu trích dẫn tỷ lệ chuyển đổi cao:</strong> <span style="color:var(--text-primary);">"${opp.design_insights.quotes.join('", "')}"</span></p>
      </div>

      <!-- Production & Action Plan -->
      <div class="report-section-box">
        <h3 class="report-h3">5. Kế hoạch hành động sản xuất xưởng Printway</h3>
        <p style="margin-bottom:0.4rem; color:var(--text-secondary);"><strong>Chất liệu đề xuất:</strong> <span style="color:var(--text-primary);">${opp.material}</span></p>
        <p style="margin-bottom:0.4rem; color:var(--text-secondary);"><strong>Khung giá bán lẻ mục tiêu:</strong> <span style="color:var(--text-primary);">${opp.recommended_price}</span></p>
        <p style="margin-bottom:0.4rem; color:var(--text-secondary);"><strong>Thời điểm ra mắt đề xuất:</strong> <span style="color:var(--text-primary);">${opp.suggested_launch}</span></p>
        <p style="margin-bottom:0.4rem; color:var(--text-secondary);"><strong>Hành động R&D tức thì:</strong> <span style="color:var(--text-primary);">Thiết kế bộ 15 mẫu artwork ban đầu và đo lường tỷ lệ nhấp chuột (CTR).</span></p>
      </div>
    `;
  }
}
