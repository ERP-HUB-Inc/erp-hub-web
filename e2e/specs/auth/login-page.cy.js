import { loginPage } from "../../pages/login";
import { routes } from "../../pages/routes";

describe("Login page smoke", () => {
  beforeEach(() => cy.visit(routes.login));

  it("shows the store, username, password, and submit controls", () => {
    loginPage.assertReady();
  });

  it("validates required fields before allowing an empty login", () => {
    loginPage.store().clear();
    loginPage.username().clear();
    loginPage.password().clear();
    loginPage.submit();
    cy.get(".ant-form-item-control.has-error").should("have.length", 3);
    cy.location("pathname").should("equal", routes.login);
  });
});
