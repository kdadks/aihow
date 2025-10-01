interface SearchResult {
  name: string;
  shortDescription: string;
  categoryName?: string;
  subcategoryName?: string;
  rating?: number;
  pricing?: {
    type: string;
    startingPrice?: string;
  };
  features?: string[];
}

interface AnswerTemplate {
  pattern: RegExp;
  generator: (query: string, results: SearchResult[]) => string;
}

/**
 * Generates an intelligent, context-aware answer based on search query and results
 * This simulates AI-like responses without using external APIs
 */
export const generateIntelligentAnswer = (
  query: string,
  searchResults: SearchResult[]
): string => {
  if (!query || searchResults.length === 0) {
    return '';
  }

  const lowerQuery = query.toLowerCase();
  const totalCount = searchResults.length;
  const topResults = searchResults.slice(0, 5);

  // Template-based answer generation
  const templates: AnswerTemplate[] = [
    // Looking for/searching for patterns
    {
      pattern: /(?:looking for|search(?:ing)? for|need|want|find|recommend)/i,
      generator: (q, results) => {
        const categories = [...new Set(searchResults.map(r => r.categoryName).filter(Boolean))];
        const toolNames = results.slice(0, 3).map(r => r.name);
        const avgRating = (searchResults.reduce((sum, r) => sum + (r.rating || 0), 0) / searchResults.length).toFixed(1);

        if (categories.length === 1) {
          return `Great news! We found ${totalCount} ${categories[0]} tools perfectly matched to "${q}". Top recommendations include ${toolNames.slice(0, 2).join(' and ')}, each offering unique features to boost your productivity. ${getFreeToolsHint(searchResults)} Click any tool below to compare features, pricing, and user reviews to find your ideal solution.`;
        }
        return `Perfect match! Your search for "${q}" returned ${totalCount} powerful AI tools across ${categories.length} categories including ${categories.slice(0, 2).join(', ')}. Leading options like ${toolNames.slice(0, 2).join(' and ')} can transform your workflow. ${getFreeToolsHint(searchResults)} Browse the results to discover the tool that best fits your needs and budget.`;
      }
    },
    // Best/top patterns
    {
      pattern: /(?:best|top|leading|popular|recommended)/i,
      generator: (q, results) => {
        const topRated = [...searchResults].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
        const names = topRated.map(r => r.name);
        const highestRating = topRated[0]?.rating || 0;

        return `Excellent choice researching the best options! Among ${totalCount} tools for "${q}", ${names.slice(0, 2).join(' and ')}${names.length > 2 ? `, and ${names[2]}` : ''} lead with ratings of ${highestRating}+ stars. ${getTopRatedFeatures(topRated[0])} ${getFreeToolsHint(searchResults)} Each tool below has been thoroughly reviewed by our community - compare features and pricing to make an informed decision.`;
      }
    },
    // Free/pricing patterns
    {
      pattern: /(?:free|pricing|cost|affordable|cheap|budget)/i,
      generator: (q, results) => {
        const freeTools = searchResults.filter(r => r.pricing?.type === 'free' || r.pricing?.type === 'freemium');
        const paidTools = searchResults.filter(r => r.pricing?.type === 'paid');

        if (freeTools.length > 0) {
          return `Budget-conscious choice! We found ${freeTools.length} excellent tools with free tiers for "${q}", including ${freeTools.slice(0, 2).map(r => r.name).join(' and ')}. Start using these powerful tools immediately at no cost. ${paidTools.length > 0 ? `When ready to scale, explore ${paidTools.length} premium options with advanced features and dedicated support.` : 'Test drive the features risk-free before committing.'} Compare pricing plans below to maximize value for your investment.`;
        }
        return `Smart to research pricing! For "${q}", we've compiled ${totalCount} tools with transparent pricing from leading providers like ${results.slice(0, 2).map(r => r.name).join(' and ')}. Check detailed pricing breakdowns below to find the best value that fits your budget and feature requirements.`;
      }
    },
    // How to/tutorial patterns
    {
      pattern: /(?:how to|how do|how can|tutorial|guide|learn)/i,
      generator: (q, results) => {
        const categories = [...new Set(searchResults.map(r => r.categoryName).filter(Boolean))];
        return `Great question! To ${q.replace(/^(how to|how do|how can)\s+/i, '')}, we recommend exploring ${totalCount} specialized ${categories[0] || 'AI'} tools designed exactly for this purpose. Tools like ${results.slice(0, 2).map(r => r.name).join(' and ')} make this task effortless. ${getUseCaseHint(results[0])} Click any tool to see step-by-step guides, tutorials, and real-world examples from our community.`;
      }
    },
    // Comparison patterns
    {
      pattern: /(?:vs|versus|compare|comparison|difference between|better than)/i,
      generator: (q, results) => {
        const categories = [...new Set(searchResults.map(r => r.categoryName).filter(Boolean))];
        return `Smart to compare before deciding! We found ${totalCount} ${categories[0] || 'AI'} tools relevant to "${q}". Top contenders include ${results.slice(0, 3).map(r => r.name).join(', ')} - each excels in different areas. Review detailed feature comparisons, pricing structures, and user ratings below. Our community forum also has in-depth discussions comparing these tools to help you choose the perfect fit for your specific use case.`;
      }
    },
    // Alternative patterns
    {
      pattern: /(?:alternative|replacement|instead of|similar to)/i,
      generator: (q, results) => {
        return `Looking to switch? Excellent timing! We've curated ${totalCount} powerful alternatives for "${q}". Popular choices like ${results.slice(0, 2).map(r => r.name).join(' and ')} offer similar or better features, often at more competitive prices. ${getFreeToolsHint(searchResults)} Compare features, integrations, and pricing below to find a seamless replacement that meets your exact requirements.`;
      }
    }
  ];

  // Try to match a template
  for (const template of templates) {
    if (template.pattern.test(lowerQuery)) {
      return template.generator(query, topResults);
    }
  }

  // Default answer based on result analysis
  return generateDefaultAnswer(query, searchResults);
};

/**
 * Generate a default answer when no specific pattern matches
 */
const generateDefaultAnswer = (query: string, results: SearchResult[]): string => {
  const categories = [...new Set(results.map(r => r.categoryName).filter(Boolean))];
  const toolCount = results.length;
  const topTools = results.slice(0, 3).map(r => r.name);
  const avgRating = (results.reduce((sum, r) => sum + (r.rating || 0), 0) / results.length).toFixed(1);

  if (categories.length === 1) {
    return `Perfect! Your search for "${query}" matched ${toolCount} high-quality ${categories[0]} tools. Industry leaders like ${topTools.slice(0, 2).join(' and ')} are ready to streamline your work. ${getFreeToolsHint(results)} Browse detailed comparisons below - including features, pricing, and verified user reviews - to discover the perfect tool for your specific needs.`;
  } else if (categories.length >= 5) {
    // Many categories - indicate broad search
    return `Comprehensive results! We found ${toolCount} powerful AI tools for "${query}" spanning ${categories.length} diverse categories including ${categories.slice(0, 3).join(', ')}. Top picks like ${topTools.slice(0, 2).join(' and ')} can revolutionize your workflow. ${getFreeToolsHint(results)} Each tool is rated ${avgRating}+ stars on average - explore the options below to find your ideal AI solution.`;
  } else if (categories.length > 1) {
    return `Excellent results! We found ${toolCount} specialized tools for "${query}" across ${categories.slice(0, 2).join(' and ')} categories. Featured solutions like ${topTools.slice(0, 2).join(' and ')} deliver proven results. ${getFreeToolsHint(results)} Compare features, watch demos, and read community reviews below to select the tool that perfectly matches your requirements and workflow.`;
  } else {
    return `Great match! Discovered ${toolCount} powerful AI tools for "${query}". Top recommendations include ${topTools.slice(0, 2).join(' and ')}, both trusted by thousands of users. ${getFreeToolsHint(results)} Dive into detailed comparisons, pricing breakdowns, and real user testimonials below to make an informed choice that accelerates your productivity.`;
  }
};

/**
 * Helper: Get hint about free tools availability
 */
const getFreeToolsHint = (results: SearchResult[]): string => {
  const freeCount = results.filter(r =>
    r.pricing?.type === 'free' || r.pricing?.type === 'freemium'
  ).length;

  if (freeCount > 0) {
    return `${freeCount} offer${freeCount === 1 ? 's' : ''} free tiers.`;
  }
  return '';
};

/**
 * Helper: Get features mention for top rated tool
 */
const getTopRatedFeatures = (tool: SearchResult): string => {
  if (tool.features && tool.features.length > 0) {
    return `${tool.name} stands out with features like ${tool.features[0].toLowerCase()}.`;
  }
  return `${tool.name} is highly rated by users.`;
};

/**
 * Helper: Get use case hint
 */
const getUseCaseHint = (tool: SearchResult): string => {
  if (tool.shortDescription) {
    return `These tools specialize in ${tool.shortDescription.toLowerCase()}.`;
  }
  return 'Review each tool\'s capabilities below.';
};

/**
 * Add typing effect delay for more natural feel
 */
export const simulateTypingDelay = (): Promise<void> => {
  // Simulate processing time (500-1500ms) for realistic feel
  const delay = 500 + Math.random() * 1000;
  return new Promise(resolve => setTimeout(resolve, delay));
};
