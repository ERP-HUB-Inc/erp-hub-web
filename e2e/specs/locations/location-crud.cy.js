import { routes } from "../../pages/routes";

const locationList = /\/locations\/?$/;
const locationById = /\/locations\/[^/]+$/;
const locationDelete = /\/locations\/archive\/[^/]+$/;

function searchLocation(name) {
  const alias = Cypress._.uniqueId("warehouseSearch");
  cy.intercept({ method: "GET", pathname: locationList }, request => {
    if (new URL(request.url).searchParams.get("search") === name) request.alias = alias;
  });
  cy.get('input[aria-label="Search warehouse locations"]')
    .clear({ scrollBehavior: "center" })
    .type(name, { parseSpecialCharSequences: false, scrollBehavior: "center" });
  return cy.wait(`@${alias}`).then(({ response }) => {
    expect(response.statusCode).to.equal(200);
    const location = response.body.data.find(row => row.name === name);
    expect(location, "test-created warehouse location returned by search").to.exist;
    return location;
  });
}

function openLocationActions(name) {
  cy.contains(".location-setting-name", name).closest("tr")
    .find(`button[aria-label="More actions for ${name}"]`).click({ scrollBehavior: "center" });
  cy.get(".ant-dropdown:visible").contains(".ant-dropdown-menu-item", "Edit location").click();
}

describe("Warehouse and location settings", () => {
  beforeEach(() => {
    cy.login();
    cy.intercept({ method: "POST", pathname: locationList }).as("createLocation");
    cy.intercept({ method: "PUT", pathname: locationById }).as("updateLocation");
    cy.intercept({ method: "DELETE", pathname: locationDelete }).as("deleteLocation");
    cy.visit(routes.locations);
    cy.contains("h1", "Warehouse & Bins Setup").should("be.visible");
  });

  it("creates, searches, refreshes, edits, and deletes its own location", () => {
    const name = `E2E Warehouse ${Date.now()} ${Cypress._.random(100000, 999999)}`;
    const code = `E${Date.now().toString().slice(-8)}`;
    const updatedAddress = "Updated by the warehouse browser test.";

    cy.contains("button", /^New Location$/).click();
    cy.get(".ant-modal:visible").find("#location-name").type(name, { parseSpecialCharSequences: false });
    cy.get(".ant-modal:visible").find("#location-code").type(code);
    cy.get(".ant-modal:visible").find("#location-address").type("Created by the warehouse browser test.");
    cy.get(".ant-modal:visible").contains("button", /^Create Location$/).click();

    cy.wait("@createLocation").then(({ request, response }) => {
      expect(request.body).to.include({ name, code, isDefault: 0, isSystem: 0 });
      expect(request.body).not.to.have.property("id");
      expect(response.statusCode).to.be.within(200, 299);
      expect(response.body.data).to.include({ name, code });
      expect(response.body.data.id).to.exist;
    });

    searchLocation(name).then(location => {
      const locationId = String(location.id);
      expect(location).to.include({ name, code, status: 1 });
      cy.contains(".location-setting-name", name).should("be.visible");

      const refreshAlias = Cypress._.uniqueId("refreshWarehouse");
      cy.intercept({ method: "GET", pathname: locationList }, request => {
        if (new URL(request.url).searchParams.get("search") === name) request.alias = refreshAlias;
      });
      cy.get('button[aria-label="Refresh warehouse locations"]').click();
      cy.wait(`@${refreshAlias}`).then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        expect(response.body.data.some(row => String(row.id) === locationId)).to.equal(true);
      });

      openLocationActions(name);
      cy.get(".ant-modal:visible").find("#location-address").clear().type(updatedAddress);
      cy.get(".ant-modal:visible").find("#location-status").click();
      cy.get(".ant-select-dropdown:visible").contains(".ant-select-dropdown-menu-item", "Inactive").click();
      cy.get(".ant-modal:visible").contains("button", /^Save Changes$/).click();

      cy.wait("@updateLocation").then(({ request, response }) => {
        expect(decodeURIComponent(new URL(request.url).pathname.split("/").pop())).to.equal(locationId);
        expect(request.body).to.include({ name, code, address: updatedAddress, status: 0 });
        expect(request.body).not.to.have.property("id");
        expect(response.statusCode).to.be.within(200, 299);
        // LocationController may return no row when the repository reports zero
        // changed rows. The Settings page confirms the saved record via GET detail.
        const updatedRecord = response.body && response.body.data;
        if (updatedRecord) expect(String(updatedRecord.id)).to.equal(locationId);
      });
      cy.get(".ant-modal:visible").should("not.exist");
      cy.contains("Location updated.").should("be.visible");

      searchLocation(name).then(updated => {
        expect(updated).to.include({ id: location.id, name, code, address: updatedAddress, status: 0 });
      });

      cy.contains(".location-setting-name", name).closest("tr")
        .find(`button[aria-label="More actions for ${name}"]`).click({ scrollBehavior: "center" });
      cy.get(".ant-dropdown:visible").contains(".ant-dropdown-menu-item", "Delete location").click();
      cy.get(".ant-modal:visible").should("contain.text", name).contains("button", /^Delete$/).click();
      cy.wait("@deleteLocation").then(({ request, response }) => {
        expect(decodeURIComponent(new URL(request.url).pathname.split("/").pop())).to.equal(locationId);
        expect(response.statusCode).to.be.within(200, 299);
      });
      cy.reload();
      cy.get('input[aria-label="Search warehouse locations"]').type(name, { parseSpecialCharSequences: false });
      cy.get(".ant-table-placeholder").should("contain.text", "No locations found");
    });
  });
});
