declare namespace Cypress {
  interface Chainable {
    login(): Chainable<string>
    getCartList(token:string):Chainable<any[]>
    emptyCart(): Chainable<void>
  }
}