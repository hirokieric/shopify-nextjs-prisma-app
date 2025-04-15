import { Session } from "@shopify/shopify-api";
import { cookies } from "next/headers";
import cryption from "./cryption";
import prisma from "./prisma";

/**
 * Stores the session data into the database and sets the session cookie.
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

  const cookieStore = await cookies();
  cookieStore.set("shopify_session", session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return true;
};

/**
 * Loads the session data from the database using the session cookie.
 */
const loadSession = async (id?: string): Promise<Session | undefined> => {
  // If no id provided, try to get it from cookie
  if (!id) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("shopify_session");
    if (!sessionCookie) {
      return undefined;
    }
    id = sessionCookie.value;
  }

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
 * Deletes the session data from the database and removes the session cookie.
 */
const deleteSession = async (id: string): Promise<boolean> => {
  await prisma.session.deleteMany({ where: { id } });

  // Remove session cookie
  const cookieStore = await cookies();
  cookieStore.delete("shopify_session");

  return true;
};

/**
 * Session handler object containing storeSession, loadSession, and deleteSession functions.
 */
const sessionHandler = { storeSession, loadSession, deleteSession };

export default sessionHandler;
