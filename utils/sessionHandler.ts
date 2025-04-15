import { Session } from "@shopify/shopify-api";
import cryption from "./cryption";
import prisma from "./prisma";

/**
 * Stores the session data into the database.
 */
const storeSession = async (session: Session): Promise<boolean> => {
  await prisma.session.upsert({
    where: { id: session.id },
    update: {
      content: cryption.encrypt(JSON.stringify(session)),
      shop: session.shop,
    },
    create: {
      id: session.id,
      content: cryption.encrypt(JSON.stringify(session)),
      shop: session.shop,
    },
  });

  return true;
};

/**
 * Loads the session data from the database.
 */
const loadSession = async (id: string): Promise<Session | undefined> => {
  const sessionResult = await prisma.session.findUnique({ where: { id } });

  if (!sessionResult || !sessionResult.content) {
    return undefined;
  }

  try {
    const sessionObj = JSON.parse(cryption.decrypt(sessionResult.content));
    return new Session(sessionObj);
  } catch (error) {
    console.error("Error parsing session:", error);
    return undefined;
  }
};

/**
 * Deletes the session data from the database.
 */
const deleteSession = async (id: string): Promise<boolean> => {
  await prisma.session.deleteMany({ where: { id } });

  return true;
};

/**
 * Session handler object containing storeSession, loadSession, and deleteSession functions.
 */
const sessionHandler = { storeSession, loadSession, deleteSession };

export default sessionHandler;
