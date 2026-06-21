import { CartItem } from "../store/cartStore";
import { storeConfig } from "../config/data";

interface OrderData {
  items: CartItem[];
  customerName: string;
  deliveryDate: string;
  addressType: "now" | "later";
  deliveryAddress?: string;
  lat?: number;
  lng?: number;
  total: number;
}

export const generateWhatsAppLink = (data: OrderData) => {
  const { brand } = storeConfig;
  
  let message = `*🧁 NUEVO PEDIDO - ${brand.name.toUpperCase()}*\n`;
  message += `------------------------------\n`;
  message += `👤 *Nombre:* ${data.customerName}\n`;
  message += `💳 *Pago:* Transferencia / QR (Pre-pago requerido)\n`;
  
  // Formatear la fecha a un formato más amigable (DD/MM/YYYY)
  const dateObj = new Date(data.deliveryDate + "T00:00:00");
  const formattedDate = isNaN(dateObj.getTime()) ? data.deliveryDate : dateObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  message += `📅 *Para entregar el:* ${formattedDate}\n`;
  message += `------------------------------\n\n`;

  message += `*🛒 PEDIDO:*\n`;
  data.items.forEach((item) => {
    message += `*${item.quantity}x ${item.name}* (${(item.itemTotal).toFixed(2)} ${brand.currency})\n`;
    if (item.instructions) {
      message += `  ↳ _Nota: ${item.instructions}_\n`;
    }
  });

  message += `\n*TOTAL A PAGAR: ${data.total.toFixed(2)} ${brand.currency}*\n`;
  message += `_(Costo de envío se coordina por separado)_\n\n`;

  message += `------------------------------\n`;
  message += `*📍 DATOS DE ENTREGA:*\n`;
  
  if (data.addressType === "later") {
    message += `_⚠️ El cliente coordinará la dirección de entrega más adelante._\n`;
  } else {
    if (data.lat && data.lng) {
      message += `🗺️ *Ubicación GPS:* https://www.google.com/maps?q=${data.lat},${data.lng}\n`;
    }
    if (data.deliveryAddress) {
      message += `🏠 *Indicaciones:* ${data.deliveryAddress}\n`;
    }
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${brand.whatsappNumber}?text=${encodedMessage}`;
};