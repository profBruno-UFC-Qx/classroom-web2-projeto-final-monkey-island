export const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";
  // Pega a URL base do .env (VITE_IMG_BASE_URL) ou usa fallback
  const baseUrl = import.meta.env.VITE_IMG_BASE_URL || 'http://localhost:3000/images/';
  
  // Garante que não tenha barra duplicada
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  return `${cleanBase}${cleanPath}`;
};