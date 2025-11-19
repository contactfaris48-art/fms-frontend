#!/usr/bin/env node

/**
 * Secret Detection Script
 * 
 * Scans the dist/ directory for potential secrets in production builds.
 * Exits with code 1 if critical or high severity secrets are found.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  DETECTION_PATTERNS,
  ALLOWLIST_PATTERNS,
  FILE_FILTERS,
  ENTROPY_THRESHOLD,
  MIN_ENTROPY_LENGTH,
  SEVERITY,
  EXIT_CODES,
} from './secrets-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
};

/**
 * Calculate Shannon entropy of a string
 * @param {string} str - The string to analyze
 * @returns {number} - The entropy value
 */
function calculateEntropy(str) {
  const len = str.length;
  const frequencies = {};
  
  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  
  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  
  return entropy;
}

/**
 * Check if a match should be allowed based on allowlist patterns
 * @param {string} match - The matched string
 * @returns {boolean} - True if the match should be allowed
 */
function isAllowlisted(match) {
  return ALLOWLIST_PATTERNS.some(pattern => {
    pattern.lastIndex = 0; // Reset regex state
    return pattern.test(match);
  });
}

/**
 * Load custom allowlist from .secretsignore file
 * @returns {Array<RegExp>} - Array of custom allowlist patterns
 */
function loadSecretsIgnore() {
  const ignorePath = path.join(process.cwd(), '.secretsignore');
  const customPatterns = [];
  
  if (fs.existsSync(ignorePath)) {
    const content = fs.readFileSync(ignorePath, 'utf-8');
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }
      
      try {
        // Check if it's a regex pattern (enclosed in /)
        if (trimmed.startsWith('/') && trimmed.endsWith('/')) {
          const pattern = trimmed.slice(1, -1);
          customPatterns.push(new RegExp(pattern, 'gi'));
        } else if (trimmed.includes('*')) {
          // Convert glob pattern to regex
          const pattern = trimmed
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
          customPatterns.push(new RegExp(`^${pattern}$`, 'i'));
        } else {
          // Exact match
          customPatterns.push(new RegExp(`^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'));
        }
      } catch (error) {
        console.warn(`${colors.yellow}Warning: Invalid pattern in .secretsignore: ${trimmed}${colors.reset}`);
      }
    }
  }
  
  return customPatterns;
}

/**
 * Check if a file should be scanned based on its extension
 * @param {string} filename - The filename to check
 * @returns {boolean} - True if the file should be scanned
 */
function shouldScanFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  
  // Check if excluded
  if (FILE_FILTERS.exclude.some(excludeExt => ext === excludeExt)) {
    return false;
  }
  
  // Check if included
  return FILE_FILTERS.include.some(includeExt => ext === includeExt);
}

/**
 * Get context lines around a match
 * @param {string} content - The file content
 * @param {number} lineNumber - The line number of the match
 * @param {number} contextLines - Number of lines to show before and after
 * @returns {string} - Formatted context
 */
function getContext(content, lineNumber, contextLines = 2) {
  const lines = content.split('\n');
  const start = Math.max(0, lineNumber - contextLines - 1);
  const end = Math.min(lines.length, lineNumber + contextLines);
  
  let context = '';
  for (let i = start; i < end; i++) {
    const prefix = i === lineNumber - 1 ? '→' : ' ';
    const lineNum = String(i + 1).padStart(4, ' ');
    context += `   ${colors.gray}${lineNum}${colors.reset} ${prefix} ${lines[i]}\n`;
  }
  
  return context;
}

/**
 * Scan a file for secrets
 * @param {string} filePath - Path to the file
 * @param {Array<RegExp>} customAllowlist - Custom allowlist patterns
 * @returns {Array} - Array of findings
 */
function scanFile(filePath, customAllowlist) {
  const findings = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Check each detection pattern
    for (const [name, config] of Object.entries(DETECTION_PATTERNS)) {
      const { pattern, severity, description } = config;
      pattern.lastIndex = 0; // Reset regex state
      
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const matchedText = match[0];
        
        // Check if allowlisted
        if (isAllowlisted(matchedText)) {
          continue;
        }
        
        // Check custom allowlist
        if (customAllowlist.some(p => {
          p.lastIndex = 0;
          return p.test(matchedText);
        })) {
          continue;
        }
        
        // Find line number
        let lineNumber = 1;
        let charCount = 0;
        for (let i = 0; i < lines.length; i++) {
          charCount += lines[i].length + 1; // +1 for newline
          if (charCount > match.index) {
            lineNumber = i + 1;
            break;
          }
        }
        
        findings.push({
          type: name,
          description,
          severity,
          match: matchedText,
          line: lineNumber,
          file: filePath,
          context: getContext(content, lineNumber),
        });
      }
    }
    
    // Check for high entropy strings
    const words = content.match(/['"][a-zA-Z0-9+/=_-]{40,}['"]/g) || [];
    for (const word of words) {
      const cleaned = word.slice(1, -1); // Remove quotes
      
      // Skip if allowlisted
      if (isAllowlisted(cleaned)) {
        continue;
      }
      
      // Check custom allowlist
      if (customAllowlist.some(p => {
        p.lastIndex = 0;
        return p.test(cleaned);
      })) {
        continue;
      }
      
      const entropy = calculateEntropy(cleaned);
      
      if (entropy > ENTROPY_THRESHOLD && cleaned.length >= MIN_ENTROPY_LENGTH) {
        // Find line number
        const index = content.indexOf(word);
        let lineNumber = 1;
        let charCount = 0;
        for (let i = 0; i < lines.length; i++) {
          charCount += lines[i].length + 1;
          if (charCount > index) {
            lineNumber = i + 1;
            break;
          }
        }
        
        findings.push({
          type: 'HIGH_ENTROPY',
          description: 'High Entropy String',
          severity: SEVERITY.LOW,
          match: cleaned,
          entropy: entropy.toFixed(2),
          line: lineNumber,
          file: filePath,
          context: getContext(content, lineNumber),
        });
      }
    }
  } catch (error) {
    console.warn(`${colors.yellow}Warning: Could not scan file ${filePath}: ${error.message}${colors.reset}`);
  }
  
  return findings;
}

/**
 * Recursively scan a directory
 * @param {string} dir - Directory to scan
 * @param {Array<RegExp>} customAllowlist - Custom allowlist patterns
 * @returns {Array} - Array of all findings
 */
function scanDirectory(dir, customAllowlist) {
  let allFindings = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        allFindings = allFindings.concat(scanDirectory(fullPath, customAllowlist));
      } else if (entry.isFile() && shouldScanFile(entry.name)) {
        const findings = scanFile(fullPath, customAllowlist);
        allFindings = allFindings.concat(findings);
      }
    }
  } catch (error) {
    console.error(`${colors.red}Error scanning directory ${dir}: ${error.message}${colors.reset}`);
  }
  
  return allFindings;
}

/**
 * Get color for severity level
 * @param {string} severity - Severity level
 * @returns {string} - ANSI color code
 */
function getSeverityColor(severity) {
  switch (severity) {
    case SEVERITY.CRITICAL:
      return colors.red;
    case SEVERITY.HIGH:
      return colors.yellow;
    case SEVERITY.MEDIUM:
      return colors.yellow;
    case SEVERITY.LOW:
      return colors.cyan;
    default:
      return colors.reset;
  }
}

/**
 * Get icon for severity level
 * @param {string} severity - Severity level
 * @returns {string} - Icon
 */
function getSeverityIcon(severity) {
  switch (severity) {
    case SEVERITY.CRITICAL:
      return '❌';
    case SEVERITY.HIGH:
      return '⚠️ ';
    case SEVERITY.MEDIUM:
      return '⚠️ ';
    case SEVERITY.LOW:
      return 'ℹ️ ';
    default:
      return '•';
  }
}

/**
 * Display findings
 * @param {Array} findings - Array of findings
 */
function displayFindings(findings) {
  if (findings.length === 0) {
    console.log(`\n${colors.green}✓ No secrets found!${colors.reset}\n`);
    return;
  }
  
  // Group by severity
  const grouped = {
    [SEVERITY.CRITICAL]: [],
    [SEVERITY.HIGH]: [],
    [SEVERITY.MEDIUM]: [],
    [SEVERITY.LOW]: [],
  };
  
  for (const finding of findings) {
    grouped[finding.severity].push(finding);
  }
  
  console.log('\n');
  
  // Display each severity group
  for (const severity of [SEVERITY.CRITICAL, SEVERITY.HIGH, SEVERITY.MEDIUM, SEVERITY.LOW]) {
    const items = grouped[severity];
    if (items.length === 0) continue;
    
    const color = getSeverityColor(severity);
    const icon = getSeverityIcon(severity);
    
    for (const finding of items) {
      console.log(`${icon} ${color}${severity.toUpperCase()}: ${finding.description}${colors.reset}`);
      console.log(`   ${colors.gray}File:${colors.reset} ${finding.file}:${finding.line}`);
      console.log(`   ${colors.gray}Match:${colors.reset} ${finding.match.substring(0, 100)}${finding.match.length > 100 ? '...' : ''}`);
      
      if (finding.entropy) {
        console.log(`   ${colors.gray}Entropy:${colors.reset} ${finding.entropy}`);
      }
      
      console.log(`   ${colors.gray}Context:${colors.reset}`);
      console.log(finding.context);
    }
  }
  
  // Summary
  const criticalCount = grouped[SEVERITY.CRITICAL].length;
  const highCount = grouped[SEVERITY.HIGH].length;
  const mediumCount = grouped[SEVERITY.MEDIUM].length;
  const lowCount = grouped[SEVERITY.LOW].length;
  
  console.log('━'.repeat(120));
  console.log(`\n${colors.bright}Summary:${colors.reset}`);
  console.log(`  ${colors.red}Critical: ${criticalCount}${colors.reset}`);
  console.log(`  ${colors.yellow}High: ${highCount}${colors.reset}`);
  console.log(`  ${colors.yellow}Medium: ${mediumCount}${colors.reset}`);
  console.log(`  ${colors.cyan}Low: ${lowCount}${colors.reset}`);
  console.log(`  ${colors.bright}Total: ${findings.length}${colors.reset}\n`);
}

/**
 * Main function
 */
function main() {
  const distPath = path.join(process.cwd(), 'dist');
  
  console.log(`${colors.bright}🔍 Scanning dist/ for secrets...${colors.reset}`);
  
  // Check if dist directory exists
  if (!fs.existsSync(distPath)) {
    console.error(`${colors.red}Error: dist/ directory not found. Please run the build first.${colors.reset}`);
    process.exit(EXIT_CODES.ERROR);
  }
  
  // Load custom allowlist
  const customAllowlist = loadSecretsIgnore();
  if (customAllowlist.length > 0) {
    console.log(`${colors.gray}Loaded ${customAllowlist.length} custom allowlist patterns from .secretsignore${colors.reset}`);
  }
  
  // Scan directory
  const findings = scanDirectory(distPath, customAllowlist);
  
  // Display results
  displayFindings(findings);
  
  // Determine exit code
  const hasCritical = findings.some(f => f.severity === SEVERITY.CRITICAL);
  const hasHigh = findings.some(f => f.severity === SEVERITY.HIGH);
  
  if (hasCritical || hasHigh) {
    console.error(`${colors.red}${colors.bright}Build failed: Critical or high severity secrets detected!${colors.reset}`);
    console.error(`${colors.red}Please remove these secrets before deploying to production.${colors.reset}\n`);
    process.exit(EXIT_CODES.SECRETS_FOUND);
  }
  
  if (findings.length > 0) {
    console.log(`${colors.yellow}Warning: Low/medium severity findings detected. Review before deploying.${colors.reset}\n`);
  }
  
  process.exit(EXIT_CODES.SUCCESS);
}

// Run the script
main();