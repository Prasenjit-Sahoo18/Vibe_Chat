/**
 * Universal safe file downloader for all media types:
 * Base64 data URLs, Blobs, and external HTTP/HTTPS links.
 */
export async function downloadFile(url: string, fileName?: string) {
  const safeName = fileName || `vibechat_${Date.now()}`;

  try {
    // If it's already a Data URL or Blob URL, trigger direct anchor download
    if (url.startsWith("data:") || url.startsWith("blob:")) {
      const a = document.createElement("a");
      a.href = url;
      a.download = safeName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // For external or relative URLs, fetch as blob to avoid cross-origin restrictions
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = safeName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(objectUrl);
  } catch (err) {
    console.warn("Direct blob download failed, falling back to window open:", err);
    const a = document.createElement("a");
    a.href = url;
    a.download = safeName;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
