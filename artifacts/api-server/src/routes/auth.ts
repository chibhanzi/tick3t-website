import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, type User } from "@workspace/db";
import {
  CreateAccountBody,
  CreateAccountResponse,
  CreateSessionBody,
  CreateSessionResponse,
} from "@workspace/api-zod";
import { clearSessionCookie, setSessionCookie } from "../lib/auth";

const router: IRouter = Router();

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const hashPassword = (password: string, salt: string) =>
  scryptSync(password, salt, 64).toString("hex");

const publicUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  profilePicture: "",
  isOrganizer: user.role === "organizer",
  isAdmin: false,
  role: user.role,
  isVerified: true,
});

router.post("/auth/sign-up", async (req, res): Promise<void> => {
  const parsed = CreateAccountBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const email = normalizeEmail(parsed.data.email);
  if (!isEmail(email)) {
    res.status(400).json({ error: "A valid email is required" });
    return;
  }

  const salt = randomBytes(16).toString("hex");
  try {
    const [user] = await db
      .insert(usersTable)
      .values({
        id: randomUUID(),
        email,
        name: parsed.data.displayName.trim(),
        role: parsed.data.role,
        passwordHash: hashPassword(parsed.data.password, salt),
        passwordSalt: salt,
      })
      .returning();

    setSessionCookie(res, { userId: user.id, role: user.role });
    res.status(201).json(CreateAccountResponse.parse(publicUser(user)));
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      res.status(409).json({ error: "Email is already registered" });
      return;
    }
    throw error;
  }
});

router.post("/auth/sign-in", async (req, res): Promise<void> => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, normalizeEmail(parsed.data.email)));

  if (!user) {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }

  const supplied = Buffer.from(
    hashPassword(parsed.data.password, user.passwordSalt),
    "hex",
  );
  const expected = Buffer.from(user.passwordHash, "hex");
  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }

  setSessionCookie(res, { userId: user.id, role: user.role });
  res.json(CreateSessionResponse.parse(publicUser(user)));
});

router.delete("/auth/sign-out", (_req, res) => {
  clearSessionCookie(res);
  res.sendStatus(204);
});

export default router;