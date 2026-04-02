describe("les tests sur les requêtes de l'api", () => {
    beforeEach(() => {
        cy.emptyCart()
    })

    it("Vérifie que la récupération du panier d’un utilisateur non authentifié retourne une erreur 401", () => {
        cy.request({
            method: "GET",
            url: "http://localhost:8081/orders",
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.eq(401)
        })
    })

    it("vérifie que la récupération des données du panier renvoie les bonnes informations", () => {
        cy.addProduct(5, 1).then(productCart => {
            cy.getToken().then(token => {
                cy.getCartList(token).then(resp => {
                    const productInCart = resp.orderLines[0].product
                    const productAdded = productCart.body.orderLines[0].product
                    expect(productInCart.name).to.be.equal(productAdded.name)
                })
            })
        })
    })

    it('vérifie que la récupération des données du produit soit bien fonctionnelle', () => {
        cy.getProduct(5).then(response => {
            expect(response.status).to.eq(200)
            expect(response.body.name).to.be.equal("Poussière de lune")
        })
    })



    it("Vérfie que l'utilisateur ne peut pas se connecter avec des mauvaises informations ", () => {
        cy.login("test5@test.fr", "test1").then((response) => {
            expect(response.status).to.eq(401)
        })
    })

    it("Vérfie que l'utilisateur peut se connecter avec des bonnes informations", () => {
        cy.login("test2@test.fr", "testtest").then(resp => {
            expect(resp.status).to.eq(200)
        })
    })



    it("vérification de l'ajout d'un produit disponible au panier", () => {
        cy.addProduct(5, 1).then(response => {
            expect(response.status).to.eq(200)
            cy.getProduct(5).then(product => {
                const productAdded = response.body.orderLines[0].product
                const productGet = product.body.name
                expect(productAdded.name).to.be.equal(productGet)
            })


        })

    })



    it("vérification de l'ajout d'un produit en rupture de stock au panier", () => {
        cy.addProduct(3, 1).then(response => {
            expect(response.status).to.not.eq(200)
        })
    })


    it("vérification de l'ajout d'un avis", () => {
        cy.getToken().then(token => {
            cy.request({
                method: "POST",
                url: "http://localhost:8081/reviews",
                body: {
                    "title": "test",
                    "comment": "test2",
                    "rating": 5
                },
                failOnStatusCode: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => {
                expect(response.status).to.eq(200)
                expect(response.body.title).to.eq("test")
                expect(response.body.comment).to.eq("test2")
                expect(response.body.rating).to.eq(5)
            })
        })
    })
})
