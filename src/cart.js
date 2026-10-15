export const initialCart = { items: [] };

export function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const found = state.items.find((item) => item.id === action.product.id);
      if (found) {
        return {
          items: state.items.map((item) => item.id === found.id
            ? { ...item, qty: item.qty + 1 }
            : item),
        };
      }
      return { items: [...state.items, { ...action.product, qty: 1 }] };
    }
    case 'remove':
      return { items: state.items.filter((item) => item.id !== action.id) };
    case 'clear':
      return initialCart;
    default:
      return state;
  }
}
