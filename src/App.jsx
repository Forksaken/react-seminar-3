import React, { memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { products } from './data.js';
import { cartReducer, initialCart } from './cart.js';

function Header({ count, total, onClear }) {
  return (
    <header>
      <h1>Store</h1>
      <div className="cart-summary">
        <span>Cart: {count} items · {total} RUB</span>
        <button onClick={onClear}>Clear cart</button>
      </div>
    </header>
  );
}

function SearchBar({ query, setQuery, onlyInStock, setOnlyInStock, inputRef }) {
  return (
    <div className="controls">
      <input ref={inputRef} type="text" placeholder="Search products" value={query}
        onChange={(e) => setQuery(e.target.value)} />
      <label>
        <input type="checkbox" checked={onlyInStock}
          onChange={(e) => setOnlyInStock(e.target.checked)} />
        In stock only
      </label>
    </div>
  );
}

const ProductCard = memo(function ProductCard({ product, qty, onAdd, onRemove }) {
  console.log('render', product.id);
  return (
    <article className="card">
      <h3>{product.title}</h3>
      <p>{product.price} RUB</p>
      <p>{product.inStock ? 'In stock' : 'Out of stock'}</p>
      {qty > 0 && <p>In cart: {qty}</p>}
      <button disabled={!product.inStock} onClick={() => onAdd(product)}>Add to cart</button>
      {qty > 0 && <button onClick={() => onRemove(product.id)}>Remove</button>}
    </article>
  );
});

function ProductList({ items, qtyById, onAdd, onRemove }) {
  return (
    <div className="products">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} qty={qtyById[product.id] ?? 0}
          onAdd={onAdd} onRemove={onRemove} />
      ))}
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current.focus(); }, []);

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return products.filter((product) =>
      product.title.toLowerCase().includes(text) && (!onlyInStock || product.inStock));
  }, [query, onlyInStock]);

  const qtyById = useMemo(() => Object.fromEntries(cart.items.map((item) => [item.id, item.qty])), [cart.items]);
  const count = useMemo(() => cart.items.reduce((sum, item) => sum + item.qty, 0), [cart.items]);
  const total = useMemo(() => cart.items.reduce((sum, item) => sum + item.qty * item.price, 0), [cart.items]);
  const onAdd = useCallback((product) => dispatch({ type: 'add', product }), []);
  const onRemove = useCallback((id) => dispatch({ type: 'remove', id }), []);
  const onClear = useCallback(() => dispatch({ type: 'clear' }), []);

  return (
    <main className="page">
      <Header count={count} total={total} onClear={onClear} />
      <SearchBar query={query} setQuery={setQuery} onlyInStock={onlyInStock}
        setOnlyInStock={setOnlyInStock} inputRef={inputRef} />
      <p className="count">Found: {visible.length}</p>
      <ProductList items={visible} qtyById={qtyById} onAdd={onAdd} onRemove={onRemove} />
    </main>
  );
}
