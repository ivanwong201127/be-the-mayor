// Environment detection utility
export function getEnvironment() {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return 'server';
  }

  const hostname = window.location.hostname;
  const origin = window.location.origin;

  // Production environment
  if (hostname === 'be-the-mayor.vercel.app' || hostname.includes('vercel.app')) {
    return 'production';
  }

  // Development environment
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost')) {
    return 'development';
  }

  // Staging or other environments
  if (hostname.includes('staging') || hostname.includes('preview')) {
    return 'staging';
  }

  // Default to production for unknown domains
  return 'production';
}

export function getBaseUrl() {
  if (typeof window === 'undefined') {
    return '';
  }

  const environment = getEnvironment();
  
  switch (environment) {
    case 'development':
      return 'http://localhost:3000';
    case 'staging':
      return window.location.origin;
    case 'production':
      return 'https://be-the-mayor.vercel.app';
    default:
      return window.location.origin;
  }
}

export function isProduction() {
  return getEnvironment() === 'production';
}

export function isDevelopment() {
  return getEnvironment() === 'development';
}

export function isStaging() {
  return getEnvironment() === 'staging';
}
