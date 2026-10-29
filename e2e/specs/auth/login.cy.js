import { dashboardPage } from "../../pages/dashboard";
import { routes } from "../../pages/routes";
import { hasAuthSession } from "../../support/auth-session";

describe("Credentials to dashboard", () => {
  it("enters workspace, username, and password, submits, saves the session, and displays the dashboard", () => {
    cy.login();
  });

  it("submits entered credentials with Enter and displays the dashboard", () => {
    cy.login({ submitWith: "enter" });
  });

  it("keeps the authenticated dashboard available after a page refresh", () => {
    cy.login();
    cy.reload();
    dashboardPage.assertLoaded();
    cy.window({ log: false }).should(window => {
      expect(hasAuthSession(window), "access token survives refresh").to.equal(true);
    });
  });

  it("redirects an unauthenticated dashboard visit to the login form", () => {
    cy.visit(routes.dashboard);
    cy.location("pathname", { timeout: 30000 }).should("equal", routes.login);
    cy.get("#signin_password").should("be.visible");
    cy.window({ log: false }).should(window => {
      expect(hasAuthSession(window), "no authenticated session before login").to.equal(false);
    });
  });

});

describe("Authentication lifecycle — planned", () => {
  it("shows a useful error for invalid credentials without starting a session");
  it("restores the intended protected route after login");
  it("logs out and prevents access to protected pages");
  it("handles an expired session without exposing protected data");
});
