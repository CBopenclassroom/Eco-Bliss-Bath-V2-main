describe('smoketests', () => {
  it('Vérifie la présence des champs et du bouton de connexion dans la page "se connecter"', () => {
    cy.visit('http://localhost:4200/#/')
    cy.get('[data-cy="nav-link-login"]').should('be.visible').click()
    cy.get('[data-cy="login-submit"]').should('be.visible')
    cy.get('[data-cy="login-input-username"]').should('be.visible')
    cy.get('[data-cy="login-input-password"]').should('be.visible')

  })


  it("Vérifie la présence du bouton 'ajouter au panier' dans la page d'un produit", () => {
    cy.visit('http://localhost:4200/#/')
    cy.get('[data-cy="nav-link-login"]').should('be.visible').click()
    cy.get('[data-cy="login-input-username"]').should('be.visible').type("test2@test.fr")
    cy.get('[data-cy="login-input-password"]').should('be.visible').type("testtest")
    cy.get('[data-cy="login-submit"]').should('be.visible').click()
    cy.goProduct()
    cy.get('[data-cy="detail-product-add"]').should('be.visible')
  })


  it("vérifie la protection contre une attaque XSS dans l'espace commentaires des avis", () => {

    cy.on('window:alert', () => {
      throw new Error('Faille XSS détectée : une alerte s’est déclenchée');
    });


    cy.visit('http://localhost:4200/#/')
    cy.get('[data-cy="nav-link-login"]').should('be.visible').click()
    cy.get('[data-cy="login-input-username"]').should('be.visible').type("test2@test.fr")
    cy.get('[data-cy="login-input-password"]').should('be.visible').type("testtest")
    cy.contains('button', 'Se connecter').click()

    cy.intercept('GET', '**/products/random*').as('waitRandomn')
    cy.wait("@waitRandomn")

    cy.visit('http://localhost:4200/#/reviews')
    cy.get('[data-cy="review-input-rating-images"]').find('img').first().should('be.visible').click()
    cy.get('[data-cy="review-input-title"]').should('be.visible').type('test')
    cy.get('[data-cy="review-input-comment"]').should('be.visible').type('<script>alert("XSS");</script>')
    cy.get('[data-cy="review-submit"]').should('be.visible').click()

    cy.reload();
  })
})