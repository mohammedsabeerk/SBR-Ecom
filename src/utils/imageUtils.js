
export const getImageUrl = (img) => {
  if (!img) return "https://placehold.co/500x700?text=No+Image";

  if (img.startsWith("http")) return img;

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001/api";
  const serverRoot = backendUrl.replace(/\/api\/?$/, "");
  return `${serverRoot}/${img}`;
};