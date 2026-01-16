export const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";

  // Se já for uma URL completa (ex: bucket S3 ou link externo), retorna ela mesma
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Pega a URL base do .env (VITE_IMG_BASE_URL) ou usa fallback
  const baseUrl = import.meta.env.VITE_IMG_BASE_URL || 'http://localhost:3000/images/';
  
  // Garante tratamento correto das barras
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  return `${cleanBase}${cleanPath}`;
};