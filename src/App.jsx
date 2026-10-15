import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
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

function ProductCard({ product, qty, onAdd, onRemove }) {
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
}

function ProductList({ items, cartItems, onAdd, onRemove }) {
  return (
    <div className="products">
      {items.map((product) => (
        <ProductCard key={product.id} product={product}
          qty={cartItems.find((item) => item.id === product.id)?.qty ?? 0}
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

  const count = cart.items.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <main className="page">
      <Header count={count} total={total} onClear={() => dispatch({ type: 'clear' })} />
      <SearchBar query={query} setQuery={setQuery} onlyInStock={onlyInStock}
        setOnlyInStock={setOnlyInStock} inputRef={inputRef} />
      <p className="count">Found: {visible.length}</p>
      <ProductList items={visible} cartItems={cart.items}
        onAdd={(product) => dispatch({ type: 'add', product })}
        onRemove={(id) => dispatch({ type: 'remove', id })} />
    </main>
  );
}
