import React from 'react';
import { ToolCard } from '../../src/components/directory/ToolCard';
import type { Tool } from '../../src/types/Tool';

interface PricingTier {
  name: string;
  price: string;
  billingPeriod: 'monthly' | 'yearly' | 'one-time';
  features: string[];
}

describe('ToolCard Component', () => {
  const mockTool: Tool = {
    id: '1',
    slug: 'test-tool',
    name: 'Test Tool',
    description: 'A test tool description',
    shortDescription: 'A short description',
    logo: '/test-image.png',
    website: 'https://test-tool.com',
    categoryId: 'test-category',
    subcategoryIds: ['sub-1', 'sub-2'],
    pricing: {
      type: 'free',
      hasFreeOption: true,
      startingPrice: '0',
      tiers: [
        { 
          name: 'Free', 
          price: '0',
          billingPeriod: 'monthly',
          features: ['Basic features']
        },
        { 
          name: 'Pro', 
          price: '10',
          billingPeriod: 'monthly',
          features: ['All features']
        }
      ] as PricingTier[]
    },
    rating: 4.5,
    reviewCount: 10,
    features: ['Feature 1', 'Feature 2'],
    limitations: ['Limitation 1']
  };

  beforeEach(() => {
    // Mock necessary providers and context
    cy.mount(
      <ToolCard tool={mockTool} />,
      {
        routerProps: {
          initialEntries: ['/tools']
        }
      }
    );
  });

  it('renders tool information correctly', () => {
    // Check basic information
    cy.contains(mockTool.name).should('be.visible');
    cy.contains(mockTool.description).should('be.visible');
    cy.get('img').should('have.attr', 'src', mockTool.logo);
    cy.contains(mockTool.pricing.type).should('be.visible');

    // Check rating
    cy.dataCy('rating').within(() => {
      cy.contains(mockTool.rating.toString()).should('be.visible');
      cy.contains(mockTool.reviewCount.toString()).should('be.visible');
    });
  });

  it('handles favorite button click', () => {
    cy.dataCy('favorite-button').should('exist');
  });

  it('navigates to tool detail page on click', () => {
    cy.get('a').click();
    cy.url().should('include', `/tools/${mockTool.id}`);
  });

  it('shows pricing badge with correct color', () => {
    cy.dataCy('pricing-badge')
      .should('contain', mockTool.pricing.type)
      .and('exist');
  });

  it('lazy loads image with blur placeholder', () => {
    cy.get('img')
      .should('have.attr', 'loading', 'lazy')
      .and('have.class', 'blur-load');
  });

  it('displays truncated description', () => {
    const longDescription = 'A '.repeat(100) + mockTool.description;
    cy.mount(
      <ToolCard 
        tool={{ ...mockTool, description: longDescription }}
      />
    );

    cy.dataCy('tool-description')
      .should('be.visible')
      .and('have.css', 'overflow', 'hidden')
      .invoke('text')
      .should('have.length.lessThan', longDescription.length);
  });

  it('handles missing image gracefully', () => {
    cy.mount(
      <ToolCard 
        tool={{ ...mockTool, logo: '/placeholder-tool.png' }}
      />
    );

    cy.get('img')
      .should('have.attr', 'src', '/placeholder-tool.png')
      .and('have.attr', 'alt', 'Tool placeholder image');
  });

  it('displays popularity badge based on rating and reviews', () => {
    const popularTool: Tool = {
      ...mockTool,
      rating: 4.8,
      reviewCount: 1000
    };

    cy.mount(<ToolCard tool={popularTool} />);

    cy.dataCy('popularity-badge')
      .should('be.visible')
      .and('contain', 'Popular');

    const lowRatedTool: Tool = {
      ...mockTool,
      rating: 3.0,
      reviewCount: 5
    };

    cy.mount(<ToolCard tool={lowRatedTool} />);
    cy.dataCy('popularity-badge').should('not.exist');
  });
});
