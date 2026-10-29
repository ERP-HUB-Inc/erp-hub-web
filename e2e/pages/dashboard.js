import { routes } from "./routes";

export const dashboardPage = {
  assertLoaded() {
    cy.location("pathname", { timeout: 30000 }).should("equal", routes.dashboard);
    cy.contains("main.business-dashboard h1", "Business Dashboard", { timeout: 30000 }).should("be.visible");
    cy.get("#signin_password").should("not.exist");
  }
};
