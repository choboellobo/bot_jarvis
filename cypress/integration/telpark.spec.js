
describe('Telpark', () => {
    it("Buy a ticker", async () => {
        await cy.viewport(1920, 1080)
        await cy.visit("https://www.telpark.com/")
        await cy.get("#menu-user li a").first().click({force: true})
        await cy.wait(2000);
        const email = await cy.get('#inputEmail')
        await email.type("choboellobo@gmail.com")
        // const password = await cy.get("#inputPassword")
        // await password.type("Portillo84")
        // await cy.get("input[type=submit]").click()
        // await cy.wait(2000)
    })
});