export interface Theme {
  id: string
  name: string
  description: string
  swatches: string[]
  css: Record<string, string>
}

export const THEMES: Theme[] = [
  {
    id: "classic",
    name: "Klasyczny",
    description: "Granat i złoto — elegancki, tradycyjny",
    swatches: ["#0d1f40", "#c8a951", "#f7f4ef", "#eef2f9"],
    css: {
      "--color-navy-950": "#060e1f",
      "--color-navy-900": "#0d1f40",
      "--color-navy-800": "#142850",
      "--color-navy-700": "#1e3b6f",
      "--color-navy-600": "#2a4f8e",
      "--color-navy-500": "#3660a7",
      "--color-navy-100": "#c5d3e8",
      "--color-navy-50":  "#eef2f9",
      "--color-gold-600": "#a08338",
      "--color-gold-500": "#c8a951",
      "--color-gold-400": "#d4b55e",
      "--color-gold-300": "#e0c47a",
      "--color-gold-100": "#f5e9c4",
      "--color-gold-50":  "#fdf8ec",
      "--color-cream":    "#f7f4ef",
      "--background":     "#f7f4ef",
      "--prose-heading":  "#0d1f40",
      "--prose-link":     "#c8a951",
    },
  },
  {
    id: "bronze",
    name: "Militarny",
    description: "Ciemna oliwa i mosiądz — pasuje do logo tarczy",
    swatches: ["#3d3218", "#c49830", "#f0e8c8", "#ede0b0"],
    css: {
      "--color-navy-950": "#1a1408",
      "--color-navy-900": "#3d3218",
      "--color-navy-800": "#564520",
      "--color-navy-700": "#6d5828",
      "--color-navy-600": "#856c32",
      "--color-navy-500": "#9a8040",
      "--color-navy-100": "#d4b870",
      "--color-navy-50":  "#ede0b0",
      "--color-gold-600": "#a07828",
      "--color-gold-500": "#c49830",
      "--color-gold-400": "#d4a840",
      "--color-gold-300": "#e2bc60",
      "--color-gold-100": "#f0d890",
      "--color-gold-50":  "#faf0c8",
      "--color-cream":    "#f0e8c8",
      "--background":     "#f0e8c8",
      "--prose-heading":  "#3d3218",
      "--prose-link":     "#c49830",
    },
  },
  {
    id: "earthy",
    name: "Ziemisty",
    description: "Ciepły brąz i zieleń szałwii",
    swatches: ["#8a7650", "#8e977d", "#ece7d1", "#dbcea5"],
    css: {
      "--color-navy-950": "#3e3020",
      "--color-navy-900": "#8a7650",
      "--color-navy-800": "#9d8a65",
      "--color-navy-700": "#b09e7e",
      "--color-navy-600": "#c0b096",
      "--color-navy-500": "#cdc0ac",
      "--color-navy-100": "#dbcea5",
      "--color-navy-50":  "#ece7d1",
      "--color-gold-600": "#6b7460",
      "--color-gold-500": "#8e977d",
      "--color-gold-400": "#a3ab94",
      "--color-gold-300": "#b8bfac",
      "--color-gold-100": "#dde2d8",
      "--color-gold-50":  "#f0f2ee",
      "--color-cream":    "#ece7d1",
      "--background":     "#ece7d1",
      "--prose-heading":  "#8a7650",
      "--prose-link":     "#8e977d",
    },
  },
  {
    id: "slate",
    name: "Nowoczesny",
    description: "Ciemna stal i srebro — czysty, minimalistyczny",
    swatches: ["#1e293b", "#64748b", "#f8fafc", "#e2e8f0"],
    css: {
      "--color-navy-950": "#0f172a",
      "--color-navy-900": "#1e293b",
      "--color-navy-800": "#334155",
      "--color-navy-700": "#475569",
      "--color-navy-600": "#64748b",
      "--color-navy-500": "#94a3b8",
      "--color-navy-100": "#cbd5e1",
      "--color-navy-50":  "#f1f5f9",
      "--color-gold-600": "#475569",
      "--color-gold-500": "#64748b",
      "--color-gold-400": "#94a3b8",
      "--color-gold-300": "#cbd5e1",
      "--color-gold-100": "#e2e8f0",
      "--color-gold-50":  "#f8fafc",
      "--color-cream":    "#f8fafc",
      "--background":     "#f8fafc",
      "--prose-heading":  "#1e293b",
      "--prose-link":     "#64748b",
    },
  },
]

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

export function themeToCSS(theme: Theme): string {
  const vars = Object.entries(theme.css)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n")
  return `:root {\n${vars}\n}`
}
