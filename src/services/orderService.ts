import type { CartItem } from "@/hooks/useCart";
import type { Product } from "@/lib/firebase";
import type { UserProfile } from "@/hooks/useProfile";
import { formatCurrency } from "@/lib/utils";

export class OrderService {
  private static WHATSAPP_NUMBER = "+918237474507"; // Replace with your WhatsApp number
  private static INSTAGRAM_USERNAME = "kaysha_styles"; // Replace with your Instagram username

  static formatOrderMessage(items: CartItem[], profile?: UserProfile): string {
    let message = "🛍️ *New Order from Kaysha Styles Website*\n\n";

    if (profile) {
      message += `👤 *Customer Details:*\n`;
      message += `Name: ${profile.name}\n`;
      message += `Mobile: ${profile.mobile}\n`;
      if (profile.alternativeNumber) {
        message += `Alt Mobile: ${profile.alternativeNumber}\n`;
      }
      if (profile.email) {
        message += `Email: ${profile.email}\n`;
      }
      message += `Address: ${profile.fullAddress}\n`;
      message += `Pincode: ${profile.pincode}\n\n`;
    }

    items.forEach((item, index) => {
      const price = item.product.discountedPrice || item.product.sellingPrice;
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   Size: ${item.size}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ${formatCurrency(price)} each\n`;
      message += `   Subtotal: ${formatCurrency(price * item.quantity)}\n\n`;
    });

    const total = items.reduce((sum, item) => {
      const price = item.product.discountedPrice || item.product.sellingPrice;
      return sum + price * item.quantity;
    }, 0);

    message += `💰 *Total: ${formatCurrency(total)}*\n\n`;
    message += `📅 Order Date: ${new Date().toLocaleDateString()}\n`;
    message += `🌐 Ordered via: Website`;

    return message;
  }

  static formatSingleProductMessage(
    product: Product,
    size: string,
    profile?: UserProfile
  ): string {
    const price = product.discountedPrice || product.sellingPrice;

    let message = `🛍️ *Quick Buy - Kaysha Styles*\n\n`;

    if (profile) {
      message += `👤 *Customer Details:*\n`;
      message += `Name: ${profile.name}\n`;
      message += `Mobile: ${profile.mobile}\n`;
      if (profile.alternativeNumber) {
        message += `Alt Mobile: ${profile.alternativeNumber}\n`;
      }
      if (profile.email) {
        message += `Email: ${profile.email}\n`;
      }
      message += `Address: ${profile.fullAddress}\n`;
      message += `Pincode: ${profile.pincode}\n\n`;
    }

    message += `*${product.name}*\n`;
    message += `Size: ${size}\n`;
    message += `Price: ${formatCurrency(product.sellingPrice)}\n\n`;
    message += `Special Price: ${formatCurrency(price)}\n\n`;
    message += `📅 Date: ${new Date().toLocaleDateString()}\n`;
    message += `(${product.id}) \n `;
    message += `🌐 Ordered via: Website`;

    return message;
  }

  static async sendToWhatsApp(message: string): Promise<boolean> {
    try {
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${this.WHATSAPP_NUMBER.replace(
        "+",
        ""
      )}?text=${encodedMessage}`;

      window.open(whatsappUrl, "_blank");
      return true;
    } catch (error) {
      console.error("WhatsApp send failed:", error);
      return false;
    }
  }

  static async sendToInstagram(message: string): Promise<boolean> {
    try {
      const instagramUrl = `https://ig.me/m/${this.INSTAGRAM_USERNAME}`;
      window.open(instagramUrl, "_blank");

      // Copy message to clipboard for user to paste
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        alert(
          "Message copied to clipboard. Please paste it in Instagram chat."
        );
      }
      return true;
    } catch (error) {
      console.error("Instagram send failed:", error);
      return false;
    }
  }

  static async sendOrder(
    items: CartItem[],
    profile?: UserProfile
  ): Promise<void> {
    const message = this.formatOrderMessage(items, profile);

    try {
      const success = await this.sendToWhatsApp(message);
      if (!success) {
        await this.sendToInstagram(message);
      }
    } catch (error) {
      console.error("Order send failed:", error);
      await this.sendToInstagram(message);
    }
  }

  static async buyNow(
    product: Product,
    size: string,
    profile?: UserProfile
  ): Promise<void> {
    const message = this.formatSingleProductMessage(product, size, profile);

    try {
      const success = await this.sendToWhatsApp(message);
      if (!success) {
        await this.sendToInstagram(message);
      }
    } catch (error) {
      console.error("Buy now failed:", error);
      await this.sendToInstagram(message);
    }
  }
}
