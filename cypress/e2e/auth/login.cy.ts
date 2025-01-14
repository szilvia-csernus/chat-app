// cypress/integration/login.spec.ts

describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login"); // Adjust the URL to match your login page route
  });


  it("should display social login buttons", () => {
    cy.get("button").contains("Log In with Google").should("be.visible");
    cy.get("button").contains("Log In with Github").should("be.visible");
    cy.get("button").contains("Log In with LinkedIn").should("be.visible");
  });

  it("should allow a user to log in with Google", () => {
    cy.intercept("POST", "http://localhost:3001/api/auth/signin/google?", {
      statusCode: 200,
      body: { redirectTo: "/profile" },
    }).as("googleLogin");

    cy.get("button").contains("Log In with Google").click();
    cy.wait("@googleLogin").its("response.statusCode").should("eq", 200);
  });

  it("should allow a user to log in with Github", () => {
    cy.intercept("POST", "http://localhost:3001/api/auth/signin/github?", {
      statusCode: 200,
      body: { redirectTo: "/profile" },
    }).as("githubLogin");

    cy.get("button").contains("Log In with Github").click();
    cy.wait("@githubLogin").its("response.statusCode").should("eq", 200);
  });

  it("should allow a user to log in with LinkedIn", () => {
    cy.intercept("POST", "http://localhost:3001/api/auth/signin/linkedin?", {
      statusCode: 200,
      body: { redirectTo: "/profile" },
    }).as("linkedinLogin");

    cy.get("button").contains("Log In with LinkedIn").click();
    cy.wait("@linkedinLogin").its("response.statusCode").should("eq", 200);
  });
});
