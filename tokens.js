/**
 * Design Tokens (JS / TS-compatible)
 * Source: Figma "Design System" library (fileKey: 8JV1QkzSuEpZEMtLiLQYYv)
 * Mirrors tokens.css 1:1. Values are resolved (no var() chains).
 *
 * Usage:
 *   import { color, font } from "./tokens.js";
 *   <div style={{ background: color.bg.layout, color: color.text.secondary }} />
 *
 * Tailwind config example:
 *   theme: { extend: { colors: color, fontFamily: { sans: font.family.default } } }
 */

/* ============================================================
 * Primitive color ramps
 * ============================================================ */
export const primitive = {
  grey: {
    1: "#fafafa", 2: "#f5f5f5", 3: "#ebebeb", 4: "#dbdbdb", 5: "#c7c7c7",
    6: "#adadad", 7: "#8d8d8f", 8: "#69696b", 9: "#424242", 10: "#141414",
  },
  blue: {
    1: "#f5f9ff", 2: "#e8f2ff", 3: "#c9dfff", 4: "#a1c3ff", 5: "#78a5ff",
    6: "#4e84ff", 7: "#2660ff", 8: "#1643d9", 9: "#0024b2", 10: "#00178c",
  },
  cyan: {
    1: "#e6fffb", 2: "#b5f5ec", 3: "#87e8de", 4: "#5cdbd3", 5: "#36cfc9",
    6: "#13c2c2", 7: "#08979c", 8: "#006d75", 9: "#00474f", 10: "#002329",
  },
  purple: {
    1: "#f9f0ff", 2: "#efdbff", 3: "#d3adf7", 4: "#b37feb", 5: "#9254de",
    6: "#722ed1", 7: "#531dab", 8: "#391085", 9: "#22075e", 10: "#120338",
  },
  geekblue: {
    1: "#f0f5ff", 2: "#d6e4ff", 3: "#adc6ff", 4: "#85a5ff", 5: "#597ef7",
    6: "#2f54eb", 7: "#1d39c4", 8: "#10239e", 9: "#061178", 10: "#030852",
  },
  green: {
    1: "#f0fde2", 2: "#d9f7be", 3: "#b7eb8f", 4: "#95de64", 5: "#73d13d",
    6: "#52c41a", 7: "#389e0d", 8: "#237804", 9: "#135200", 10: "#092b00",
  },
  gold: {
    1: "#fffbe6", 2: "#fff1b8", 3: "#ffe58f", 4: "#ffd666", 5: "#ffc53d",
    6: "#faad14", 7: "#d48806", 8: "#ad6800", 9: "#874d00", 10: "#613400",
  },
  red: {
    1: "#fff1f0", 2: "#ffccc7", 3: "#ffa39e", 4: "#ff7875", 5: "#ff4d4f",
    6: "#f5222d", 7: "#cf1322", 8: "#a8071a", 9: "#820014", 10: "#5c0011",
  },
  magenta: {
    1: "#fff0f6", 2: "#ffd6e7", 3: "#ffadd2", 4: "#ff85c0", 5: "#f759ab",
    6: "#eb2f96", 7: "#c41d7f", 8: "#9e1068", 9: "#780650", 10: "#520339",
  },
  orange: {
    1: "#fff7e6", 2: "#ffe7ba", 3: "#ffd591", 4: "#ffc069", 5: "#ffa940",
    6: "#fa8c16", 7: "#d46b08", 8: "#ad4e00", 9: "#873800", 10: "#612500",
  },
  volcano: {
    1: "#fff2e8", 2: "#ffd8bf", 3: "#ffbb96", 4: "#ff9c6e", 5: "#ff7a45",
    6: "#fa541c", 7: "#d4380d", 8: "#ad2102", 9: "#871400", 10: "#610b00",
  },
  yellow: {
    1: "#feffe6", 2: "#ffffb8", 3: "#fffb8f", 4: "#fff566", 5: "#ffec3d",
    6: "#fadb14", 7: "#d4b106", 8: "#ad8b00", 9: "#876800", 10: "#614700",
  },
  lime: {
    1: "#fcffe6", 2: "#f4ffb8", 3: "#eaff8f", 4: "#d3f261", 5: "#bae637",
    6: "#a0d911", 7: "#7cb305", 8: "#5b8c00", 9: "#3f6600", 10: "#254000",
  },
};


/* ============================================================
 * Semantic colors
 * ============================================================ */
export const color = {
  /* --- Text --- */
  text: {
    base:        "#000000",
    default:     "#1f1f1f",
    secondary:   "#595959",
    tertiary:    "#8c8c8c",
    quaternary:  "#bfbfbf",
    light:       "#ffffff",
  },

  /* --- Background --- */
  bg: {
    baseWhite:        "#ffffff",
    baseBlack:        "#000000",
    layout:           "#f4f6f8",
    container:        "#ffffff",
    containerDisabled: primitive.grey[2],
    dark:             primitive.grey[10],
    /* Warm beige palette — boutique / editorial mood pages */
    page:             "#faf8f4",
    cardSoft:         "#f1ece4",
    notice:           "#1f1d1a",
    /* Overlays — semi-transparent fills over media */
    overlayLight10:   "rgba(255, 255, 255, 0.1)",
    overlayLight50:   "rgba(255, 255, 255, 0.5)",
  },

  /* --- Border --- */
  border: {
    default:    primitive.grey[4],
    dark:       primitive.grey[7],
    secondary:  primitive.grey[3],
    disabled:   primitive.grey[3],
  },

  /* --- Fill --- */
  fill: {
    default:    primitive.grey[3],
    secondary:  primitive.grey[2],
    tertiary:   primitive.grey[1],
  },

  /* --- State --- */
  state: {
    success: primitive.green[6],
    warning: primitive.gold[6],
    error:   primitive.red[6],
  },

  /* --- Primary (default = Baropharm) --- */
  primary: {
    bg:           primitive.blue[1],
    bgHover:      primitive.blue[2],
    border:       primitive.blue[3],
    borderHover:  primitive.blue[4],
    hover:        primitive.blue[5],
    default:      primitive.blue[6],
    active:       primitive.blue[7],
    textHover:    primitive.blue[8],
    text:         primitive.blue[9],
    textActive:   primitive.blue[10],
  },

  /* --- Brand sub-palettes --- */
  brand: {
    pillens: {
      bg: "#eaebfd", bgHover: "#cbccf9", border: "#a7abf4", borderHover: "#8289f0",
      hover: "#666dec", default: "#4b4fe6", active: "#4647da",
      textHover: "#3d3cce", text: "#3530c2", textActive: "#2615b0",
    },
    aroundpharm: {
      bg: "#e9fbf8", bgHover: primitive.cyan[2], border: primitive.cyan[3], borderHover: primitive.cyan[4],
      hover: primitive.cyan[5], default: "#09b9ba", active: primitive.cyan[7],
      textHover: primitive.cyan[8], text: primitive.cyan[9], textActive: primitive.cyan[10],
    },
    brpinsight: {
      bg: primitive.purple[1], bgHover: primitive.purple[2], border: primitive.purple[3], borderHover: primitive.purple[4],
      hover: primitive.purple[5], default: primitive.purple[6], active: primitive.purple[7],
      textHover: primitive.purple[8], text: primitive.purple[9], textActive: primitive.purple[10],
    },
    community: {
      bg: "#e7f8f8", bgHover: "#d5f6f5", border: "#adebeb", borderHover: "#88e3df",
      hover: "#43d1cc", default: "#27b4b0", active: "#21a19c",
      textHover: "#1f9995", text: "#19807d", textActive: "#146664",
    },
    pharmall: {
      bg: primitive.geekblue[1], bgHover: primitive.geekblue[2], border: primitive.geekblue[3], borderHover: primitive.geekblue[4],
      hover: primitive.geekblue[5], default: primitive.geekblue[6], active: primitive.geekblue[7],
      textHover: primitive.geekblue[8], text: primitive.geekblue[9], textActive: primitive.geekblue[10],
    },
    baropharm: {
      bg: primitive.blue[1], bgHover: primitive.blue[2], border: primitive.blue[3], borderHover: primitive.blue[4],
      hover: primitive.blue[5], default: primitive.blue[6], active: primitive.blue[7],
      textHover: primitive.blue[8], text: primitive.blue[9], textActive: primitive.blue[10],
    },
    /* Revion℞ — single muted-brown accent (campaign / marquee).
     * Not part of the 10-slot brand system. See issues.md for context. */
    revion: {
      brown: "#693c17",
    },
  },

  /* --- Service --- */
  service: {
    business:   "#003cd5",
    community:  "#2ac1bc",
    point:      "#23c17d",
  },

  /* --- Membership (each tier has main + bg variant) --- */
  membership: {
    family: { main: "#7a99ab", bg: "#f4f7f8" },
    red:    { main: "#e43a3d", bg: "#fdefef" },
    blue:   { main: "#007dcb", bg: "#ebf5fc" },
    green:  { main: "#25b01e", bg: "#ecf9f2" },
    orange: { main: "#fc7f00", bg: "#fff5eb" },
    purple: { main: "#9e50b9", bg: "#f6f0fb" },
    black:  { main: "#31383f", bg: "#f1f3f5" },
  },

  /* --- Partner brand colors (Korean partner names in `label`) --- */
  partner: {
    ourpharm:        { label: "아워팜",     hex: "#43a536" },
    kenvue:          { label: "켄뷰",       hex: "#00b197" },
    kyungdong:       { label: "경동제약",   hex: "#49a993" },
    person:          { label: "퍼슨",       hex: "#dd4349" },
    handok:          { label: "한독",       hex: "#0079c2" },
    optus:           { label: "옵투스",     hex: "#36125c" },
    youngjin:        { label: "영진약품",   hex: "#f7941d" },
    cmg:             { label: "CMG제약",    hex: "#38b781" },
    bukwang:         { label: "부광약품",   hex: "#7cbe28" },
    huons:           { label: "휴온스",     hex: "#185bae" },
    mothers:         { label: "마더스",     hex: "#e5006e" },
    kolon:           { label: "코오롱제약", hex: "#e81c28" },
    pharmaresearch:  { label: "파마리서치", hex: "#3dae2b" },
    daewon:          { label: "대원제약",   hex: "#e4032e" },
    skChemical:      { label: "SK케미칼",   hex: "#ea002c" },
    iksu:            { label: "익수제약",   hex: "#e60012" },
    yuyu:            { label: "유유제약",   hex: "#004a97" },
    ildongFoodis:    { label: "일동후디스", hex: "#e60021" },
    nutri:           { label: "뉴트리",     hex: "#076d3a" },
    hyundai:         { label: "현대약품",   hex: "#005b69" },
    aliceLab:        { label: "앨리스랩",   hex: "#004079" },
    hanpung:         { label: "한풍제약",   hex: "#2e3092" },
  },
};


/* ============================================================
 * Typography
 * ============================================================ */
export const font = {
  family: {
    default: '"Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
    /* Editorial sans for campaign / marquee use (REVION℞ home).
     * The Inter web font must be loaded by the consuming page. */
    marquee: '"Inter", "Plus Jakarta Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
  },

  weight: {
    regular:   400,
    medium:    500,
    semibold:  600,
    bold:      700,
  },

  /* --- Web variant (default) --- */
  web: {
    /* Display */
    display1: { fontFamily: "Pretendard", fontWeight: 700, fontSize: 56, lineHeight: 72 },
    display2: { fontFamily: "Pretendard", fontWeight: 700, fontSize: 48, lineHeight: 64 },
    display3: { fontFamily: "Pretendard", fontWeight: 700, fontSize: 40, lineHeight: 52 },
    display4: { fontFamily: "Pretendard", fontWeight: 700, fontSize: 36, lineHeight: 48 },
    display5: { fontFamily: "Pretendard", fontWeight: 700, fontSize: 32, lineHeight: 42 },
    display6: { fontFamily: "Pretendard", fontWeight: 700, fontSize: 28, lineHeight: 38 },

    /* Desktop (large headline used across web components) */
    desktopH1: { fontFamily: "Pretendard", fontWeight: 600, fontSize: 38, lineHeight: 46 },

    /* Headline */
    h1:   { fontFamily: "Pretendard", fontWeight: 600, fontSize: 24, lineHeight: 32 },
    h1B:  { fontFamily: "Pretendard", fontWeight: 700, fontSize: 24, lineHeight: 32 },
    h2:   { fontFamily: "Pretendard", fontWeight: 600, fontSize: 20, lineHeight: 28 },
    h2B:  { fontFamily: "Pretendard", fontWeight: 700, fontSize: 20, lineHeight: 28 },
    h3:   { fontFamily: "Pretendard", fontWeight: 600, fontSize: 18, lineHeight: 26 },
    h3B:  { fontFamily: "Pretendard", fontWeight: 700, fontSize: 18, lineHeight: 26 },
    h4:   { fontFamily: "Pretendard", fontWeight: 600, fontSize: 16, lineHeight: 24 },
    h4B:  { fontFamily: "Pretendard", fontWeight: 700, fontSize: 16, lineHeight: 24 },
    h5:   { fontFamily: "Pretendard", fontWeight: 600, fontSize: 14, lineHeight: 20 },
    h6:   { fontFamily: "Pretendard", fontWeight: 600, fontSize: 12, lineHeight: 16 },

    /* Body */
    b1:           { fontFamily: "Pretendard", fontWeight: 400, fontSize: 18, lineHeight: 26 },
    b1TitleLarge: { fontFamily: "Pretendard", fontWeight: 600, fontSize: 20, lineHeight: 24 },
    b2:           { fontFamily: "Pretendard", fontWeight: 400, fontSize: 16, lineHeight: 24 },
    b3:           { fontFamily: "Pretendard", fontWeight: 400, fontSize: 14, lineHeight: 20 },
    b4:           { fontFamily: "Pretendard", fontWeight: 500, fontSize: 13, lineHeight: 18 },
    b5:           { fontFamily: "Pretendard", fontWeight: 400, fontSize: 12, lineHeight: 16 },
    b6:           { fontFamily: "Pretendard", fontWeight: 400, fontSize: 10, lineHeight: 14 },

    /* Caption */
    caption: { fontFamily: "Pretendard", fontWeight: 500, fontSize: 11, lineHeight: 16 },
  },

  /* --- iOS variant (sizes are +1pt larger than the Web counterparts) --- */
  ios: {
    h1:       { fontFamily: "Pretendard", fontWeight: 600, fontSize: 24, lineHeight: 32 },
    h2:       { fontFamily: "Pretendard", fontWeight: 600, fontSize: 25, lineHeight: 31 },
    h3:       { fontFamily: "Pretendard", fontWeight: 600, fontSize: 21, lineHeight: 28 },
    h4:       { fontFamily: "Pretendard", fontWeight: 600, fontSize: 19, lineHeight: 26 },
    h5:       { fontFamily: "Pretendard", fontWeight: 600, fontSize: 17, lineHeight: 24 },
    h6:       { fontFamily: "Pretendard", fontWeight: 600, fontSize: 15, lineHeight: 20 },
    h7:       { fontFamily: "Pretendard", fontWeight: 600, fontSize: 13, lineHeight: 16 },
    b1:       { fontFamily: "Pretendard", fontWeight: 400, fontSize: 19, lineHeight: 26 },
    b2:       { fontFamily: "Pretendard", fontWeight: 400, fontSize: 17, lineHeight: 24 },
    b3:       { fontFamily: "Pretendard", fontWeight: 400, fontSize: 15, lineHeight: 20 },
    b4:       { fontFamily: "Pretendard", fontWeight: 400, fontSize: 13, lineHeight: 16 },
    caption:  { fontFamily: "Pretendard", fontWeight: 500, fontSize: 12, lineHeight: 14 },
  },
};


/* ============================================================
 * Space
 * Discovered in component-level usage (not exposed in Foundation page).
 * Only XS/SM tier currently used; expand as more values surface.
 * ============================================================ */
export const space = {
  padding: {
    xs: 8,
    sm: 12,
  },
  margin: {
    xs: 8,
  },
  /* Layout-level — section rhythm */
  sectionY:     80,
  containerX:   24,
  gapMd:        16,
  gapLg:        24,
  maxWidthContent: 1280,
  maxWidthShowcase: 1600,
  sectionYLg: 120,
};


/* ============================================================
 * Border radius
 * ============================================================ */
export const radius = {
  sm:   4,
  md:   12,   /* product card / button group */
  lg:   20,   /* hero image / large media */
  pill: 999,  /* circular / pill shapes (dots, icons) */
};


/* ============================================================
 * Shadow — multi-layer drop shadows
 * String values are ready to drop into a CSS `box-shadow` property.
 * ============================================================ */
export const shadow = {
  secondary:
    "0 9px 28px 8px rgba(0, 0, 0, 0.05), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08)",
  switchHandle: "0 2px 4px 0 rgba(0, 35, 11, 0.2)",
  onGray200:    "0 1px 4px 0 rgba(0, 0, 0, 0.06)",
  /* For text rendered over photographic images */
  textOverlay:  "0 2px 8px rgba(0, 0, 0, 0.4)",
};


/* ============================================================
 * Default export — everything in one bag
 * ============================================================ */
export default { primitive, color, font, space, radius, shadow };
