
export const getImageUrl = (img) => {
  if (!img) return "https://placehold.co/500x700?text=No+Image";

  return img.startsWith("http")
    ? img
    : `http://localhost:8001/${img}`;
};