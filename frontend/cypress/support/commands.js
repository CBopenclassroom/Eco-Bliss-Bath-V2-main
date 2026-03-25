/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("getToken", () => {
    cy.request({
        method: "POST",
        url: "http://localhost:8081/login",
        body: {
            "username": "test2@test.fr",
            "password": "testtest"
        },
        headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
        return response.body.token
    })

})

Cypress.Commands.add("login", (username, password) => {
    return cy.request({
        method: "POST",
        url: "http://localhost:8081/login",
        body: {
            "username": username,
            "password": password
        },
        failOnStatusCode: false,
        headers: { 'Content-Type': 'application/json' }
    })

})


Cypress.Commands.add("getCartList", (token) => {
    return cy.request({
        method: "GET",
        url: "http://localhost:8081/orders",
        headers: { 'Authorization': 'Bearer ' + token }
    }).then(resp => resp.body)
})

Cypress.Commands.add("emptyCart", () => {
    cy.getToken().then(token => {
        cy.getCartList(token).then(list => {
            if (list.orderLines.length > 0) {
                cy.log('passed')
                list.orderLines.forEach(item => {
                    cy.log(item)
                    cy.request({
                        method: 'DELETE',
                        url: `http://localhost:8081/orders/${item.id}/delete`,
                        headers: { 'Authorization': 'Bearer ' + token }
                    })
                })
            }
        })
    })
})

Cypress.Commands.add("addProduct", (product, quantity) => {
    cy.getToken().then(token => {
        return cy.request({
            method: "PUT",
            url: "http://localhost:8081/orders/add",
            body: {
                "product": product,
                "quantity": quantity
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
    })
})


Cypress.Commands.add("goProduct", () => {
    cy.visit("/#/products/5");

})

Cypress.Commands.add('getProduct', (id) => {
    cy.getToken().then(token => {
        return cy.request({
            method: "GET",
            url: "http://localhost:8081/products/" + id,
            headers: { 'Authorization': 'Bearer ' + token }
        })
    })
})