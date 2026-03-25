describe('la connexion est fonctionnel"', () => {
  it("Vérifie la présence du bouton 'ajouter au panier' dans la page d'un produit", () => {
    cy.visit('http://localhost:4200/#/')
    cy.contains('Connexion').click()
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr")
    cy.get('[data-cy="login-input-password"]').type("testtest")
    cy.contains('button', 'Se connecter').click()
    cy.contains('a', 'Mon panier')
  })
})
