/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string, maxLength: number = 500): string {
  if (!input) return '';
  
  // Trim whitespace
  let sanitized = input.trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  // Remove dangerous HTML tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^<]*>/gi, '');
  
  // Remove SQL injection attempts
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--|\*\/|\/\*)/g,
    /('|(\\')|(;)|(\bOR\b)|(\bAND\b))/gi
  ];
  
  for (const pattern of sqlPatterns) {
    if (pattern.test(sanitized)) {
      // If SQL injection detected, heavily sanitize
      sanitized = sanitized.replace(/[^\w\s.@,\-$]/g, '');
      break;
    }
  }
  
  // Remove dangerous characters but keep normal punctuation
  sanitized = sanitized.replace(/[<>]/g, '');
  
  return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate numeric input
 */
export function sanitizeNumeric(value: string | number): number {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : Math.max(0, num);
}

/**
 * Sanitize filename for safe downloads
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9_\-\.]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

/**
 * Check if input contains potential injection attempts
 */
export function containsInjection(input: string): boolean {
  const injectionPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onload=, etc.
    /\bSELECT\b.*\bFROM\b/i,
    /\bINSERT\b.*\bINTO\b/i,
    /\bUPDATE\b.*\bSET\b/i,
    /\bDELETE\b.*\bFROM\b/i,
    /\bDROP\b.*\bTABLE\b/i,
    /(;|--|\*\/|\/\*)/
  ];
  
  return injectionPatterns.some(pattern => pattern.test(input));
}
