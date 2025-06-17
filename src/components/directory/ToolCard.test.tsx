import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToolCard } from './ToolCard';
import { BrowserRouter } from 'react-router-dom';
import type { Tool } from '../../types/Tool';

// Mock tool data
const mockTool: Tool = {
  id: '1',
  name: 'Test Tool',
  slug: 'test-tool',
  description: 'A test description',
  shortDescription: 'A short test description',
  website: 'https://testtool.com',
  categoryId: 'testing-category',
  subcategoryIds: ['unit-testing', 'automation'],
  rating: 4.5,
  reviewCount: 100,
  features: ['Feature 1', 'Feature 2'],
  limitations: ['Limitation 1'],
  pricing: {
    type: 'freemium',
    startingPrice: '$0',
    hasFreeOption: true,
    tiers: [
      {
        name: 'Free',
        price: '$0',
        billingPeriod: 'monthly',
        features: ['Basic features']
      }
    ]
  }
};

// Full mock tool for testing all properties
const fullMockTool: Tool = {
  ...mockTool,
  trending: true,
  featured: true,
  integrations: ['Integration 1', 'Integration 2'],
  lastVerified: new Date('2025-04-06'),
  technicalSpecs: {
    platform: 'Web-based',
    deployment: 'Cloud'
  },
  supportOptions: {
    email: true,
    phone: false,
    chat: true,
    documentation: true,
    community: true
  },
  certifications: ['ISO 27001'],
  complianceStandards: ['GDPR', 'HIPAA']
};

// Minimal tool for testing required properties
const minimalTool: Tool = {
  id: '2',
  name: 'Minimal Tool',
  slug: 'minimal-tool',
  description: 'Basic description',
  shortDescription: 'Short description',
  website: 'https://minimal.com',
  categoryId: 'test',
  subcategoryIds: [],
  rating: 0,
  reviewCount: 0,
  features: [],
  limitations: [],
  pricing: {
    type: 'free',
    hasFreeOption: true
  }
};

describe('ToolCard', () => {
  const renderToolCard = (tool: Tool = mockTool) => {
    return render(
      <BrowserRouter>
        <ToolCard tool={tool} />
      </BrowserRouter>
    );
  };

  it('renders basic tool information correctly', () => {
    renderToolCard();

    expect(screen.getByText(mockTool.name)).toBeInTheDocument();
    expect(screen.getByText(mockTool.shortDescription)).toBeInTheDocument();
    // Logo test removed as logos are no longer displayed
  });

  it('displays rating and review count', () => {
    renderToolCard();

    expect(screen.getByText(mockTool.rating.toString())).toBeInTheDocument();
    expect(screen.getByText(`(${mockTool.reviewCount})`)).toBeInTheDocument();
  });

  it('displays pricing information', () => {
    renderToolCard();

    expect(screen.getByText(/freemium/i)).toBeInTheDocument();
    expect(screen.getByText(mockTool.pricing.startingPrice || '')).toBeInTheDocument();
  });

  it('displays featured and trending badges when applicable', () => {
    renderToolCard(fullMockTool);

    expect(screen.getByText(/featured/i)).toBeInTheDocument();
    expect(screen.getByText(/trending/i)).toBeInTheDocument();
  });

  it('handles minimal tool data gracefully', () => {
    renderToolCard(minimalTool);

    expect(screen.getByText(minimalTool.name)).toBeInTheDocument();
    expect(screen.getByText(minimalTool.shortDescription)).toBeInTheDocument();
    expect(screen.queryByText(/trending/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/featured/i)).not.toBeInTheDocument();
  });

  it('navigates to tool website when clicked', async () => {
    renderToolCard();
    const user = userEvent.setup();
    
    const card = screen.getByTestId('tool-card');
    await user.click(card);
    
    expect(screen.getByRole('link')).toHaveAttribute('href', `/tools/${mockTool.slug}`);
  });
});
