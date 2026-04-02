describe('test sur la connexion et la présence du bouton "mon panier" aprés la connexion', () => {
  it("Vérifie la présence du bouton 'mon panier' dans le menu de navigation depuis une page connecter", () => {
    cy.visit('http://localhost:4200/#/')
    cy.get('[data-cy="nav-link-login"]').should('be.visible').click()
    cy.get('[data-cy="login-input-username"]').should('be.visible').type("test2@test.fr")
    cy.get('[data-cy="login-input-password"]').should('be.visible').type("testtest")
    cy.get('[data-cy="login-submit"]').should('be.visible').click()
    cy.get('[data-cy="nav-link-cart"]').should('be.visible')
  })
})