import { routes } from "../../pages/routes";

// Settings uses src/services/BrandService, whose endpoints are /brands and /brands/:id.
const brandResource = /\/brands\/?$/;
const createBrand = brandResource;
const archiveBrand = /\/brands\/[^/]+\/?$/;

function searchForBrand(name) {
  const alias = Cypress._.uniqueId("brandSearch");
  cy.intercept({ method: "GET", pathname: brandResource }, request => {
    if (new URL(request.url).searchParams.get("search") === name) request.alias = alias;
  });
  cy.get('input[aria-label="Search brands"]')
    .clear({ scrollBehavior: "center" })
    .type(name, { parseSpecialCharSequences: false, scrollBehavior: "center" });
  cy.wait(`@${alias}`).then(({ response }) => {
    expect(response.statusCode).to.equal(200);
    const brand = response.body.data.find(row => row.name === name);
    expect(brand, "test-created brand returned by search").to.exist;
    return brand;
  });
  return cy.contains(".brand-listing-name strong", name).closest("tr");
}

describe("Brand listing", () => {
  beforeEach(() => {
    cy.login();
    cy.intercept({ method: "POST", pathname: createBrand }).as("createBrand");
    cy.intercept({ method: "DELETE", pathname: archiveBrand }).as("archiveBrand");
    cy.visit(routes.brands);
    cy.contains("h1", "Brands").should("be.visible");
  });

  it("keeps an empty description blank, refreshes the list, and archives its test brand", () => {
    const name = `E2E Brand ${Date.now()} ${Cypress._.random(100000, 999999)}`;
    let createdId;

    cy.contains("button", /^New Brand$/).click();
    cy.location("pathname").should("equal", routes.createBrand);
    cy.contains("h1", "Add New Brand").should("be.visible");
    cy.contains(".ant-form-item", "Brand Name").find("input").type(name, { parseSpecialCharSequences: false });
    cy.get('textarea[placeholder="Optional brand description"]').should("have.value", "");
    cy.contains("button", /^Save Brand$/).click();

    cy.wait("@createBrand").then(({ request, response }) => {
      expect(request.body).to.include({ name, description: "", status: 1 });
      expect(response.statusCode).to.be.within(200, 299);
      expect(response.body.data.id).to.be.a("string").and.not.be.empty;
      createdId = response.body.data.id;
    });

    searchForBrand(name).then($row => {
      cy.wrap($row).find("td").eq(1).should("have.text", "");
    });

    cy.intercept({ method: "GET", pathname: brandResource }).as("refreshBrands");
    cy.get('button[aria-label="Refresh brands"]').click();
    cy.wait("@refreshBrands").its("response.statusCode").should("equal", 200);
    searchForBrand(name).then($row => {
      cy.wrap($row).find("td").eq(1).should("have.text", "");
    });

    cy.contains(".brand-listing-name strong", name).closest("tr")
      .find(`button[aria-label="More actions for ${name}"]`).click({ scrollBehavior: "center" });
    cy.get(".ant-dropdown:visible").contains(".ant-dropdown-menu-item", "Delete brand").click();
    cy.get(".ant-modal:visible").should("contain.text", `Delete "${name}"?`)
      .contains("button", /^Delete$/).click();
    cy.wait("@archiveBrand").then(({ request, response }) => {
      expect(decodeURIComponent(new URL(request.url).pathname.split("/").pop())).to.equal(createdId);
      expect(response.statusCode).to.be.within(200, 299);
    });
    cy.contains("Brand deleted successfully.").should("be.visible");
  });
});
