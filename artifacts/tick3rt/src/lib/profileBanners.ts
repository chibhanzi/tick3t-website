export const PROFILE_BANNER_MAX_BYTES = 2 * 1024 * 1024;
export const PROFILE_BANNER_UPDATED_EVENT = "tick3t:profile-banner-updated";

const profileBannerKey = (userId: string) => `tick3t.profile-banner.${userId}`;

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