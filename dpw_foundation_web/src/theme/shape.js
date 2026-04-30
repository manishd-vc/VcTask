// Shape configuration for consistent border-radius values across the application
const shape = {
  // Default border radius for general use (e.g., buttons, cards)
  borderRadius: 8,

  // Smaller border radius for compact elements (e.g., small buttons, inputs)
  borderRadiusSm: 12,

  // Medium border radius for larger UI elements (e.g., modals, large buttons)
  borderRadiusMd: 16,

  // No border radius, for elements that need sharp corners (e.g., some cards, containers)
  borderRadiusNo: 0
};

// Exporting the shape configuration to be used throughout the application
export default shape;
