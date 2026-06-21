import { create } from 'zustand';

export interface CartModifier {
  name: string;
  extraPrice: number;
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
      // 1. Calculamos el precio base por unidad (incluyendo extras si los hay)
      const modifiersTotal = newItem.selectedModifiers.reduce((acc, mod) => acc + mod.extraPrice, 0);
      const unitPrice = newItem.basePrice + modifiersTotal;
      const trimmedInstructions = newItem.instructions.trim();

      // 2. Buscamos si ya existe un producto IDÉNTICO en el carrito
      // (Mismo ID de producto, mismas instrucciones y mismos modificadores)
      const existingItemIndex = state.items.findIndex(
        (item) => 
          item.productId === newItem.productId && 
          item.instructions === trimmedInstructions &&
          JSON.stringify(item.selectedModifiers) === JSON.stringify(newItem.selectedModifiers)
      );

      // 3. Lógica de agrupación
      if (existingItemIndex !== -1) {
        // Si ya existe, clonamos el estado y le sumamos la nueva cantidad a esa fila
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        
        const newQuantity = existingItem.quantity + newItem.quantity;
        
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          itemTotal: unitPrice * newQuantity // Recalculamos el total de esa fila
        };

        return { items: updatedItems };
      }

      // 4. Si no existe nada igual, lo agregamos como una fila completamente nueva
      const cartItem: CartItem = {
        ...newItem,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5), // ID único e irrepetible
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
    return get().items.reduce((total, item) => total + item.itemTotal, 0);
  }
}));