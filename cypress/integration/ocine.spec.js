
describe('Comprar entradas cine', () => {
    const { movie, time, quantity } = Cypress.env('data')
    function comprar3() {
        cy.get('input').each( (el, index) => {
            switch(index) {
                case 0: 
                cy.wrap(el).type("Eduardo")
                break;
                case 1: 
                cy.wrap(el).type("Muñoz")
                break;
                case 2: 
                cy.wrap(el).type("choboellobo@gmail.com")
                break;
                case 3: 
                cy.wrap(el).type("choboellobo@gmail.com")
                break;
                case 4: 
                cy.wrap(el).type("665887766")
                break;
                case 6: 
                el.click()
                break;
            }
        })
        cy.wait(1000);
        cy.get('button').each( (el, index) => {
            if(index === 1){
                el.click()
                cy.wait(2000)
            } 
            
        })
    } 
    function comprar2() {
        cy.get('a').each( (el, index) => {
            if( index === 0 ) {
                cy.wrap(el).click()
                cy.wait(1000)
                comprar3()
            }
        })
    }
    function comprar()  {
        cy.get('title').should('to.be', 'webtpv21')
        cy.get('button').each( (el, index) => {
            if( index === 1 ) {
                el.click()
                cy.wait(1000)
                comprar2()
            }
        })
    }
    function cogerSitio() {
        cy.get('title').should('to.be', 'Distribución de la sala')
        let count = 0;
        cy.get('.botonnormal').each( (el, i) => {
            if( i < quantity) {
                cy.wrap(el).click()
                cy.wait(1000)
                count++
                if( quantity == count) {
                    cy.get('#compra input').click()
                    cy.wait(1000)
                    comprar()
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
                    elem.find('.horasessio:not(.bloqueix) a').each( (i, e) => {
                        if(e.innerText.trim() ===  time ) {
                           if( !click ) {
                            e.click()
                            cy.wait(2000)
                            cogerSitio()
                            click = true;
                           } 
                        } 
                    })
                }

            }
          
        })
    })
})