export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const adjustedDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);
  
  return adjustedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

