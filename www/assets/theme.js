/**
 * Kaamzo Central Theme Configuration (Customer & Worker Apps)
 * Single source of truth for all colour tokens across Customer and Worker portals.
 */
(function () {
  var KAAMZO_THEME = Object.freeze({
    primary: "#F57C00",       // Saffron (brand colour, logo, icons, highlights, active tab icons)
    primaryDark: "#C94B00",   // Deep saffron (primary buttons with white text, links, secondary button borders/text)
    surfaceDark: "#3B2A20",   // Espresso brown (headings, top app bar, bottom nav, footer, dark surfaces)
    success: "#2E9E5B",       // Verified green (verified badges, success states, "Paid" and "Completed" labels only)
    background: "#FFF8F0",    // Warm cream (main screen background)
    card: "#F1E6D8",          // Soft sand (cards, input fields, dividers, chips)
    textPrimary: "#222222",   // Charcoal (body text & text on saffron #F57C00)
    error: "#C62828",         // Error red (errors, cancellations, failed payments only)
    white: "#FFFFFF",         // White (text on deep saffron #C94B00 and espresso brown #3B2A20)
    inactiveNav: "rgba(255, 248, 240, 0.6)" // Cream at 60% opacity for inactive nav items
  });

  if (typeof window !== "undefined") {
    window.KAAMZO_THEME = KAAMZO_THEME;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = KAAMZO_THEME;
  }
})();
