
describe('Comprar entradas cine', () => {
    const { movie, time, quantity } = Cypress.env('data')
    async function comprar3() {
        await cy.get('input').each( (el, index) => {
            switch(index) {
                case 0: 
                await cy.wrap(el).type("Eduardo")
                break;
                case 1: 
                await cy.wrap(el).type("Muñoz")
                break;
                case 2: 
                await cy.wrap(el).type("choboellobo@gmail.com")
                break;
                case 3: 
                await cy.wrap(el).type("choboellobo@gmail.com")
                break;
                case 4: 
                await cy.wrap(el).type("665887766")
                break;
                case 6: 
                await el.click()
                break;
            }
        })
        await cy.wait(1000);
        cy.get('button').each( async (el, index) => {
            if(index === 1){
                await el.click()
                await cy.wait(2000)
            } 
            
        })
    } 
    async function comprar2() {
        await cy.get('a').each( async (el, index) => {
            if( index === 0 ) {
                await cy.wrap(el).click()
                await cy.wait(1000)
                await comprar3()
            }
        })
    }
    async function comprar()  {
        await cy.get('title').should('to.be', 'webtpv21')
        await cy.get('button').each( async (el, index) => {
            if( index === 1 ) {
                await el.click()
                await cy.wait(1000)
                await comprar2()
            }
        })
    }
    async function cogerSitio() {
        await cy.get('title').should('to.be', 'Distribución de la sala')
        let count = 0;
        await cy.get('.botonnormal').each( async (el, i) => {
            if( i < quantity) {
                await cy.wrap(el).click()
                await cy.wait(1000)
                count++
                if( quantity == count) {
                    await cy.get('#compra input').click()
                    await cy.wait(1000)
                    await comprar()
                }
            }
        })
    }
    it('Comprar entradas', () => {
        let click = false;
        cy.visit('https://www.ocinerioshopping.es/')
        cy.get('.pelis-grid .peli-item').each( (elem, index) => {
            
            if( elem.css('display') === 'block') {
                
                if( elem.find('.name').text() === movie ) {
                    elem.find('.horasessio:not(.bloqueix) a').each( async (i, e) => {
                        if(e.innerText.trim() ===  time ) {
                           if( !click ) {
                            click = true;
                            await e.click()
                            await cy.log("Click element")
                            await cy.wait(2000)
                            await cogerSitio()
                           } 
                        } 
                    })
                }

            }
          
        })
    })
})