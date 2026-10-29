import { routes } from "../../pages/routes";

function createCategory(name) {
  cy.visit(routes.createCategory);
  cy.get("#name").type(name, { parseSpecialCharSequences: false });
  cy.contains("button", /^Save Category$/).click({ scrollBehavior: "center" });
  return cy.wait("@createCategory").then(({ request, response }) => {
    expect(response.statusCode).to.be.within(200, 299);
    expect(response.body.data.id).to.be.a("string").and.not.be.empty;
    return cy.location("pathname").should("equal", routes.categories)
      .then(() => ({ request, category: response.body.data }));
  });
}

function searchCategoryResults(name) {
  const alias = Cypress._.uniqueId("categorySearch");
  cy.intercept({ method: "GET", pathname: /\/categories\/?$/, query: { search: name } }).as(alias);
  cy.get('input[aria-label="Search categories"]').clear({ scrollBehavior: "center" });
  cy.get('input[aria-label="Search categories"]').type(name, { scrollBehavior: "center", parseSpecialCharSequences: false });
  return cy.wait(`@${alias}`).then(({ response }) => {
    expect(response.statusCode).to.equal(200);
    return response.body.data;
  });
}

function searchCategory(name) {
  return searchCategoryResults(name).then(categories => {
    const category = categories.find(row => row.name === name);
    expect(category, "run-owned category returned by search").to.exist;
    return category;
  });
}

function expectCategoryDeleted(name, id) {
  return searchCategoryResults(name).then(categories => {
    expect(categories.some(category => category.id === id), "deleted category absent from search results").to.equal(false);
    cy.get(".category-listing-table-card tbody tr").should(rows => {
      const categoryIsListed = Array.from(rows).some(row =>
        row.querySelector(".category-listing-name strong")?.textContent.trim() === name
      );
      expect(categoryIsListed, "deleted category absent from the rendered table").to.equal(false);
    });
  });
}

const categoryRow = name => cy.contains(".category-listing-name strong", name).closest("tr");
const dialog = () => cy.get(".ant-modal:visible").should("contain.text", "Delete category?");
const openDelete = name => {
  categoryRow(name).find(`button[aria-label="More actions for ${name}"]`).click({ scrollBehavior: "center" });
  cy.get(".ant-dropdown:visible").contains(".ant-dropdown-menu-item", /^Delete category$/).click();
  dialog().should("contain.text", name);
};
const confirmDelete = () => dialog().contains("button", /^Delete category$/).click();

function deleteCategory(name, id) {
  openDelete(name);
  confirmDelete();
  cy.wait("@deleteCategory").then(({ request, response }) => {
    expect(decodeURIComponent(new URL(request.url).pathname.split("/").pop())).to.equal(id);
    expect(response.statusCode).to.be.within(200, 299);
    expect(response.body.data).to.deep.equal({ ids: [id], deleted: true });
  });
  cy.get(".ant-modal:visible").should("not.exist");
  expectCategoryDeleted(name, id);
}

describe("Delete category", () => {
  beforeEach(() => {
    cy.login();
    cy.intercept({ method: "POST", pathname: /\/categories\/?$/ }).as("createCategory");
    cy.intercept({ method: "DELETE", pathname: /\/categories\/[^/]+$/ }).as("deleteCategory");
  });

  it("cancels without deleting, then deletes the selected category and persists after reload", () => {
    const name = `E2E Delete ${Date.now()} ${Cypress._.random(100000, 999999)}`;
    createCategory(name).then(({ category }) => {
      searchCategory(name).its("status").should("equal", 1);
      openDelete(name);
      dialog().contains("button", /^Cancel$/).click();
      cy.get(".ant-modal:visible").should("not.exist");
      cy.get("@deleteCategory.all").should("have.length", 0);
      categoryRow(name).find(".category-listing-pill").should("contain.text", "Active");
      deleteCategory(name, category.id);
      cy.reload();
      expectCategoryDeleted(name, category.id);
    });
  });

  it("shows the real blocked-delete 409, keeps the parent active, then deletes child before parent", () => {
    const suffix = `${Date.now()} ${Cypress._.random(100000, 999999)}`;
    const parentName = `E2E Delete parent ${suffix}`;
    const childName = `E2E Delete child ${suffix}`;
    createCategory(parentName).then(({ request, category: parent }) => {
      // API setup avoids relying on the create form's first 50 parent options.
      // The action under test (delete) always goes through the real UI and API.
      const authorization = request.headers.authorization || request.headers.Authorization;
      expect(Boolean(authorization), "create request supplies test-session authorization").to.equal(true);
      cy.request({
        method: "POST", url: request.url, headers: { Authorization: authorization },
        body: { ...request.body, name: childName, code: "", parentId: parent.id },
        log: false, failOnStatusCode: false
      }).then(response => {
        expect(response.status, "child fixture created").to.be.within(200, 299);
        const child = response.body.data;
        expect(child.id).to.be.a("string").and.not.be.empty;
        searchCategory(parentName).its("status").should("equal", 1);
        openDelete(parentName);
        confirmDelete();
        cy.wait("@deleteCategory").then(({ response: rejection }) => {
          expect(rejection.statusCode).to.equal(409);
          expect(rejection.body.error.code).to.equal("CATEGORY_DELETE_BLOCKED");
          expect(rejection.body.error.details).to.include({ categoryId: parent.id, childCategoryCount: 1 });
          dialog().find(".category-delete-error").should("contain.text", rejection.body.error.message);
        });
        dialog().contains("button", /^Delete category$/).should("not.have.class", "ant-btn-loading");
        dialog().contains("button", /^Cancel$/).click();
        searchCategory(parentName).its("status").should("equal", 1);
        searchCategory(childName);
        deleteCategory(childName, child.id);
        searchCategory(parentName);
        deleteCategory(parentName, parent.id);
        cy.reload();
        expectCategoryDeleted(parentName, parent.id);
      });
    });
  });
});
