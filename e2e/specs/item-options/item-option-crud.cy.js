import { routes } from "../../pages/routes";

const optionResource = /\/options\/?$/;
const optionById = /\/options\/[^/]+$/;

function searchForOption(name) {
  const alias = Cypress._.uniqueId("itemOptionSearch");
  cy.intercept({ method: "GET", pathname: optionResource }, request => {
    if (new URL(request.url).searchParams.get("search") === name) request.alias = alias;
  });
  cy.get('input[aria-label="Search Item Options"]')
    .clear({ scrollBehavior: "center" })
    .type(name, { parseSpecialCharSequences: false, scrollBehavior: "center" });
  return cy.wait(`@${alias}`).then(({ response }) => {
    expect(response.statusCode).to.equal(200);
    expect(response.body.data).to.be.an("array");
    const option = response.body.data.find(row => row.name === name);
    expect(option, "test-created Item Option returned by search").to.exist;
    return option;
  });
}

function openOptionActions(name) {
  cy.contains(".item-option-name", name).closest("tr")
    .find(`button[aria-label="More actions for ${name}"]`).click({ scrollBehavior: "center" });
  cy.get(".ant-dropdown:visible").contains(".ant-dropdown-menu-item", "Edit Item Option").click();
}

describe("Item Option settings", () => {
  beforeEach(() => {
    cy.login();
    cy.intercept({ method: "POST", pathname: optionResource }).as("createOption");
    cy.intercept({ method: "PUT", pathname: optionById }).as("updateOption");
    cy.intercept({ method: "DELETE", pathname: optionById }).as("deleteOption");
    cy.visit(routes.options);
    cy.contains("h1", "Item Option").should("be.visible");
  });

  it("creates, searches, refreshes, edits, and deletes only its own option", () => {
    const name = `E2E Option ${Date.now()} ${Cypress._.random(100000, 999999)}`;
    const description = "Created by the Item Option browser test.";
    const updatedDescription = "Updated by the Item Option browser test.";

    cy.contains("button", /^New Item Option$/).click();
    cy.get(".ant-modal:visible").should("be.visible")
      .contains(".ant-form-item", "Name").find("input").type(name, { parseSpecialCharSequences: false });
    cy.get(".ant-modal:visible").contains(".ant-form-item", "Description").find("textarea").type(description);
    cy.get(".ant-modal:visible").contains("button", /^Create Item Option$/).click();

    cy.wait("@createOption").then(({ request, response }) => {
      expect(request.body).to.include({ name, description, status: 1 });
      expect(request.body).not.to.have.property("clientId");
      expect(response.statusCode).to.be.within(200, 299);
      expect(response.body.data).to.include({ name, description, status: 1 });
      expect(response.body.data.id).to.be.a("string").and.not.be.empty;
    });

    searchForOption(name).then(option => {
      const optionId = option.id;
      expect(option).to.include({ name, description, status: 1 });
      cy.contains(".item-option-name", name).should("be.visible");
      cy.contains(".item-option-name", name).closest("tr").find("td").eq(1).should("have.text", description);

      const sortAlias = Cypress._.uniqueId("sortItemOptions");
      cy.intercept({ method: "GET", pathname: optionResource }, request => {
        const params = new URL(request.url).searchParams;
        if (params.get("search") === name && params.get("sortField") === "name") request.alias = sortAlias;
      });
      cy.contains(".ant-table-thead th", "Name").click();
      cy.wait(`@${sortAlias}`).then(({ request, response }) => {
        const params = new URL(request.url).searchParams;
        expect(params.get("sortField")).to.equal("name");
        expect(params.get("sortOrder")).to.be.oneOf(["ASC", "DESC"]);
        expect(response.statusCode).to.equal(200);
      });

      const pageSizeAlias = Cypress._.uniqueId("pageSizeItemOptions");
      cy.intercept({ method: "GET", pathname: optionResource }, request => {
        const params = new URL(request.url).searchParams;
        if (params.get("search") === name && params.get("limit") === "50") request.alias = pageSizeAlias;
      });
      cy.get(".ant-pagination-options-size-changer").click();
      cy.get(".ant-select-dropdown:visible").contains(".ant-select-dropdown-menu-item", "50 / page").click();
      cy.wait(`@${pageSizeAlias}`).then(({ request, response }) => {
        const params = new URL(request.url).searchParams;
        expect(params.get("limit")).to.equal("50");
        expect(params.get("offset")).to.equal("0");
        expect(response.statusCode).to.equal(200);
      });

      // The current search remains active during refresh; verify it reloads the filtered data.
      const refreshAlias = Cypress._.uniqueId("refreshItemOptions");
      cy.intercept({ method: "GET", pathname: optionResource }, request => {
        if (new URL(request.url).searchParams.get("search") === name) request.alias = refreshAlias;
      });
      cy.get('button[aria-label="Refresh Item Options"]').click();
      cy.wait(`@${refreshAlias}`).then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        expect(response.body.data.some(row => row.id === optionId)).to.equal(true);
      });

      openOptionActions(name);
      cy.get(".ant-modal:visible").contains(".ant-form-item", "Description").find("textarea").clear().type(updatedDescription);
      cy.contains(".ant-form-item", "Status").find(".ant-select").click();
      cy.get(".ant-select-dropdown:visible").contains(".ant-select-dropdown-menu-item", "Inactive").click();
      cy.get(".ant-modal:visible").contains("button", /^Save Changes$/).click();

      cy.wait("@updateOption").then(({ request, response }) => {
        expect(decodeURIComponent(new URL(request.url).pathname.split("/").pop())).to.equal(optionId);
        expect(request.body).to.include({ name, description: updatedDescription, status: 0 });
        expect(request.body).not.to.have.property("id");
        expect(request.body).not.to.have.property("clientId");
        expect(response.statusCode).to.be.within(200, 299);
        // The API may return no updated row when MySQL reports zero changed rows.
        // The screen confirms the record through GET detail, and the list check below
        // verifies the persisted ID and edited values.
        const updatedRecord = response.body && response.body.data;
        if (updatedRecord) expect(updatedRecord.id).to.equal(optionId);
      });
      cy.contains("Item Option updated.").should("be.visible");

      searchForOption(name).then(updated => {
        expect(updated).to.include({ id: optionId, name, description: updatedDescription, status: 0 });
      });
      cy.contains(".item-option-name", name).closest("tr").should("contain.text", updatedDescription).and("contain.text", "Inactive");

      cy.contains(".item-option-name", name).closest("tr")
        .find(`button[aria-label="More actions for ${name}"]`).click({ scrollBehavior: "center" });
      cy.get(".ant-dropdown:visible").contains(".ant-dropdown-menu-item", "Delete Item Option").click();

      const afterDeleteAlias = Cypress._.uniqueId("itemOptionAfterDelete");
      cy.intercept({ method: "GET", pathname: optionResource }, request => {
        if (new URL(request.url).searchParams.get("search") === name) request.alias = afterDeleteAlias;
      });
      cy.get(".ant-modal:visible").should("contain.text", `Delete “${name}”?`)
        .contains("button", /^Delete$/).click();
      cy.wait("@deleteOption").then(({ request, response }) => {
        expect(decodeURIComponent(new URL(request.url).pathname.split("/").pop())).to.equal(optionId);
        expect(response.statusCode).to.be.within(200, 299);
        if (response.body.affected !== undefined) expect(response.body.affected).to.be.greaterThan(0);
      });
      cy.wait(`@${afterDeleteAlias}`).then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        expect(response.body.data.some(row => row.id === optionId)).to.equal(false);
      });
      cy.contains("Item Option deleted.").should("be.visible");
      cy.contains(".item-option-name", name).should("not.exist");
    });
  });
});
