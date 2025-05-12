
/*/ o que vou testar? 
3.1 - Cadastre o gato "Bichento" 
3.2 - Cadastre a usuária "Hermione Granger" 
3.3 - Venda o "Bichento" para a "Hermione Granger" 
3.4 - Consulte o status do animal após a venda 
3.5 - Consulte a ordem de venda do animal 
/*/

import pet from '../fixtures/pet.json'
import user from '../fixtures/user.json'
import novostatus from '../fixtures/novostatus.json'
import venda from '../fixtures/venda.json'

describe('Teste de API - PetStore com Cypress', () => {
  
  it('POST gato Bichento', () => {
    cy.request({
      method: 'POST',
      url: '/pet',
      body: pet
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.name).to.eq('Bichento')
      expect(response.body.category.name).to.eq('gato')
      expect(response.body.status).to.eq('available')
    })
  })

  //Para cadastrar usuária é necessário fazer o login
  it('GET Login usuária Hermione, usuária deve estar logada', () => {
  cy.request({
    method: 'GET',
    url: '/user/login',
    qs: { 
      username: user.username, 
      password: user.password 
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    cy.wrap(response.body.token).as('authToken'); // Armazena o token
  });
});


    it('POST usuária "Hermione Granger', () => {
    cy.request({
      method: 'POST',
      url: '/user',
      body: user
    }).then((response) => {
      expect(response.status).to.eq(200)
    })

  })

  it('POST ordem de venda do Bichento', () => {
  cy.request({
      method: 'POST',
      url: '/store/order',
      body: venda
    }).then((response) => {
      expect(response.status).to.eq(200); 
    });
  });

  it('PUT Atualizar status do Bichento após venda', () => {
    cy.request({
      method: 'PUT',
      url: '/pet',
      body: novostatus
      }).then(({ status, body }) => { 
      expect(status).to.eq(200) 
      expect(body.id).to.eq(pet.id) 
      expect(body.name).to.eq(pet.name) 
      expect(body.category.id).to.eq(pet.category.id)
      expect(body.category.name).to.eq(pet.category.name) 
      expect(body.tags[0].id).to.eq(pet.tags[0].id)
      expect(body.tags[0].name).to.eq(pet.tags[0].name)
      expect(body.status).to.eq("vendido")

    })

  })

  it('GET consulta a ordem de venda', () => {
    cy.fixture('venda.json').then((venda) => {
    cy.request({
      method: 'GET',
      url: `/store/order/${venda.id}` 
    }).then((response) => {
      expect(response.status).to.eq(200); 
      expect(response.body).to.have.property('id', venda.id); 
      expect(response.body).to.have.property('status', venda.status); 
      cy.log(response.body); 
    });
  });
});
})
