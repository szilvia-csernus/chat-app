/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('loginEmail', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       loginEmail(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// // Define a custom command for logging in a user
// Cypress.Commands.add('loginEmail', (email, password) => {
//   cy.visit('/login-email');
//   cy.get('input[name="email"]').type(email);
//   cy.get('input[name="password"]').type(password);
//   cy.get('button[type="submit"]').click();
// });

// // Define a custom command for filling out the registration form
// Cypress.Commands.add('fillRegistrationForm', (name, email, password) => {
//   cy.get('input[name="name"]').type(name);
//   cy.get('input[name="email"]').type(email);
//   cy.get('input[name="password"]').type(password);
//   cy.get('button[type="submit"]').click();
// });

// // Define a custom command for filling out the profile form
// Cypress.Commands.add('fillProfileForm', (country, gender, dateOfBirth) => {
//   cy.get('input[name="country"]').type(country);
//   cy.get('select[name="gender"]').select(gender, { force: true });
//   cy.get('input[name="dateOfBirth"]').type(dateOfBirth);
//   cy.get('button[type="submit"]').click();
// });

// // Define a custom command for checking validation errors
// Cypress.Commands.add('checkValidationErrors', (errors) => {
//   errors.forEach((error) => {
//     cy.contains(error).should('be.visible');
//   });
// });

// declare global {
//   namespace Cypress {
//     interface Chainable {
//       loginEmail(email: string, password: string): Chainable<void>
//       fillRegistrationForm(
//         name: string,
//         email: string,
//         password: string
//       ): Chainable<void>
//       fillProfileForm(
//         country: string,
//         gender: string,
//         dateOfBirth: string
//       ): Chainable<void>
//       checkValidationErrors(errors: string[]): Chainable<void>
//     }
//   }
// }
