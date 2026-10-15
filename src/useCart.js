import { useCallback, useMemo, useReducer } from 'react';
import { cartReducer, initialCart } from './cart.js';

export function useCart() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const add = useCallback((product) => dispatch({ type: 'add', product }), []);
  const remove = useCallback((id) => dispatch({ type: 'remove', id }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const qtyById = useMemo(() => Object.fromEntries(cart.items.map((item) => [item.id, item.qty])), [cart.items]);
  const totalCount = useMemo(() => cart.items.reduce((sum, item) => sum + item.qty, 0), [cart.items]);
  const totalPrice = useMemo(() => cart.items.reduce((sum, item) => sum + item.qty * item.price, 0), [cart.items]);

  return { items: cart.items, qtyById, totalCount, totalPrice, add, remove, clear };
}
