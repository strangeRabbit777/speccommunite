import data from '../../shared/testing/data';

const user = data.users[0];

const checkSignedOutSplashNavbarLinksRender = () => {
  cy.get('[data-cy="navigation-splash-login"]').should('be.visible');
  cy.get('[data-cy="navigation-splash-signin"]').should('be.visible');
};

const checkProductNavbarLinksRender = () => {
  cy.get('[data-cy="navigation-bar"]').should('be.visible');

  cy.get('[data-cy="navigation-composer"]').should('be.visible');

  cy.get('[data-cy="navigation-messages"]').should('be.visible');

  cy.get('[data-cy="navigation-notifications"]').should('be.visible');

  cy.get('[data-cy="navigation-explore"]').should('be.visible');

  cy.get('[data-cy="navigation-profile"]').should('be.visible');
};

const checkSignedOutNavbarRenders = () => {
  cy.get('[data-cy="navigation-bar"]').should('be.visible');

  cy.get('[data-cy="navigation-explore"]').should('be.visible');

  cy.get('[data-cy="navigation-login"]').should('be.visible');
};

describe('Navbar logged in', () => {
  beforeEach(() => {
    cy.auth(user.id).then(() => cy.visit('/explore'));
  });

  it('should render product navbar', () => {
    checkProductNavbarLinksRender();
  });

  it('should make sure all product navbar links work on each view', () => {
    cy.visit('/messages');
    checkProductNavbarLinksRender();

    cy.visit('/explore');
    checkProductNavbarLinksRender();

    cy.visit('/notifications');
    checkProductNavbarLinksRender();

    cy.visit(`/users/${user.username}`);
    checkProductNavbarLinksRender();

    cy.visit(`/spectrum`);
    checkProductNavbarLinksRender();

    cy.visit(`/spectrum/general`);
    checkProductNavbarLinksRender();
  });
});

describe('Navbar logged out', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render splash page navbar', () => {
    checkSignedOutSplashNavbarLinksRender();
  });

  it('should render product navbar', () => {
    cy.visit('/spectrum');
    checkSignedOutNavbarRenders();
  });
});
