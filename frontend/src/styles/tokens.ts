/**
 * Swiss Modernism 2.0 Design Tokens
 * Governed by mathematical discipline, strict 0px radii, and purposeful whitespace.
 */

export const swissTokens = {
  colors: {
    surface: '#F9F9F9',
    surfaceDim: '#DADADA',
    surfaceBright: '#F9F9F9',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F3F3F3',
    surfaceContainer: '#EEEEEE',
    surfaceContainerHigh: '#E8E8E8',
    surfaceContainerHighest: '#E2E2E2',
    onSurface: '#1A1C1C',
    onSurfaceVariant: '#4C4546',
    outline: '#7E7576',
    outlineVariant: '#CFC4C5',
    primary: '#000000',
    onPrimary: '#FFFFFF',
    primaryContainer: '#1B1B1B',
    secondary: '#DC2626', // Swiss Red focal accent
    secondaryDark: '#BB0112',
    hairline: '#E5E7EB',
    hairlineDark: '#1F2937',
    mutedText: '#4B5563',
    subtleText: '#9CA3AF',
    bg: '#F5F5F5',
    white: '#FFFFFF',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#BA1A1A',
  },
  typography: {
    fontSans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
    displayHero: {
      fontSize: '72px',
      fontWeight: '800',
      lineHeight: '76px',
      letterSpacing: '-0.04em',
    },
    headlineLg: {
      fontSize: '48px',
      fontWeight: '700',
      lineHeight: '52px',
      letterSpacing: '-0.03em',
    },
    headlineMd: {
      fontSize: '32px',
      fontWeight: '600',
      lineHeight: '38px',
      letterSpacing: '-0.02em',
    },
    headlineSm: {
      fontSize: '24px',
      fontWeight: '600',
      lineHeight: '30px',
      letterSpacing: '-0.01em',
    },
    titleMd: {
      fontSize: '18px',
      fontWeight: '600',
      lineHeight: '24px',
      letterSpacing: '-0.01em',
    },
    bodyLg: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '24px',
      letterSpacing: '0em',
    },
    bodyMd: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
      letterSpacing: '0em',
    },
    labelCaps: {
      fontSize: '11px',
      fontWeight: '700',
      lineHeight: '14px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
    },
    monoIndex: {
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '16px',
      letterSpacing: '0.02em',
    },
  },
  spacing: {
    gutter: '1.5rem',
    gutterMobile: '1rem',
    margin: '2rem',
    marginMobile: '1rem',
  },
  borderRadius: {
    none: '0px',
  },
} as const;

export default swissTokens;
