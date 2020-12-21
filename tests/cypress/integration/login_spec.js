describe('Login', () => {
    it('works', () => {
        cy.visit('/');

        enterValidUsername();
        enterValidPassword();
        submit();

        showsUserIsLoggedIn();
    });
});

function enterValidUsername() {
    enterUsername(USERNAME);
}

function enterValidPassword() {
    enterPassword('test');
}

function enterUsername(username) {
    getByTestId('username-input').type(username);
}

function enterPassword(password) {
    getByTestId('password-input').type(password);
}

function submit() {
    getByTestId('login-form').submit();
}

function showsUserIsLoggedIn() {
    cy.contains(`Welcome, ${USERNAME}! It works!`);
}

const USERNAME = 'test';

function getByTestId(selector) {
    return cy.get('[data-testid="' + selector + '"]');
}