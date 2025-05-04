/**
 * Theme configuration for the application.
 * Centralizes color values and theme settings for better management.
 */

export const lightTheme = {
  primary: "#1976d2", // Slightly darker blue
  secondary: "#f50057", // Pink accent
  background: "#f8f9fa", // Softer light background (slightly off-white)
  paper: "#ffffff", // White card background
  surfaceVariant: "#edf2f7", // Light gray for container backgrounds
  divider: "#e2e8f0", // Light gray for dividers
  text: {
    primary: "#1a202c", // Dark gray for primary text
    secondary: "#4a5568", // Medium gray for secondary text
  },
};

export const darkTheme = {
  primary: "#90caf9", // Light blue
  secondary: "#f48fb1", // Light pink
  background: "#121212", // Dark background
  paper: "#1e1e1e", // Slightly lighter dark for cards
  surfaceVariant: "#2d3748", // Medium dark gray for container backgrounds
  divider: "#2d3748", // Medium dark gray for dividers
  text: {
    primary: "#f7fafc", // Off-white for primary text
    secondary: "#a0aec0", // Light gray for secondary text
  },
};

// Other theme settings that apply to both light and dark modes
export const commonTheme = {
  borderRadius: "8px",
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  typography: {
    fontSize: 14,
    h1: { fontSize: "2.125rem", fontWeight: 600 },
    h2: { fontSize: "1.875rem", fontWeight: 600 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    h4: { fontSize: "1.25rem", fontWeight: 600 },
    h5: { fontSize: "1.125rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 600 },
  },
};
