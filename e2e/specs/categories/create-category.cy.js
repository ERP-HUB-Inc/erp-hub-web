import { routes } from "../../pages/routes";

const categoryResource = /\/categories\/?$/;
const saveCategory = () => cy.contains("button", /^Save Category$/).click();

function findSavedCategory(category) {
  // Match only this search, rather than consuming a list request made on navigation.
  cy.intercept("GET", "**/categories?*", request => {
    const search = new URL(request.url).searchParams.get("search");
    if (search === category.name) request.alias = "findCategory";
  });
  // Top-aligned action scrolling puts this input underneath the fixed app header.
  cy.get('input[aria-label="Search categories"]').clear({ scrollBehavior: "center" });
  cy.get('input[aria-label="Search categories"]')
    .type(category.name, { parseSpecialCharSequences: false, scrollBehavior: "center" });
  cy.wait("@findCategory").then(({ response }) => {
    expect(response.statusCode).to.equal(200);
    expect(response.body.data).to.be.an("array");
    const saved = response.body.data.find(row => row.name === category.name);
    const { posColor, defaultMarginRule, ...details } = category;
    expect(saved, "category persisted in the backend list").to.include(details);
    if (posColor) expect(saved.posColor).to.include(posColor);
    if (defaultMarginRule) expect(saved.defaultMarginRule).to.include(defaultMarginRule);
  });
  cy.contains(".category-listing-name strong", category.name).should("be.visible");
}

describe("Create category", () => {
  beforeEach(() => {
    cy.login();
    cy.intercept({ method: "POST", pathname: categoryResource }).as("createCategory");
    cy.visit(routes.categories);
    cy.contains("button", /^New Category$/).click();
    cy.location("pathname").should("equal", routes.createCategory);
    cy.contains("h1", "Add New Category").should("be.visible");
  });

  it("requires a name before sending a create request", () => {
    let createRequests = 0;
    cy.intercept({ method: "POST", pathname: categoryResource }, () => { createRequests += 1; });

    saveCategory();

    cy.get("#name").closest(".ant-form-item").should("contain.text", "Enter a category name.");
    cy.location("pathname").should("equal", routes.createCategory);
    cy.then(() => expect(createRequests, "no create request for an invalid form").to.equal(0));
  });

  it("shows a duplicate-name field error, preserves details, and saves after correcting the name", () => {
    const name = `E2E Category ${Date.now()} ${Cypress._.random(100000, 999999)}`;
    cy.get("#name").type(name);
    saveCategory();
    cy.wait("@createCategory").its("response.statusCode").should("be.within", 200, 299);
    cy.location("pathname").should("equal", routes.categories);
    cy.contains("button", /^New Category$/).click();

    const description = "Preserve these notes after duplicate rejection.";
    cy.get("#name").type(name);
    cy.get("#description").type(description);
    saveCategory();

    cy.wait("@createCategory").then(({ response }) => {
      expect(response.statusCode).to.equal(409);
      expect(response.body.error).to.include({ code: "CATEGORY_NAME_EXISTS" });
    });
    cy.location("pathname").should("equal", routes.createCategory);
    cy.get("#name").should("have.value", name).closest(".ant-form-item")
      .should("have.descendants", ".has-error")
      .and("contain.text", "This category name is already in use.");
    cy.get("#description").should("have.value", description);
    cy.contains("button", /^Save Category$/).should("not.be.disabled")
      .and("not.have.class", "ant-btn-loading");

    const correctedName = `${name} corrected`;
    cy.get("#name").clear({ scrollBehavior: "center" });
    cy.get("#name").type(correctedName, { scrollBehavior: "center" });
    cy.get(".category-create-api-error").should("not.exist");
    cy.get("#name").closest(".ant-form-item").should("not.contain.text", "This category name is already in use.");
    saveCategory();
    cy.wait("@createCategory").then(({ request, response }) => {
      expect(request.body).to.include({ name: correctedName, description });
      expect(response.statusCode).to.be.within(200, 299);
    });
    cy.location("pathname").should("equal", routes.categories);
    cy.reload();
    findSavedCategory({ name: correctedName, description });
  });

  [false, true].forEach(withOptionalFields => {
    it(`saves ${withOptionalFields ? "optional details and explicit false feature status" : "a category with only its required name"} and persists after reload`, () => {
      const category = { name: `E2E Category ${Date.now()} ${Cypress._.random(100000, 999999)}` };
      cy.get("#name").type(category.name, { parseSpecialCharSequences: false });

      if (withOptionalFields) {
        Object.assign(category, {
          namekm: "ប្រភេទសាកល្បង",
          namebm: "",
          code: `E2E_${Date.now()}_${Cypress._.random(100000, 999999)}`,
          label: "E2E catalog",
          description: "Created by the category browser test.",
          isFeature: false,
          posColor: { name: "Blue", hex: "#2563EB" },
          posQuickAccessEnabled: true,
          defaultMarginRule: { type: "GROSS_MARGIN", value: 25 }
        });
        ["namekm", "code", "label", "description"].forEach(field => {
          cy.get(`#${field}`).type(category[field], { parseSpecialCharSequences: false });
        });
        cy.get('[aria-label="Feature Category"]').should("have.attr", "aria-checked", "false");
        cy.get("#defaultMarginValue").type("25", { scrollBehavior: "center" });
        cy.get('[aria-label="Select Blue #2563EB"]').click({ scrollBehavior: "center" });
        cy.get('[aria-label="Pin to Quick Ribbon"]').click({ scrollBehavior: "center" });
      }

      saveCategory();

      cy.wait("@createCategory").then(({ request, response }) => {
        expect(request.body).to.deep.include({
          namebm: "", parentId: null, status: 1, isDefault: false, isFeature: false,
          posColor: { name: "Green", hex: "#059669" }, posQuickAccessEnabled: false,
          ...category, image: "", isSystem: 0
        });
        ["posIcon", "displayMode", "displayPriority", "touchSoundProfileId", "defaultMarginValue"]
          .forEach(field => expect(request.body).not.to.have.property(field));
        if (!withOptionalFields) expect(request.body).not.to.have.property("defaultMarginRule");
        expect(response.statusCode).to.be.within(200, 299);
      });
      cy.location("pathname", { timeout: 30000 }).should("equal", routes.categories);
      cy.reload();
      findSavedCategory(category);
    });
  });
});
