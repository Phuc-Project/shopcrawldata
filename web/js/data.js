/**
 * OpportunityOS Datasets & Catalog Specifications (Phiên bản tiếng Việt)
 */

export const PRINTWAY_CATALOG = [
  {
    type_id: "acrylic_ornament",
    name: "Mica Acrylic Hình Dáng Tùy Chỉnh",
    material: "Mica Trong Suốt 3mm",
    margin_est: "35% - 55%",
    difficulty: "Thấp (2/5)",
    lead_time: "24-48 giờ",
    printway_fit: 96,
  },
  {
    type_id: "wooden_plaque",
    name: "Biển Gỗ Trang Trí Tùy Chỉnh",
    material: "Gỗ Plywood / Gỗ Thông",
    margin_est: "30% - 48%",
    difficulty: "Thấp (2/5)",
    lead_time: "24-48 giờ",
    printway_fit: 94,
  },
  {
    type_id: "canvas_print",
    name: "Tranh Canvas Đóng Khung",
    material: "Vải Canvas Cotton-Poly",
    margin_est: "40% - 60%",
    difficulty: "Trung bình (3/5)",
    lead_time: "48-72 giờ",
    printway_fit: 88,
  },
  {
    type_id: "metal_pet_tag",
    name: "Thẻ Tên Thú Cưng Inox",
    material: "Thép Không Gỉ Khắc Laser",
    margin_est: "15% - 25%",
    difficulty: "Cao (4/5 - Giới hạn máy móc)",
    lead_time: "5-7 ngày",
    printway_fit: 34,
  }
];

export const OPPORTUNITIES = [
  {
    id: "opp-01",
    title: "Ornaments Mica Tưởng Niệm Thú Cưng",
    title_en: "Pet Memorial Acrylic Ornament",
    product_type: "Mica Acrylic hình dáng tùy chỉnh",
    category: "Trang trí nhà cửa & Quà tặng",
    category_id: "decor",
    niche: "Tưởng niệm thú cưng",
    season: "Q4 (Mùa Giáng sinh)",
    score: 91,
    recommendation: "BUILD",
    badge: "Tăng trưởng nóng 🔥",
    growth_30d: "+43%",
    competition_level: "Thấp",
    opportunity_gap: "+31%",
    printway_fit: 96,
    material: "Mica trong suốt 3mm",
    suggested_launch: "Tháng 9 - Tháng 10",
    recommended_price: "$17.99 – $22.99",
    metrics: {
      demand: 94,
      growth: 96,
      competition: 78,
      revenue: 87,
      personalization: 95,
      seasonality: 81,
      production_fit: 96
    },
    marketplace_evidence: {
      etsy: { listings_count: 842, median_price: 18.9, est_sales_growth: "+41%" },
      amazon: { listings_count: 312, median_price: 19.7, bsr_rank: 4312 },
      tiktok: { video_views: "4.2M", hashtag_velocity: "+68%" }
    },
    design_insights: {
      colors: ["Đen huyền bí", "Vàng ánh kim", "Mica trong suốt"],
      themes: ["Cánh thiên thần", "Dấu chân thú cưng", "Trái tim tưởng niệm"],
      quotes: ["Forever in our hearts", "Always by my side", "Until we meet again"],
      personalization_elements: ["Tên thú cưng", "Năm tưởng niệm", "Ảnh thú cưng tùy chỉnh"]
    },
    reasoning: "Nhu cầu thị trường đang bùng nổ nhanh hơn đáng kể so với mức độ cạnh tranh của các người bán. Cực kỳ phù hợp với dây chuyền in UV mica 3mm hiện có của Printway với tiềm năng biên lợi nhuận trên 50%."
  },
  {
    id: "opp-02",
    title: "Biển Gỗ Kỷ Niệm Tặng Ông Tùy Chỉnh",
    title_en: "Custom Grandpa Keepsake Ornament",
    product_type: "Biển gỗ / Mica kỷ niệm",
    category: "Quà tặng gia đình",
    category_id: "family",
    niche: "Quà tặng cho ông",
    season: "Ngày của Cha / Q4",
    score: 87,
    recommendation: "BUILD",
    badge: "Nhu cầu cao 📈",
    growth_30d: "+31%",
    competition_level: "Trung bình",
    opportunity_gap: "+19%",
    printway_fit: 94,
    material: "Gỗ Plywood / Mica 3mm",
    suggested_launch: "Tháng 10",
    recommended_price: "$16.99 – $21.99",
    metrics: {
      demand: 91,
      growth: 88,
      competition: 82,
      revenue: 85,
      personalization: 94,
      seasonality: 84,
      production_fit: 94
    },
    marketplace_evidence: {
      etsy: { listings_count: 1240, median_price: 17.5, est_sales_growth: "+28%" },
      amazon: { listings_count: 520, median_price: 18.9, bsr_rank: 5120 },
      tiktok: { video_views: "2.8M", hashtag_velocity: "+45%" }
    },
    design_insights: {
      colors: ["Gỗ mộc mạc", "Vàng cổ điển", "Xanh navy"],
      themes: ["Đi câu cá", "Dấu bàn tay cháu", "Cây phả hệ gia đình"],
      quotes: ["Best Grandpa Ever", "Grandpa's Fishing Buddies", "Loved to pieces"],
      personalization_elements: ["Tên các cháu", "Hình minh họa tùy biến"]
    },
    reasoning: "Ngách có tỷ lệ chuyển đổi cao và ổn định xuyên suốt trên cả Etsy và Amazon. Tỷ lệ mua quà tặng lặp lại mạnh mẽ trong các mùa lễ hội cuối năm."
  },
  {
    id: "opp-03",
    title: "Biển Vườn Hoa Cá Nhân Hóa",
    title_en: "Personalized Gardening Sign",
    product_type: "Tranh Canvas đóng khung / Biển gỗ",
    category: "Trang trí nhà cửa & Quà tặng",
    category_id: "decor",
    niche: "Người yêu làm vườn",
    season: "Mùa Xuân / Mùa Hè",
    score: 71,
    recommendation: "WATCH",
    badge: "Xu hướng ổn định 🌿",
    growth_30d: "+14%",
    competition_level: "Trung bình",
    opportunity_gap: "+6%",
    printway_fit: 81,
    material: "Gỗ xử lý ngoài trời / Canvas chống nước",
    suggested_launch: "Tháng 2 - Tháng 3",
    recommended_price: "$24.99 – $32.99",
    metrics: {
      demand: 72,
      growth: 68,
      competition: 70,
      revenue: 74,
      personalization: 80,
      seasonality: 65,
      production_fit: 81
    },
    marketplace_evidence: {
      etsy: { listings_count: 610, median_price: 26.5, est_sales_growth: "+12%" },
      amazon: { listings_count: 240, median_price: 28.0, bsr_rank: 8900 },
      tiktok: { video_views: "1.1M", hashtag_velocity: "+18%" }
    },
    design_insights: {
      colors: ["Xanh thực vật", "Màu phấn hoa", "Đất nung Terracotta"],
      themes: ["Hoa nở", "Dụng cụ làm vườn", "Ong & Bướm"],
      quotes: ["Welcome to Grandma's Garden", "Planting memories", "Garden of Love"],
      personalization_elements: ["Tên khu vườn gia đình", "Năm thành lập"]
    },
    reasoning: "Tín hiệu tăng trưởng ở mức vừa phải. Khuyến nghị giữ kế hoạch sản xuất đến đầu chu kỳ chuẩn bị nguồn hàng mùa xuân Q1."
  },
  {
    id: "opp-04",
    title: "Thẻ Tên Thú Cưng Khắc Laser",
    title_en: "Laser Engraved Metal Pet Tag",
    product_type: "Thẻ tên thú cưng thép không gỉ",
    category: "Phụ kiện thú cưng",
    category_id: "pet",
    niche: "Thẻ tên thú cưng",
    season: "Quanh năm",
    score: 58,
    recommendation: "SKIP",
    badge: "Nghẽn xưởng sản xuất ⚠️",
    growth_30d: "+4%",
    competition_level: "Cao",
    opportunity_gap: "-12%",
    printway_fit: 34,
    material: "Thép không gỉ khắc Laser",
    suggested_launch: "Không khuyến nghị",
    recommended_price: "$9.99 – $14.99",
    metrics: {
      demand: 82,
      growth: 52,
      competition: 40,
      revenue: 48,
      personalization: 88,
      seasonality: 90,
      production_fit: 34
    },
    marketplace_evidence: {
      etsy: { listings_count: 4500, median_price: 11.5, est_sales_growth: "+3%" },
      amazon: { listings_count: 1800, median_price: 12.0, bsr_rank: 2100 },
      tiktok: { video_views: "3.5M", hashtag_velocity: "+5%" }
    },
    design_insights: {
      colors: ["Bạc sáng", "Vàng hồng Rose Gold", "Đen mờ Matte"],
      themes: ["Thẻ tên tối giản"],
      quotes: ["Call my mom", "I'm lost"],
      personalization_elements: ["Số điện thoại", "Tên thú cưng"]
    },
    reasoning: "BẪY DEMO: Mặc dù lượng tìm kiếm trên thị trường rất cao (82/100), mức độ cạnh tranh đã bão hòa và độ phù hợp xưởng Printway chỉ đạt 34% do hạn chế máy khắc laser chuyên dụng và biên lợi nhuận thấp. Khuyến nghị: BỎ QUA (SKIP)."
  }
];

export const EARLY_ALERTS = [
  {
    id: "alert-01",
    keyword: "Pet Loss Christmas Ornament",
    demand_velocity: "+67%",
    competition_velocity: "+8%",
    confidence: "Cao",
    time_ago: "2 giờ trước"
  },
  {
    id: "alert-02",
    keyword: "Personalized First Christmas in New Home Plaque",
    demand_velocity: "+52%",
    competition_velocity: "+11%",
    confidence: "Cao",
    time_ago: "5 giờ trước"
  }
];
