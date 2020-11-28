function addTodo(item) {
    cy.get("#new-item").type(item + "{enter}");
}

function showsInTodoList(item) {
    cy.contains("#todos", item);
}

describe('The app', () => {
    it('adds a new item to the todo list', () => {
        cy.visit('/');
        addTodo("Build a todo app");
        showsInTodoList("Build a todo app");
    });
});