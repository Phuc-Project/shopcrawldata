/**
 * OpportunityOS AI Copilot Engine Visualizer & Simulator (Giao diện Tiếng Việt)
 */

import { OPPORTUNITIES, PRINTWAY_CATALOG } from './data.js';

export class CopilotSimulator {
  constructor(chatContainerId, inputId, sendBtnId) {
    this.chatContainer = document.getElementById(chatContainerId);
    this.inputEl = document.getElementById(inputId);
    this.sendBtn = document.getElementById(sendBtnId);
    this.isProcessing = false;

    this.initEvents();
  }

  initEvents() {
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleUserSubmit());
    }
    if (this.inputEl) {
      this.inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleUserSubmit();
      });
    }
  }

  ask(questionText) {
    if (this.inputEl) {
      this.inputEl.value = questionText;
      this.handleUserSubmit();
    }
  }

  handleUserSubmit() {
    if (!this.inputEl) return;
    const text = this.inputEl.value.trim();
    if (!text || this.isProcessing) return;

    this.inputEl.value = '';
    this.appendUserMessage(text);
    this.processQuery(text);
  }

  appendUserMessage(text) {
    if (!this.chatContainer) return;
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble message-user';
    bubble.textContent = text;
    this.chatContainer.appendChild(bubble);
    this.scrollToBottom();
  }

  appendAiMessage(htmlContent) {
    if (!this.chatContainer) return;
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble message-ai';
    bubble.innerHTML = htmlContent;
    this.chatContainer.appendChild(bubble);
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
  }

  async processQuery(queryText) {
    this.isProcessing = true;
    const lower = queryText.toLowerCase();

    // Visual Reasoning Steps
    const reasoningBox = document.createElement('div');
    reasoningBox.className = 'message-bubble message-ai';
    reasoningBox.innerHTML = `
      <div style="font-weight:600; color:var(--accent-blue); margin-bottom:0.4rem; display:flex; align-items:center; gap:0.5rem;">
        <span class="spinner" style="display:inline-block; width:12px; height:12px; border:2px solid var(--accent-blue); border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite;"></span>
        Hệ thống phân tích suy luận OpportunityOS AI...
      </div>
      <div class="tool-call-box" id="active-tool-box"></div>
    `;
    this.chatContainer.appendChild(reasoningBox);
    this.scrollToBottom();

    const toolBox = reasoningBox.querySelector('#active-tool-box');

    // Step 1: Parse Intent & Search Multi-Marketplace Data
    await this.delay(600);
    toolBox.innerHTML += `<div class="tool-step">⚙️ <code>search_marketplaces</code> (truy vấn: "${queryText}") → Etsy, Amazon, TikTok Shop</div>`;
    this.scrollToBottom();

    // Step 2: Semantic Product Normalization
    await this.delay(700);
    toolBox.innerHTML += `<div class="tool-step">🧩 <code>normalize_product</code> → So khớp vector ngữ nghĩa với danh mục xưởng Printway</div>`;
    this.scrollToBottom();

    // Step 3: Compute Opportunity Score & Factory Fit
    await this.delay(700);
    toolBox.innerHTML += `<div class="tool-step">📊 <code>calculate_opportunity_score</code> (Nhu cầu: 20%, Tăng trưởng: 20%, Cạnh tranh: 15%, Hợp xưởng: 25%)</div>`;
    this.scrollToBottom();

    // Step 4: Final Recommendation
    await this.delay(600);
    toolBox.innerHTML += `<div class="tool-step">✅ <code>check_production_fit</code> → Đã xác thực khả năng sản xuất & biên lợi nhuận xưởng Printway</div>`;
    this.scrollToBottom();

    await this.delay(500);

    // Generate response based on query intent
    let responseHtml = "";

    if (lower.includes("pet") || lower.includes("memorial") || lower.includes("thú cưng") || lower.includes("kỷ niệm") || lower.includes("fastest") || lower.includes("nhanh nhất") || lower.includes("q4")) {
      const opp = OPPORTUNITIES[0]; // Pet Memorial
      responseHtml = `
        <p><strong>Cơ hội hàng đầu được phát hiện cho Q4:</strong></p>
        <div style="background:#ffffff; border:1px solid var(--border); border-radius:12px; padding:0.95rem; margin:0.6rem 0; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <strong style="color:var(--text-primary); font-size:1rem;">${opp.title}</strong>
            <span class="badge badge-build">${opp.recommendation}</span>
          </div>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.4rem;">
            <strong>Điểm số cơ hội:</strong> ${opp.score}/100 &nbsp;|&nbsp; <strong>Tăng trưởng:</strong> ${opp.growth_30d} &nbsp;|&nbsp; <strong>Khoảng trống:</strong> ${opp.opportunity_gap}
          </p>
          <p style="font-size:0.825rem; color:var(--text-secondary); line-height:1.55;">
            <strong>Đánh giá R&D:</strong> ${opp.reasoning}
          </p>
          <div style="margin-top:0.75rem;">
            <button class="btn btn-electric btn-sm view-report-btn" data-opp-id="${opp.id}">📄 Xem hồ sơ nghiên cứu đầy đủ ↗</button>
          </div>
        </div>
      `;
    } else if (lower.includes("why") || lower.includes("shouldn't") || lower.includes("tại sao") || lower.includes("không nên") || lower.includes("tag") || lower.includes("thẻ tên") || lower.includes("metal") || lower.includes("kim loại")) {
      const opp = OPPORTUNITIES[3]; // Metal Pet Tag (Demo Trick)
      responseHtml = `
        <p><strong>Phân tích quyết định R&D cho "${opp.title}":</strong></p>
        <div style="background:rgba(239,68,68,0.04); border:1px solid rgba(239,68,68,0.25); border-radius:12px; padding:0.95rem; margin:0.6rem 0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <strong style="#dc2626; font-size:1rem;">${opp.title}</strong>
            <span class="badge badge-skip">${opp.recommendation}</span>
          </div>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.4rem;">
            <strong>Nhu cầu thị trường:</strong> 82/100 (Rất cao) &nbsp;|&nbsp; <strong>Độ phù hợp xưởng Printway:</strong> 34% (Rất thấp)
          </p>
          <p style="font-size:0.825rem; color:var(--text-secondary); line-height:1.55;">
            <strong>Tại sao nên BỎ QUA (SKIP)?</strong> Mặc dù lượng tìm kiếm trên các sàn thương mại rất cao (82/100), nhưng mức độ cạnh tranh đã bão hòa và <strong>Độ phù hợp xưởng Printway chỉ đạt 34%</strong> (nghẽn thiết bị khắc laser kim loại và biên lợi nhuận thấp). OpportunityOS giúp Printway bảo vệ công suất và tập trung vào các mặt hàng có biên lợi nhuận cao hơn.
          </p>
        </div>
      `;
    } else if (lower.includes("compare") || lower.includes("so sánh") || lower.includes("niche") || lower.includes("ngách")) {
      responseHtml = `
        <p><strong>Phân tích so sánh các ngách sản phẩm:</strong></p>
        <p style="font-size:0.875rem; color:var(--text-secondary); margin:0.4rem 0;">
          So sánh <strong>Đồ trang trí Kỷ niệm Thú cưng Mica</strong> vs <strong>Quà lưu niệm tặng Ông Gỗ</strong> vs <strong>Biển làm vườn Cá nhân hóa Canvas</strong>:
        </p>
        <ul style="padding-left:1.2rem; font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">
          <li>🏆 <strong>Đồ trang trí Kỷ niệm Thú cưng (91/100 - BUILD):</strong> Tốc độ tăng trưởng nhu cầu cao nhất (+43%), khoảng trống cạnh tranh tốt, 96% phù hợp với dây chuyền Mica in UV của Printway.</li>
          <li>🥈 <strong>Quà lưu niệm tặng Ông (87/100 - BUILD):</strong> Nhu cầu quà tặng gia đình tăng trưởng bền vững (+31%), tiềm năng bán chạy trong Ngày của Cha và Q4.</li>
          <li>🌿 <strong>Biển làm vườn Cá nhân hóa (71/100 - WATCH):</strong> Tốc độ tăng trưởng vừa phải (+14%), nên theo dõi và chuẩn bị đón đầu chu kỳ mùa Xuân 2027.</li>
        </ul>
      `;
    } else {
      responseHtml = `
        <p>Dựa trên công cụ phân tích đa thị trường theo thời gian thực (Etsy + Amazon + TikTok Shop + Danh mục xưởng Printway):</p>
        <p style="margin-top:0.4rem; font-size:0.875rem; color:var(--text-secondary);">
          Hệ thống đã nhận diện <strong>${OPPORTUNITIES.length} ứng viên sản phẩm tiềm năng</strong> phù hợp với năng lực sản xuất của Printway cho mùa bán hàng cuối năm.
        </p>
        <p style="margin-top:0.4rem; font-size:0.85rem; color:var(--accent-blue);">
          💡 Bạn có thể thử hỏi: <em>"Tìm các sản phẩm cá nhân hóa tăng trưởng nhanh nhất cho Q4"</em> hoặc <em>"Tại sao không nên sản xuất Thẻ tên thú cưng bằng kim loại?"</em>
        </p>
      `;
    }

    this.appendAiMessage(responseHtml);
    this.isProcessing = false;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
