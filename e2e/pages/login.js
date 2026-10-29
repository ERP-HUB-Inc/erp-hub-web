// Ant Design prefixes field IDs with the form name "signin" in src/layout/login.jsx.
export const loginPage = {
  store: () => cy.get("#signin_privateURL"),
  username: () => cy.get("#signin_userName"),
  password: () => cy.get("#signin_password"),
  assertReady() {
    this.store().should("be.visible");
    this.username().should("be.visible");
    this.password().should("be.visible").and("have.attr", "type", "password");
    cy.get('button[type="submit"]').should("be.visible").and("not.be.disabled");
  },
  fill({ store, username, password }) {
    this.store().clear({ log: false }).type(store, { log: false, parseSpecialCharSequences: false });
    this.username().clear({ log: false }).type(username, { log: false, parseSpecialCharSequences: false });
    this.password().clear({ log: false }).type(password, { log: false, parseSpecialCharSequences: false });
  },
  assertCredentialsEntered({ store, username, password }) {
    // Assert booleans so a failure does not print credential values.
    this.store().should(input => { expect(input.val() === store, "workspace entered").to.equal(true); });
    this.username().should(input => { expect(input.val() === username, "username entered").to.equal(true); });
    this.password().should(input => { expect(input.val() === password, "password entered").to.equal(true); });
  },
  submit(method = "click") {
    if (method === "enter") {
      this.password().type("{enter}", { log: false });
    } else {
      cy.get('button[type="submit"]').click();
    }
  }
};
