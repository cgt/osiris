describe('The website', () => {
    it('loads', () => {
        cy.visit('http://localhost:8080');
        cy.contains('Connected to backend: It works!');
    });
});