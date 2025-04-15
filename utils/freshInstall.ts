/**
 *
 * Do not remove the Prisma query that upserts the shop to `true`.
 *
 */
import prisma from "./prisma";

interface FreshInstallParams {
  shop: string;
}

/**
 * @async
 * @function freshInstall
 * @param {Object} params - The function parameters container.
 * @param {string} params.shop - The shop URL in the format '*.myshopify.com'.
 */
const freshInstall = async ({ shop }: FreshInstallParams) => {
  try {
    console.log("This is a fresh install, running onboarding functions");

    await prisma.stores.upsert({
      where: {
        shop: shop,
      },
      update: {
        shop: shop,
        isActive: true,
      },
      create: {
        shop: shop,
        isActive: true,
      },
    });

    //Other functions start here
  } catch (e) {
    const error = e as Error;
    console.error(
      `---> An error occured in freshInstall function: ${error.message}`,
      error
    );
  }
};

export default freshInstall;
