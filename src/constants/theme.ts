export const Colors = {
  primary: '#4ECDC4',
  primaryLight: '#4ECDC4' + '20',

  light: {
    background: '#F6F8F8',
    surface: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
  },

  dark: {
    background: '#131F1E',
    surface: '#1E2D2B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
  },

  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  dinner: {
    cooking: '#22C55E',
    ordering: '#F59E0B',
    outTonight: '#3B82F6',
    unknown: '#64748B',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
