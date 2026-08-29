import { Readable } from "node:stream";
import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from "@workspace/api-zod";
import { requireAuthenticated } from "../lib/auth";
import {
  ObjectNotFoundError,
  ObjectStorageService,
} from "../lib/objectStorage";

const router: IRouter = Router();
const objectStorage = new ObjectStorageService();

router.post("/storage/uploads/request-url", async (req, res): Promise<void> => {
  const identity = requireAuthenticated(req, res);
  if (!identity) return;
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid profile banner upload" });
    return;
  }

  try {
    res.json(
      RequestUploadUrlResponse.parse(
        await objectStorage.createUpload(identity.userId),
      ),
    );
  } catch (error) {
    req.log.error({ err: error }, "Failed to create profile banner upload");
    res.status(500).json({ error: "Failed to create upload" });
  }
});

router.get("/storage/objects/*path", async (req, res): Promise<void> => {
  const identity = requireAuthenticated(req, res);
  if (!identity) return;
  const rawPath = req.params.path;
  const path = Array.isArray(rawPath) ? rawPath.join("/") : rawPath;

  try {
    const objectPath = `/objects/${path}`;
    const [profile] = await db
      .select({ bannerPath: usersTable.bannerPath })
      .from(usersTable)
      .where(eq(usersTable.id, identity.userId));
    if (profile?.bannerPath !== objectPath) {
      res.status(404).json({ error: "Banner not found" });
      return;
    }
    const response = await objectStorage.stream(
      await objectStorage.getFile(objectPath, identity.userId),
    );
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (!response.body) {
      res.end();
      return;
    }
    Readable.fromWeb(
      response.body as ReadableStream<Uint8Array>,
    ).pipe(res);
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Banner not found" });
      return;
    }
    req.log.error({ err: error }, "Failed to serve profile banner");
    res.status(500).json({ error: "Failed to serve banner" });
  }
});

export default router;