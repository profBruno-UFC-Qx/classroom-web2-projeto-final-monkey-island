export const formatDate = (dateString?: string) => {
  if (!dateString) return "--/--/--";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


export const formatShortId = (id?: string) => {
  if (!id) return "S/ID";
  return id.slice(0, 8).toUpperCase();
};