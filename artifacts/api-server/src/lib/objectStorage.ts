import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { Storage, type File } from "@google-cloud/storage";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
const PROFILE_BANNER_MAX_BYTES = 2 * 1024 * 1024;

const storage = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
  }
}

const parseObjectPath = (path: string) => {
  const parts = `/${path}`.replace(/^\/+/, "/").split("/");
  if (parts.length < 3) throw new Error("Invalid object path");
  return {
    bucketName: parts[1],
    objectName: parts.slice(2).join("/"),
  };
};

const signObjectUrl = async (
  bucketName: string,
  objectName: string,
): Promise<string> => {
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bucket_name: bucketName,
        object_name: objectName,
        method: "PUT",
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      }),
      signal: AbortSignal.timeout(30_000),
    },
  );
  if (!response.ok) throw new Error(`Failed to sign object URL (${response.status})`);
  const body = (await response.json()) as { signed_url?: string };
  if (!body.signed_url) throw new Error("Object URL response was missing signed_url");
  return body.signed_url;
};

export class ObjectStorageService {
  private getPrivateObjectDir(): string {
    const directory = process.env.PRIVATE_OBJECT_DIR;
    if (!directory) throw new Error("PRIVATE_OBJECT_DIR is not configured");
    return directory.replace(/\/+$/, "");
  }

  async createUpload(userId: string): Promise<{ uploadURL: string; objectPath: string }> {
    const objectId = randomUUID();
    const relativePath = `profile-banners/${userId}/${objectId}`;
    const fullPath = `${this.getPrivateObjectDir()}/${relativePath}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    return {
      uploadURL: await signObjectUrl(bucketName, objectName),
      objectPath: `/objects/${relativePath}`,
    };
  }

  async getFile(objectPath: string, userId: string): Promise<File> {
    if (!objectPath.startsWith(`/objects/profile-banners/${userId}/`)) {
      throw new ObjectNotFoundError();
    }
    const relativePath = objectPath.slice("/objects/".length);
    const { bucketName, objectName } = parseObjectPath(
      `${this.getPrivateObjectDir()}/${relativePath}`,
    );
    const file = storage.bucket(bucketName).file(objectName);
    const [exists] = await file.exists();
    if (!exists) throw new ObjectNotFoundError();
    return file;
  }

  async validateProfileBanner(objectPath: string, userId: string): Promise<void> {
    const file = await this.getFile(objectPath, userId);
    const [metadata] = await file.getMetadata();
    const size = Number(metadata.size ?? 0);
    if (
      !metadata.contentType?.startsWith("image/") ||
      !Number.isFinite(size) ||
      size <= 0 ||
      size > PROFILE_BANNER_MAX_BYTES
    ) {
      throw new Error("Uploaded object is not a valid profile banner");
    }

    const [header] = await file.download({ start: 0, end: 15 });
    const isPng = header.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
    const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    const isGif = header.subarray(0, 6).toString("ascii") === "GIF87a" ||
      header.subarray(0, 6).toString("ascii") === "GIF89a";
    const isWebp = header.subarray(0, 4).toString("ascii") === "RIFF" &&
      header.subarray(8, 12).toString("ascii") === "WEBP";
    if (!isPng && !isJpeg && !isGif && !isWebp) {
      throw new Error("Uploaded object contents are not a supported image");
    }
  }

  async stream(file: File): Promise<Response> {
    const [metadata] = await file.getMetadata();
    const body = Readable.toWeb(file.createReadStream()) as ReadableStream;
    const headers: Record<string, string> = {
      "Content-Type": metadata.contentType || "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    };
    if (metadata.size) headers["Content-Length"] = String(metadata.size);
    return new Response(body, { headers });
  }
}