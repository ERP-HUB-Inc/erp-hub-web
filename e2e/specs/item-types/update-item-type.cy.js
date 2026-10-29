import { routes } from "../../pages/routes";

const itemTypeResource = /\/item-types\/?$/;
const itemTypeById = /\/item-types\/[^/]+$/;

function itemTypeRow(name) {
  return cy.contains(".item-type-name-heading strong", name).closest("tr");
}

function searchForItemType(name) {
  const alias = Cypress._.uniqueId("itemTypeSearch");
  cy.intercept({ method: "GET", pathname: itemTypeResource }, request => {
    if (new URL(request.url).searchParams.get("search") === name) request.alias = alias;
  });
  cy.get('input[aria-label="Search item types"]')
    .clear({ scrollBehavior: "center" })
    .type(name, { parseSpecialCharSequences: false, scrollBehavior: "center" });
  return cy.wait(`@${alias}`).then(({ response }) => {
    expect(response.statusCode).to.equal(200);
    const itemType = response.body.data.find(row => row.name === name);
    expect(itemType, "run-owned item type returned by search").to.exist;
    return itemType;
  });
}

function openItemTypeActions(name) {
  itemTypeRow(name).find(`button[aria-label="More actions for ${name}"]`).click({ scrollBehavior: "center" });
  cy.get(".ant-dropdown:visible").contains(".ant-dropdown-menu-item", "Edit item type").click();
}

describe("Update Item Type", () => {
  beforeEach(() => {
    cy.login();
    cy.intercept({ method: "POST", pathname: itemTypeResource }).as("createItemType");
    cy.intercept({ method: "GET", pathname: itemTypeById }).as("getItemType");
    cy.intercept({ method: "PUT", pathname: itemTypeById }).as("updateItemType");
    cy.intercept({ method: "DELETE", pathname: itemTypeById }).as("deleteItemType");
    cy.visit(routes.itemTypes);
    cy.contains("h1", "Item Types").should("be.visible");
  });

  it("returns the persisted ID when saving an unchanged item type and keeps it after reload", () => {
    const name = `E2E Item Type ${Date.now()} ${Cypress._.random(100000, 999999)}`;
    const description = "Created by the Item Type browser test.";

    cy.contains("button", /^New Item Type$/).click();
    cy.get(".ant-modal:visible").contains(".ant-form-item", "Name").find("input")
      .type(name, { parseSpecialCharSequences: false });
    cy.get(".ant-modal:visible").contains(".ant-form-item", "Description").find("textarea").type(description);
    cy.get(".ant-modal:visible").contains("button", /^Create Item Type$/).click();

    cy.wait("@createItemType").then(({ response }) => {
      expect(response.statusCode).to.be.within(200, 299);
      expect(response.body.data).to.include({ name, description });
      expect(response.body.data.id).to.be.a("string").and.not.be.empty;
    });

    searchForItemType(name).then(itemType => {
      expect(itemType.description).to.equal(description);
      openItemTypeActions(name);

      cy.wait("@getItemType").then(({ request, response }) => {
        expect(decodeURIComponent(new URL(request.url).pathname.split("/").pop())).to.equal(itemType.id);
        expect(response.statusCode).to.equal(200);
        expect(response.body.data.id).to.equal(itemType.id);
      });

      // Leave every field unchanged to exercise the database's zero-changed-row response.
      cy.get(".ant-modal:visible").contains("button", /^Save Changes$/).click();
      cy.wait("@updateItemType").then(({ request, response }) => {
        expect(decodeURIComponent(new URL(request.url).pathname.split("/").pop())).to.equal(itemType.id);
        expect(request.body).to.include({
          name,
          description,
          enableInventoryTracking: true,
          isSellable: true,
          productOption: 0,
          sortOrder: 0,
          status: 1
        });
        expect(request.body).not.to.have.property("id");
        expect(request.body).not.to.have.property("clientId");
        expect(response.statusCode).to.be.within(200, 299);
        expect(response.body.data.id).to.equal(itemType.id);
      });

      cy.get(".ant-modal:visible").should("not.exist");
      cy.contains("Item type updated.").should("be.visible");
      cy.reload();
      searchForItemType(name).then(persisted => {
        expect(persisted).to.include({ id: itemType.id, name, description, status: 1 });
      });

      // This test created the unused record, so remove only that run-owned fixture.
      openItemTypeActions(name);
      cy.get(".ant-dropdown:visible").contains(".ant-dropdown-menu-item", "Delete item type").click();
      cy.get(".ant-modal:visible").should("contain.text", "Permanently delete item type?")
        .contains("button", /^Delete Permanently$/).click();
      cy.wait("@deleteItemType").then(({ request, response }) => {
        expect(decodeURIComponent(new URL(request.url).pathname.split("/").pop())).to.equal(itemType.id);
        expect(response.statusCode).to.be.within(200, 299);
        expect(response.body.affected).to.be.greaterThan(0);
      });
      cy.get(".ant-modal:visible").should("not.exist");
      cy.get('input[aria-label="Search item types"]').should("have.value", name);
      cy.contains(".item-type-name-heading strong", name).should("not.exist");
    });
  });
});
