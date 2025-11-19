/**
 * Secret Detection Configuration
 * 
 * This file contains patterns and rules for detecting secrets in production builds.
 */

export const DETECTION_PATTERNS = {
  // AWS Credentials
  AWS_ACCESS_KEY: {
    pattern: /AKIA[0-9A-Z]{16}/g,
    severity: 'critical',
    description: 'AWS Access Key ID',
  },
  AWS_SECRET_KEY: {
    pattern: /aws_secret_access_key\s*=\s*['"][^'"]{40}['"]/gi,
    severity: 'critical',
    description: 'AWS Secret Access Key',
  },
  
  // Generic API Keys
  GENERIC_API_KEY: {
    pattern: /api[_-]?key\s*[:=]\s*['"]([a-zA-Z0-9_\-]{20,})['"]|['"]([a-zA-Z0-9_\-]{20,})['"]\s*[:=]\s*api[_-]?key/gi,
    severity: 'high',
    description: 'Generic API Key',
  },
  
  // Bearer Tokens
  BEARER_TOKEN: {
    pattern: /bearer\s+[a-zA-Z0-9_\-\.]{20,}/gi,
    severity: 'high',
    description: 'Bearer Token',
  },
  
  // Private Keys
  PRIVATE_KEY: {
    pattern: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/gi,
    severity: 'critical',
    description: 'Private Key',
  },
  
  // Database URLs with credentials
  DATABASE_URL: {
    pattern: /(mongodb|mysql|postgresql|postgres):\/\/[^\s'"]+:[^\s'"]+@[^\s'"]+/gi,
    severity: 'critical',
    description: 'Database Connection String with Credentials',
  },
  
  // JWT Tokens
  JWT_TOKEN: {
    pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g,
    severity: 'high',
    description: 'JWT Token',
  },
  
  // Generic Secret/Password patterns
  GENERIC_SECRET: {
    pattern: /(secret|password|passwd|pwd|token)\s*[:=]\s*['"]([^'"]{8,})['"]|['"]([^'"]{8,})['"]\s*[:=]\s*(secret|password|passwd|pwd|token)/gi,
    severity: 'medium',
    description: 'Generic Secret/Password',
  },
  
  // GitHub Token
  GITHUB_TOKEN: {
    pattern: /gh[pousr]_[A-Za-z0-9_]{36,}/g,
    severity: 'critical',
    description: 'GitHub Token',
  },
  
  // Slack Token
  SLACK_TOKEN: {
    pattern: /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24,}/g,
    severity: 'high',
    description: 'Slack Token',
  },
  
  // Google API Key
  GOOGLE_API_KEY: {
    pattern: /AIza[0-9A-Za-z_-]{35}/g,
    severity: 'high',
    description: 'Google API Key',
  },
};

/**
 * Patterns that should be automatically allowed (not flagged as secrets)
 */
export const ALLOWLIST_PATTERNS = [
  // VITE environment variables (public by design)
  /VITE_[A-Z_]+/g,
  
  // Common placeholders
  /your-[a-z-]+-here/gi,
  /example\.com/gi,
  /localhost/gi,
  /127\.0\.0\.1/g,
  /0\.0\.0\.0/g,
  /X{5,}/g,
  
  // Test/dummy values
  /test-[a-z-]+-key/gi,
  /dummy-[a-z-]+-token/gi,
  /fake-[a-z-]+-secret/gi,
  /sample-[a-z-]+-key/gi,
  
  // Common non-secret strings
  /placeholder/gi,
  /changeme/gi,
  /replace-this/gi,
];

/**
 * File type filters
 */
export const FILE_FILTERS = {
  // Files to scan
  include: ['.js', '.mjs', '.cjs', '.html', '.css', '.json'],
  
  // Files to exclude
  exclude: ['.map', '.woff', '.woff2', '.ttf', '.eot', '.otf', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp', '.ico', '.tiff', '.tif', '.avif'],
};

/**
 * Entropy threshold for detecting high-randomness strings
 * Strings with entropy above this value and length > 40 will be flagged
 */
export const ENTROPY_THRESHOLD = 4.5;

/**
 * Minimum length for entropy-based detection
 */
export const MIN_ENTROPY_LENGTH = 40;

/**
 * Severity levels
 */
export const SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

/**
 * Exit codes
 */
export const EXIT_CODES = {
  SUCCESS: 0,
  SECRETS_FOUND: 1,
  ERROR: 2,
};