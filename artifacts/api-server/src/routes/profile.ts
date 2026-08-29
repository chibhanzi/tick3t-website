import { Router, type IRouter } from "express";
import { and, eq, sql } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import {
  GetProfileBannerResponse,
  UpdateProfileBannerBody,
  UpdateProfileBannerResponse,
} from "@workspace/api-zod";
import { requireAuthenticated } from "../lib/auth";
import {
  ObjectNotFoundError,
  ObjectStorageService,
} from "../lib/objectStorage";

const router: IRouter = Router();
const objectStorage = new ObjectStorageService();

router.get("/profile/banner", async (req, res): Promise<void> => {
  const identity = requireAuthenticated(req, res);
  if (!identity) return;

  const [profile] = await db
    .select({
      bannerPath: usersTable.bannerPath,
      revision: usersTable.bannerRevision,
    })
    .from(usersTable)
    .where(eq(usersTable.id, identity.userId));

  res.json(
    GetProfileBannerResponse.parse({
      bannerPath: profile?.bannerPath ?? null,
      revision: profile?.revision ?? 0,
    }),
  );
});

router.patch("/profile/banner", async (req, res): Promise<void> => {
  const identity = requireAuthenticated(req, res);
  if (!identity) return;
  const parsed = UpdateProfileBannerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid profile banner" });
    return;
  }

  try {
    if (parsed.data.bannerPath) {
      await objectStorage.validateProfileBanner(
        parsed.data.bannerPath,
        identity.userId,
      );
    }
    const condition = parsed.data.expectedRevision === undefined
      ? eq(usersTable.id, identity.userId)
      : and(
          eq(usersTable.id, identity.userId),
          eq(usersTable.bannerRevision, parsed.data.expectedRevision),
        );
    const [profile] = await db
      .update(usersTable)
      .set({
        bannerPath: parsed.data.bannerPath,
        bannerRevision: sql`${usersTable.bannerRevision} + 1`,
      })
      .where(condition)
      .returning({
        bannerPath: usersTable.bannerPath,
        revision: usersTable.bannerRevision,
      });
    if (!profile) {
      res.status(409).json({ error: "Banner changed in another session" });
      return;
    }
    res.json(
      UpdateProfileBannerResponse.parse({
        bannerPath: profile.bannerPath,
        revision: profile.revision,
      }),
    );
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(400).json({ error: "Uploaded banner was not found" });
      return;
    }
    req.log.error({ err: error }, "Failed to update profile banner");
    res.status(400).json({ error: "Uploaded banner is invalid" });
  }
});

export default router;