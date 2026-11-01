import { loginPage } from "../pages/login";
import { dashboardPage } from "../pages/dashboard";
import { routes } from "../pages/routes";
import { hasAuthSession } from "./auth-session";

Cypress.Commands.add("login", ({ expectedPath = routes.dashboard, submitWith = "click" } = {}) => {
  // Credentials stay out of Cypress configuration and command logs.
  return cy.task("getLoginCredentials", null, { log: false }).then(credentials => {
    cy.visit(routes.login);
    loginPage.assertReady();
    loginPage.fill(credentials);
    loginPage.assertCredentialsEntered(credentials);
    loginPage.submit(submitWith);
    cy.get("body").should($body => {
      const currentPath = window.location.pathname;
      const loginError = $body.find('.signin-error[role="alert"]').text().trim();
      expect(currentPath === expectedPath || Boolean(loginError), "login redirects or displays an error").to.equal(true);
    }).then($body => {
      const loginError = $body.find('.signin-error[role="alert"]').text().trim();
      if (loginError) throw new Error(`E2E login failed: ${loginError}`);
    });
    cy.location("pathname", { timeout: 30000 }).should("equal", expectedPath);
    cy.window({ log: false }).should(window => {
      expect(hasAuthSession(window), "valid access token saved in browser session").to.equal(true);
    });
    if (expectedPath === routes.dashboard) dashboardPage.assertLoaded();
  });
});
