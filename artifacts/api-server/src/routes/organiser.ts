import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, organizerProfilesTable } from "@workspace/db";
import {
  GetOrganiserProfileResponse,
  UpdateOrganiserProfileBody,
  UpdateOrganiserProfileResponse,
} from "@workspace/api-zod";
import { requireOrganizer } from "../lib/auth";

const router: IRouter = Router();

router.get("/organiser/profile", async (req, res): Promise<void> => {
  const identity = requireOrganizer(req, res);
  if (!identity) return;

  const [profile] = await db
    .select({
      bio: organizerProfilesTable.bio,
      instagram: organizerProfilesTable.instagram,
      twitter: organizerProfilesTable.twitter,
    })
    .from(organizerProfilesTable)
    .where(eq(organizerProfilesTable.userId, identity.userId));

  if (!profile) {
    res.status(404).json({ error: "Organiser profile not found" });
    return;
  }

  res.json(GetOrganiserProfileResponse.parse(profile));
});

router.patch("/organiser/profile", async (req, res): Promise<void> => {
  const identity = requireOrganizer(req, res);
  if (!identity) return;

  const parsed = UpdateOrganiserProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [profile] = await db
    .insert(organizerProfilesTable)
    .values({ userId: identity.userId, ...parsed.data })
    .onConflictDoUpdate({
      target: organizerProfilesTable.userId,
      set: { ...parsed.data, updatedAt: new Date() },
    })
    .returning({
      bio: organizerProfilesTable.bio,
      instagram: organizerProfilesTable.instagram,
      twitter: organizerProfilesTable.twitter,
    });

  res.json(UpdateOrganiserProfileResponse.parse(profile));
});

export default router;