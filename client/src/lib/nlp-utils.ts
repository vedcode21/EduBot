// Simple natural language processing utilities for matching inquiries to responses

export interface MatchResult {
  template: any;
  confidence: number;
  matchedKeywords: string[];
}

export function findBestMatch(message: string, templates: any[]): MatchResult | null {
  const lowercaseMessage = message.toLowerCase();
  let bestMatch: MatchResult | null = null;
  let highestScore = 0;

  for (const template of templates.filter(t => t.isActive)) {
    const matchedKeywords: string[] = [];
    let score = 0;
    
    // Check keywords
    for (const keyword of template.keywords || []) {
      if (lowercaseMessage.includes(keyword.toLowerCase())) {
        score += 3; // Higher weight for keyword matches
        matchedKeywords.push(keyword);
      }
    }
    
    // Check title words
    const titleWords = template.title.toLowerCase().split(' ');
    for (const word of titleWords) {
      if (word.length > 3 && lowercaseMessage.includes(word)) {
        score += 2;
      }
    }
    
    // Check content for partial matches
    const contentWords = template.content.toLowerCase().split(' ');
    for (const word of contentWords) {
      if (word.length > 4 && lowercaseMessage.includes(word)) {
        score += 1;
      }
    }
    
    // Calculate confidence based on score and message length
    const confidence = Math.min(score / Math.max(lowercaseMessage.split(' ').length, 1), 1);
    
    if (score > highestScore && confidence >= 0.3) { // Minimum confidence threshold
      highestScore = score;
      bestMatch = {
        template,
        confidence,
        matchedKeywords,
      };
    }
  }
  
  return bestMatch;
}

export function extractKeywords(text: string): string[] {
  // Simple keyword extraction - remove common words and short words
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'cannot', 'must',
    'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
    .slice(0, 10); // Return top 10 keywords
}

export function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size; // Jaccard similarity
}

export function categorizeInquiry(message: string, categories: any[]): string | null {
  const keywords = extractKeywords(message);
  
  // Simple categorization based on common patterns
  const techKeywords = ['login', 'password', 'access', 'portal', 'system', 'error', 'bug', 'technical'];
  const academicKeywords = ['grade', 'assignment', 'exam', 'test', 'homework', 'course', 'class'];
  const adminKeywords = ['schedule', 'registration', 'enrollment', 'fee', 'payment', 'deadline'];
  
  const hasKeywords = (categoryKeywords: string[]) => 
    keywords.some(keyword => categoryKeywords.includes(keyword));
  
  if (hasKeywords(techKeywords)) {
    return categories.find(c => c.name.toLowerCase().includes('technical'))?.id || null;
  }
  
  if (hasKeywords(academicKeywords)) {
    return categories.find(c => c.name.toLowerCase().includes('academic'))?.id || null;
  }
  
  if (hasKeywords(adminKeywords)) {
    return categories.find(c => c.name.toLowerCase().includes('admin'))?.id || null;
  }
  
  return categories.find(c => c.name.toLowerCase().includes('general'))?.id || null;
}
