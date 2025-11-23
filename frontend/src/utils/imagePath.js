export const getImageUrl = (path) => {
  if (!path) return "/placeholder.png";

  // If backend returns: "/uploads/123.jpg"
  return `http://localhost:5000${path}`;
};
