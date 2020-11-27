describe('The website', () => {
    it('loads', () => {
        cy.visit('/');
        cy.contains('Connected to backend: It works!');
    });
});