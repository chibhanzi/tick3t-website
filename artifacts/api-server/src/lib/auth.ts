import {
  createHmac,
  timingSafeEqual,
  type BinaryLike,
} from "node:crypto";
import type { Request, Response } from "express";

const COOKIE_NAME = "tick3t.session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is required");
}

export interface SessionIdentity {
  userId: string;
  role: "user" | "organizer";
}

interface SessionPayload extends SessionIdentity {
  expiresAt: number;
}

const sign = (value: BinaryLike) =>
  createHmac("sha256", sessionSecret).update(value).digest("base64url");

const parseCookies = (req: Request): Record<string, string> => {
  const raw = req.headers.cookie;
  if (!raw) return {};

  return Object.fromEntries(
    raw.split(";").flatMap((part) => {
      const separator = part.indexOf("=");
      if (separator < 0) return [];
      const key = part.slice(0, separator).trim();
      const value = part.slice(separator + 1).trim();
      return [[key, decodeURIComponent(value)]];
    }),
  );
};

const createSessionToken = (identity: SessionIdentity): string => {
  const payload: SessionPayload = {
    ...identity,
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
};

const verifySessionToken = (token: string): SessionIdentity | null => {
  const [encoded, suppliedSignature] = token.split(".");
  if (!encoded || !suppliedSignature) return null;

  const expectedSignature = sign(encoded);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as Partial<SessionPayload>;
    if (
      typeof payload.userId !== "string" ||
      (payload.role !== "user" && payload.role !== "organizer") ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
};

export const setSessionCookie = (
  res: Response,
  identity: SessionIdentity,
) => {
  res.cookie(COOKIE_NAME, createSessionToken(identity), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS * 1000,
    path: "/",
  });
};

export const clearSessionCookie = (res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
};

export const requireOrganizer = (
  req: Request,
  res: Response,
): SessionIdentity | null => {
  const token = parseCookies(req)[COOKIE_NAME];
  const identity = token ? verifySessionToken(token) : null;

  if (!identity) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
  if (identity.role !== "organizer") {
    res.status(403).json({ error: "Organiser access required" });
    return null;
  }

  return identity;
};