import { PrismaClient } from "@prisma/client";

// Create a global variable to store the PrismaClient instance
let prisma;

// Function to get or create PrismaClient instance
function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  }
  return prisma;
}

// Export the singleton instance
export const db = getPrismaClient();

// Graceful shutdown
process.on("beforeExit", async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
});

process.on("SIGTERM", async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
});

process.on("SIGINT", async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
});
