export interface OpportunityItem {
  id: string;
  title: string;
  product_type: string;
  category: string;
  niche: string;
  season: string;
  score: number;
  recommendation: 'BUILD' | 'WATCH' | 'SKIP';
  badge: string;
  growth_30d: string;
  competition_level: string;
  opportunity_gap: string;
  printway_fit: number;
  material: string;
  suggested_launch: string;
  recommended_price: string;
  metrics: {
    demand: number;
    growth: number;
    competition: number;
    revenue: number;
    personalization: number;
    seasonality: number;
    production_fit: number;
  };
  marketplace_evidence: {
    etsy: { listings_count: number; median_price: number; est_sales_growth: string };
    amazon: { listings_count: number; median_price: number; bsr_rank: number };
    tiktok: { video_views: string; hashtag_velocity: string };
  };
  design_insights: {
    colors: string[];
    themes: string[];
    quotes: string[];
    personalization_elements: string[];
  };
  reasoning: string;
}

export interface TrendAlert {
  id: string;
  keyword: string;
  demand_velocity: string;
  competition_velocity: string;
  confidence: string;
  time_ago: string;
}

export const PRINTWAY_CATALOG = [
  {
    type_id: "acrylic_ornament",
    name: "Custom Shape Acrylic Ornament",
    material: "3mm Clear Acrylic",
    margin_est: "35% - 55%",
    difficulty: "Low (2/5)",
    lead_time: "24-48h",
    printway_fit: 96,
  },
  {
    type_id: "wooden_plaque",
    name: "Custom Shape Wooden Plaque",
    material: "Plywood / Pine Wood",
    margin_est: "30% - 48%",
    difficulty: "Low (2/5)",
    lead_time: "24-48h",
    printway_fit: 94,
  },
  {
    type_id: "canvas_print",
    name: "Framed Canvas Print",
    material: "Polyester-Cotton Canvas",
    margin_est: "40% - 60%",
    difficulty: "Medium (3/5)",
    lead_time: "48-72h",
    printway_fit: 88,
  },
  {
    type_id: "metal_pet_tag",
    name: "Stainless Steel Pet Tag",
    material: "Laser Engraved Stainless Steel",
    margin_est: "15% - 25%",
    difficulty: "High (4/5 - Equipment limit)",
    lead_time: "5-7 days",
    printway_fit: 34,
  }
];

export const OPPORTUNITIES: OpportunityItem[] = [
  {
    id: "opp-01",
    title: "Pet Memorial Acrylic Ornament",
    product_type: "Custom Shape Acrylic Ornament",
    category: "Home Decor & Gifts",
    niche: "Pet Memorial",
    season: "Q4 (Christmas)",
    score: 91,
    recommendation: "BUILD",
    badge: "Rising Fast 🔥",
    growth_30d: "+43%",
    competition_level: "Low",
    opportunity_gap: "+31%",
    printway_fit: 96,
    material: "3mm Clear Acrylic",
    suggested_launch: "September - October",
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
      colors: ["Black", "Gold Accent", "Clear Transparent"],
      themes: ["Angel Wings", "Paw Prints", "Memorial Heart"],
      quotes: ["Forever in our hearts", "Always by my side", "Until we meet again"],
      personalization_elements: ["Pet name", "Memorial year", "Pet Photo"]
    },
    reasoning: "Demand growth (+43%) is surging far faster than seller competition (+12%). Fits Printway 3mm acrylic UV line perfectly with 50%+ estimated margin."
  },
  {
    id: "opp-02",
    title: "Custom Grandpa Keepsake Ornament",
    product_type: "Custom Shape Wooden Plaque",
    category: "Family Gifts",
    niche: "Grandpa Gift",
    season: "Father's Day / Q4",
    score: 87,
    recommendation: "BUILD",
    badge: "High Demand 📈",
    growth_30d: "+31%",
    competition_level: "Medium",
    opportunity_gap: "+19%",
    printway_fit: 94,
    material: "Plywood / 3mm Acrylic",
    suggested_launch: "October",
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
      colors: ["Rustic Wood", "Vintage Gold", "Navy Blue"],
      themes: ["Fishing", "Grandkids handprints", "Family Tree"],
      quotes: ["Best Grandpa Ever", "Grandpa's Fishing Buddies", "Loved to pieces"],
      personalization_elements: ["Grandkids names", "Customized illustrations"]
    },
    reasoning: "High giftability score with steady repeat conversions on Etsy and Amazon. Excellent production fit for Printway wooden plaque cutters."
  },
  {
    id: "opp-03",
    title: "Personalized Gardening Sign",
    product_type: "Framed Canvas Print",
    category: "Outdoor & Garden",
    niche: "Gardening",
    season: "Spring / Summer",
    score: 71,
    recommendation: "WATCH",
    badge: "Steady Trend 🌿",
    growth_30d: "+14%",
    competition_level: "Medium",
    opportunity_gap: "+6%",
    printway_fit: 81,
    material: "Outdoor Treated Canvas / Wood",
    suggested_launch: "February - March",
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
      colors: ["Botanical Green", "Floral Pastel", "Terracotta"],
      themes: ["Flowers", "Garden tools", "Bee & Butterfly"],
      quotes: ["Welcome to Grandma's Garden", "Planting memories", "Garden of Love"],
      personalization_elements: ["Family garden title", "Established year"]
    },
    reasoning: "Moderate growth signal. Recommend monitoring listing velocity until Q1 Spring prep cycle."
  },
  {
    id: "opp-04",
    title: "Laser Engraved Metal Pet Tag",
    product_type: "Stainless Steel Pet Tag",
    category: "Pet Accessories",
    niche: "Pet Tag",
    season: "Year-Round",
    score: 58,
    recommendation: "SKIP",
    badge: "Low Factory Fit ⚠️",
    growth_30d: "+4%",
    competition_level: "High",
    opportunity_gap: "-12%",
    printway_fit: 34,
    material: "Laser Engraved Stainless Steel",
    suggested_launch: "N/A",
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
      colors: ["Silver", "Rose Gold", "Matte Black"],
      themes: ["Minimalist Tag"],
      quotes: ["Call my mom", "I'm lost"],
      personalization_elements: ["Phone number", "Pet Name"]
    },
    reasoning: "DEMO TRICK: Although raw search volume is high, market competition is saturated and Printway Production Fit is only 34% due to laser engraving equipment bottlenecks and tight margins. Recommendation: SKIP."
  }
];

export const EARLY_ALERTS: TrendAlert[] = [
  {
    id: "alert-01",
    keyword: "Pet Loss Christmas Ornament",
    demand_velocity: "+67%",
    competition_velocity: "+8%",
    confidence: "High",
    time_ago: "2 hours ago"
  },
  {
    id: "alert-02",
    keyword: "Personalized First Christmas in New Home Plaque",
    demand_velocity: "+52%",
    competition_velocity: "+11%",
    confidence: "High",
    time_ago: "5 hours ago"
  }
];
