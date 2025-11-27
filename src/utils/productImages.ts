const productImageMap: Record<string, string> = {
  monitor: "/assets/monitor_dell.png",
  dell: "/assets/monitor_dell.png",
  mouse: "/assets/mouse_logitech.png",
  logitech: "/assets/mouse_logitech.png",
  ssd: "/assets/ssd.png",
};

export const getProductImage = (productName: string): string | undefined => {
  const nameLower = productName.toLowerCase();
  
  for (const [key, image] of Object.entries(productImageMap)) {
    if (nameLower.includes(key)) {
      return image;
    }
  }
  
  return undefined;
};

