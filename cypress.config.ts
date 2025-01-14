import { prisma } from "./src/prisma";
import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  e2e: {
    baseUrl: "http://localhost:3001",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      on("task", {
        
        async createUserWithoutCredentials({ email }) {
          try {
            const user = await prisma.user.create({
              data: {
                email,
              },
            });
            return user;
          } catch (error) {
            return null;
          }
        },
        async getUserByEmail(email) {
          try {
            const user = await prisma.user.findUnique({
              where: { email },
            });
            return user;
          } catch (error) {
            return null;
          }
        },

        async deleteTestUser(email) {
          try {
            await prisma.user.delete({
              where: { email },
            });
            return null;
          } catch (error) {
            return null;
          }
        },
      });
    },
  },
});
