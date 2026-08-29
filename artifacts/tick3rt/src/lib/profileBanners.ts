import {
  getProfileBanner,
  requestUploadUrl,
  updateProfileBanner,
} from "@workspace/api-client-react";

export const PROFILE_BANNER_MAX_BYTES = 2 * 1024 * 1024;
export const PROFILE_BANNER_UPDATED_EVENT = "tick3t:profile-banner-updated";

const profileBannerKey = (userId: string) => `tick3t.profile-banner.${userId}`;
const profileBannerRevisionKey = (userId: string) =>
  `tick3t.profile-banner.revision.${userId}`;
const profileBannerPendingKey = (userId: string) =>
  `tick3t.profile-banner.pending.${userId}`;

interface PendingBannerChange {
  id: string;
  type: "replace" | "remove";
  expectedRevision: number;
}

const loadRevision = (userId: string): number => {
  const revision = Number(localStorage.getItem(profileBannerRevisionKey(userId)));
  return Number.isInteger(revision) && revision >= 0 ? revision : 0;
};

const saveRevision = (userId: string, revision: number) => {
  localStorage.setItem(profileBannerRevisionKey(userId), String(revision));
};

const loadPendingChange = (userId: string): PendingBannerChange | null => {
  try {
    const raw = localStorage.getItem(profileBannerPendingKey(userId));
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<PendingBannerChange>;
    if (
      typeof value.id !== "string" ||
      (value.type !== "replace" && value.type !== "remove") ||
      !Number.isInteger(value.expectedRevision) ||
      (value.expectedRevision ?? -1) < 0
    ) {
      return null;
    }
    return value as PendingBannerChange;
  } catch {
    return null;
  }
};

const savePendingChange = (userId: string, change: PendingBannerChange) => {
  localStorage.setItem(profileBannerPendingKey(userId), JSON.stringify(change));
};

const clearPendingChange = (userId: string, id: string) => {
  if (loadPendingChange(userId)?.id === id) {
    localStorage.removeItem(profileBannerPendingKey(userId));
  }
};

export const loadProfileBanner = (userId: string): string => {
  if (!userId) return "";
  try {
    return localStorage.getItem(profileBannerKey(userId)) ?? "";
  } catch {
    return "";
  }
};

export const saveProfileBanner = (userId: string, bannerUrl: string): boolean => {
  if (!userId) return false;

  try {
    if (bannerUrl) {
      localStorage.setItem(profileBannerKey(userId), bannerUrl);
    } else {
      localStorage.removeItem(profileBannerKey(userId));
    }

    window.dispatchEvent(
      new CustomEvent(PROFILE_BANNER_UPDATED_EVENT, {
        detail: { userId, bannerUrl },
      }),
    );
    return true;
  } catch {
    return false;
  }
};

const isLocalDataUrl = (value: string) => value.startsWith("data:image/");

const bannerServingUrl = (bannerPath: string) =>
  bannerPath.startsWith("/objects/")
    ? `/api/storage${bannerPath}`
    : bannerPath;

const dataUrlToFile = async (dataUrl: string): Promise<File> => {
  const blob = await fetch(dataUrl).then((response) => response.blob());
  const extension = blob.type.split("/")[1]?.replace(/\W/g, "") || "png";
  return new File([blob], `migrated-profile-banner.${extension}`, {
    type: blob.type,
  });
};

const uploadBannerFile = async (
  file: File,
  expectedRevision: number,
): Promise<{ bannerUrl: string; revision: number }> => {
  const { uploadURL, objectPath } = await requestUploadUrl({
    name: file.name,
    size: file.size,
    contentType: file.type,
  });
  const uploadResponse = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!uploadResponse.ok) {
    throw new Error("Profile banner upload failed");
  }
  const persisted = await updateProfileBanner({
    bannerPath: objectPath,
    expectedRevision,
  });
  if (!persisted.bannerPath) {
    throw new Error("Profile banner path was not persisted");
  }
  return {
    bannerUrl: bannerServingUrl(persisted.bannerPath),
    revision: persisted.revision,
  };
};

export const loadSyncedProfileBanner = async (
  userId: string,
): Promise<string> => {
  const cachedBanner = loadProfileBanner(userId);
  const pending = loadPendingChange(userId);

  if (pending) {
    try {
      if (pending.type === "remove") {
        const persisted = await updateProfileBanner({
          bannerPath: null,
          expectedRevision: pending.expectedRevision,
        });
        if (loadPendingChange(userId)?.id !== pending.id) {
          return loadProfileBanner(userId);
        }
        saveRevision(userId, persisted.revision);
        clearPendingChange(userId, pending.id);
        saveProfileBanner(userId, "");
        return "";
      }

      if (!isLocalDataUrl(cachedBanner)) return cachedBanner;
      const persisted = await uploadBannerFile(
        await dataUrlToFile(cachedBanner),
        pending.expectedRevision,
      );
      if (loadPendingChange(userId)?.id !== pending.id) {
        return loadProfileBanner(userId);
      }
      saveRevision(userId, persisted.revision);
      clearPendingChange(userId, pending.id);
      saveProfileBanner(userId, persisted.bannerUrl);
      return persisted.bannerUrl;
    } catch {
      // Keep the pending change and local view. Retrying with its captured
      // revision can never overwrite a newer change made in another session.
      return cachedBanner;
    }
  }

  try {
    const remote = await getProfileBanner();
    if (loadPendingChange(userId)) {
      return loadProfileBanner(userId);
    }
    saveRevision(userId, remote.revision);
    if (remote.bannerPath) {
      const remoteUrl = bannerServingUrl(remote.bannerPath);
      saveProfileBanner(userId, remoteUrl);
      return remoteUrl;
    }

    if (isLocalDataUrl(cachedBanner)) {
      const migration: PendingBannerChange = {
        id: crypto.randomUUID(),
        type: "replace",
        expectedRevision: remote.revision,
      };
      savePendingChange(userId, migration);
      const persisted = await uploadBannerFile(
        await dataUrlToFile(cachedBanner),
        remote.revision,
      );
      if (loadPendingChange(userId)?.id !== migration.id) {
        return loadProfileBanner(userId);
      }
      saveRevision(userId, persisted.revision);
      clearPendingChange(userId, migration.id);
      saveProfileBanner(userId, persisted.bannerUrl);
      return persisted.bannerUrl;
    }

    saveProfileBanner(userId, "");
    return "";
  } catch {
    if (loadPendingChange(userId)) {
      return loadProfileBanner(userId);
    }
    try {
      const current = await getProfileBanner();
      saveRevision(userId, current.revision);
      const currentUrl = current.bannerPath
        ? bannerServingUrl(current.bannerPath)
        : "";
      saveProfileBanner(userId, currentUrl);
      return currentUrl;
    } catch {
      return cachedBanner;
    }
  }
};

export const saveSyncedProfileBanner = async (
  userId: string,
  bannerUrl: string,
  file?: File,
): Promise<string> => {
  if (!saveProfileBanner(userId, bannerUrl)) {
    throw new Error("Profile banner could not be cached");
  }

  const change: PendingBannerChange = {
    id: crypto.randomUUID(),
    type: bannerUrl ? "replace" : "remove",
    expectedRevision: loadRevision(userId),
  };
  savePendingChange(userId, change);

  try {
    if (!bannerUrl) {
      const persisted = await updateProfileBanner({
        bannerPath: null,
        expectedRevision: change.expectedRevision,
      });
      if (loadPendingChange(userId)?.id !== change.id) {
        return loadProfileBanner(userId);
      }
      saveRevision(userId, persisted.revision);
      clearPendingChange(userId, change.id);
      saveProfileBanner(userId, "");
      return "";
    }

    const uploadFile = file ?? await dataUrlToFile(bannerUrl);
    const persisted = await uploadBannerFile(
      uploadFile,
      change.expectedRevision,
    );
    if (loadPendingChange(userId)?.id !== change.id) {
      return loadProfileBanner(userId);
    }
    saveRevision(userId, persisted.revision);
    clearPendingChange(userId, change.id);
    saveProfileBanner(userId, persisted.bannerUrl);
    return persisted.bannerUrl;
  } catch {
    // The outbox preserves the local intent and captured revision for retry.
    return bannerUrl;
  }
};