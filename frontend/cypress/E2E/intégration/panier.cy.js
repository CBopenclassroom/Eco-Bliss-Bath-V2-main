

describe('test le panier"', () => {
    beforeEach(() => {
        cy.emptyCart()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.visit('http://localhost:4200/#/')
        cy.get('[data-cy="nav-link-login"]').should('be.visible').click()
        cy.get('[data-cy="login-input-username"]').should('be.visible').type("test2@test.fr")
        cy.get('[data-cy="login-input-password"]').should('be.visible').type("testtest")
        cy.contains('button', 'Se connecter').click()
        cy.intercept('GET', '**/products/*').as('getProductInfo')
        cy.intercept('GET', '**/orders*').as('getCartInfo')
        cy.intercept('GET', '**/products/random*').as('mainPageLoading')
    })

    it("vérification de l'ajout d'un produit aux panier avec un utilisateur connécter ", () => {
        cy.wait('@mainPageLoading')
        cy.goProduct()
        cy.wait('@getProductInfo')
        cy.url().as('postUrl');
        cy.get('[data-cy="detail-product-name"]').should("be.visible").invoke("text").as("productTitle")
        cy.get('[data-cy="detail-product-stock"]').should('be.visible').invoke("text").then((text) => {
            const stock = parseInt(text)
            cy.log(stock)
            expect(stock).to.be.greaterThan(1)
            cy.get('[data-cy="detail-product-add"]').should('be.visible').click()
            cy.wait('@getCartInfo')
            cy.get('[data-cy="cart-line-name"]').should('be.visible').invoke("text").as("cartProduct")
            cy.get("@productTitle").then(product => {
                cy.get("@cartProduct").then(cartProduct => {
                    expect(product).to.be.equal(cartProduct)
                })
            })

            cy.get('@postUrl').then(url => {
                cy.visit(url);
            })
            cy.wait('@getProductInfo')
            cy.get('[data-cy="detail-product-stock"]').should('not.have.text', ' en stock').should('be.visible').invoke('text').then((text) => {
                const newStock = parseInt(text)
                cy.log(newStock)
                expect(newStock).to.be.equal(stock-1)
            })
        })
    })


    it("vérification des limites lors de l'ajout d'un panier depuis un utilisateur connecté", () => {
        cy.wait('@mainPageLoading')
        cy.goProduct()
        cy.wait('@getProductInfo')
        cy.get('[data-cy="detail-product-quantity"]').should('be.visible').clear().type(-8)
        cy.get('[data-cy="detail-product-add"]').should('be.visible').click()

        cy.visit("http://localhost:4200/#/cart")
        cy.wait('@getCartInfo')
        cy.get('[data-cy="cart-line"]').should('not.exist')
        cy.goProduct()
        cy.wait('@getProductInfo')

        cy.get('[data-cy="detail-product-quantity"]').should('be.visible').clear().type(21)
        cy.get('[data-cy="detail-product-add"]').should('be.visible').click()
        cy.wait('@getCartInfo')
        cy.get('[data-cy="cart-line"]').should('not.exist')

        

    })

    it("vérification de l'ajout d'un produit via l'api depuis un utilisateur connecté", () => {
        cy.wait('@mainPageLoading')
        cy.goProduct()
        cy.wait('@getProductInfo')
        cy.get('[data-cy="detail-product-name"]').should("be.visible").invoke("text").as("productTitle")
        cy.get('[data-cy="detail-product-stock"]').should('not.have.text', ' en stock').should('be.visible').invoke("text").then((text) => {
            const stock = parseInt(text)
            expect(stock).to.be.greaterThan(1)
            cy.get('[data-cy="detail-product-add"]').should('be.visible').click()
        })
        cy.getToken().then(token => {
            cy.getCartList(token).then(list => {
                const productAdded = list.orderLines[0].product
                cy.get("@productTitle").then(productCart => {
                    expect(productAdded.name).to.be.equal(productCart)
                })
            })
        })
    })

})