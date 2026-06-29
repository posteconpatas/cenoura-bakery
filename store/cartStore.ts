import { create } from 'zustand';

// CORRECCIÓN 1: Alineamos el nombre de la variable a "priceDelta"
export interface CartModifier {
  id: string;
  name: string;
  priceDelta: number;
}

export interface CartItem {
  id: string; 
  productId: string;
  name: string;
  basePrice: number;
  quantity: number;
  selectedModifiers: CartModifier[];
  instructions: string;
  itemTotal: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'itemTotal'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addToCart: (newItem) => {
    set((state) => {
      // CORRECCIÓN 2: Forzamos a que el precio base siempre sea un Número limpio.
      // Ya no sumamos los extras aquí, porque el ProductModal ya manda el precio final correcto.
      const unitPrice = Number(newItem.basePrice) || 0;
      const trimmedInstructions = (newItem.instructions || "").trim();

      // Buscamos si ya existe un producto IDÉNTICO en el carrito
      const existingItemIndex = state.items.findIndex(
        (item) => 
          item.productId === newItem.productId && 
          item.instructions === trimmedInstructions &&
          JSON.stringify(item.selectedModifiers) === JSON.stringify(newItem.selectedModifiers)
      );

      // Lógica de agrupación
      if (existingItemIndex !== -1) {
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        
        const newQuantity = existingItem.quantity + newItem.quantity;
        
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          itemTotal: unitPrice * newQuantity 
        };

        return { items: updatedItems };
      }

      // Si no existe, lo agregamos como fila nueva
      const cartItem: CartItem = {
        ...newItem,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 7), 
        instructions: trimmedInstructions,
        itemTotal: unitPrice * newItem.quantity
      };

      return { items: [...state.items, cartItem] };
    });
  },

  removeFromCart: (id) => {
    set((state) => ({ items: state.items.filter(item => item.id !== id) }));
  },

  clearCart: () => set({ items: [] }),

  getCartTotal: () => {
    // CORRECCIÓN 3: Blindaje anti-NaN al sumar el total del carrito
    return get().items.reduce((total, item) => total + (Number(item.itemTotal) || 0), 0);
  }
}));