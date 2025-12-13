export interface SharePayload {
  title: string;
  text?: string;
  url: string;
}

export async function shareOrCopy(payload: SharePayload): Promise<void> {
  try {
    const nav = navigator as Navigator & { share?: (data: SharePayload) => Promise<void> };
    if (nav && typeof nav.share === 'function') {
      await nav.share(payload);
      return;
    }
    await navigator.clipboard.writeText(payload.url);
    alert('Link nusxalandi!');
  } catch {
    try {
      await navigator.clipboard.writeText(payload.url);
      alert('Link nusxalandi!');
    } catch {
      // Silently ignore if clipboard is unavailable
    }
  }
}
