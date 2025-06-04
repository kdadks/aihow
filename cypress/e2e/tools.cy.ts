describe('Tools Directory', () => {
  beforeEach(() => {
    cy.visit('/tools');
  });

  describe('Tool Listing', () => {
    it('displays tool cards with correct information', () => {
      cy.dataCy('tools-grid').should('exist');
      cy.dataCy('tool-card').should('have.length.gt', 0);

      // Check first tool card content
      cy.dataCy('tool-card').first().within(() => {
        cy.get('h3').should('exist');
        cy.get('img').should('exist');
        cy.contains(/free|paid|freemium/i).should('exist');
        cy.dataCy('rating').should('exist');
      });
    });

    it('shows loading state while fetching tools', () => {
      cy.visit('/tools');
      cy.dataCy('loading-skeleton').should('exist');
      cy.dataCy('tools-grid').should('exist');
      cy.dataCy('loading-skeleton').should('not.exist');
    });

    it('handles empty state gracefully', () => {
      // Apply filter that results in no tools
      cy.get('[type="search"]')
        .type('nonexistenttoolname{enter}');
      
      cy.contains(/no tools found/i).should('be.visible');
    });
  });

  describe('Tool Filtering', () => {
    it('filters tools by category', () => {
      cy.get('select[name="category"]').select('automation');
      
      cy.url().should('include', 'category=automation');
      cy.dataCy('tool-card')
        .should('have.length.gt', 0)
        .first()
        .contains(/automation/i)
        .should('exist');
    });

    it('filters tools by pricing type', () => {
      cy.get('select[name="price"]').select('free');
      
      cy.url().should('include', 'pricing=free');
      cy.dataCy('tool-card')
        .should('have.length.gt', 0)
        .each($card => {
          cy.wrap($card).contains(/free/i).should('exist');
        });
    });

    it('searches tools by name', () => {
      const searchTerm = 'test';
      cy.get('[type="search"]').type(`${searchTerm}{enter}`);
      
      cy.url().should('include', `search=${searchTerm}`);
      cy.dataCy('tool-card').each($card => {
        cy.wrap($card)
          .find('h3')
          .invoke('text')
          .should('match', new RegExp(searchTerm, 'i'));
      });
    });
  });

  describe('Tool Details Navigation', () => {
    it('navigates to tool details page when clicking a tool card', () => {
      cy.dataCy('tool-card')
        .first()
        .within(() => {
          cy.get('h3')
            .invoke('text')
            .then((toolName) => {
              cy.get('a').click();
              cy.url().should('include', '/tools/');
              cy.contains('h1', toolName).should('exist');
            });
        });
    });

    it('loads tool details correctly', () => {
      cy.dataCy('tool-card').first().click();
      
      // Check tool details page content
      cy.dataCy('tool-header').should('exist');
      cy.dataCy('tool-description').should('exist');
      cy.dataCy('tool-features').should('exist');
      cy.dataCy('tool-pricing').should('exist');

      // Check dynamic content loading
      cy.dataCy('tool-reviews').should('exist');
      cy.dataCy('related-tools').should('exist');
    });
  });

  describe('Tool Rating and Reviews', () => {
    it('displays correct rating information', () => {
      cy.dataCy('tool-card').first().within(() => {
        cy.dataCy('rating').should('exist');
        cy.dataCy('review-count').should('exist');
      });
    });

    it('shows reviews on tool details page', () => {
      cy.dataCy('tool-card').first().click();
      cy.dataCy('reviews-section').within(() => {
        cy.get('h2').contains(/reviews/i).should('exist');
        cy.dataCy('review-card').should('have.length.gt', 0);
      });
    });
  });
});
