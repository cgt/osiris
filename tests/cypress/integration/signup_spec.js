describe('Sign up', () => {
    it('works', () => {
        cy.visit('/');

        enterValidAndAvailableUsername();
        enterValidPassword();
        submit();

        showsUserIsRegistered();
    });
});

function enterValidAndAvailableUsername() {
    enterUsername(USERNAME);
}

function enterValidPassword() {
    enterPassword('test-password');
}

function enterUsername(username) {
    getByTestId('username-input').type(username);
}

function enterPassword(password) {
    getByTestId('password-input').type(password);
}

function submit() {
    getByTestId('sign-up-form').submit();
}

function showsUserIsRegistered() {
    cy.contains(`Welcome, ${USERNAME}!`);
}

const USERNAME = 'test-user';

function getByTestId(selector) {
    return cy.get('[data-testid="' + selector + '"]');
}