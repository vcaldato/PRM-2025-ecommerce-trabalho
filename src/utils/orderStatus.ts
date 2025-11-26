export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    NEW: "Novo",
    SEPARATION: "Em separação",
    ENVOICED: "Faturado",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELADO: "Cancelado",
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    SEPARATION: "bg-yellow-100 text-yellow-800",
    ENVOICED: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELADO: "bg-red-100 text-red-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

export const getNextStatus = (currentStatus: string): string | null => {
  const statusFlow: Record<string, string> = {
    NEW: "SEPARATION",
    SEPARATION: "ENVOICED",
    ENVOICED: "SHIPPED",
    SHIPPED: "DELIVERED",
  };
  return statusFlow[currentStatus] || null;
};

export const getAllStatuses = (): string[] => {
  return ["NEW", "SEPARATION", "ENVOICED", "SHIPPED", "DELIVERED", "CANCELADO"];
};

