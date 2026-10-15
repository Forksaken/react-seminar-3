import React, { memo, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { products } from './data.js';
import { useCart } from './useCart.js';

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

function SearchBar({ query, onQueryChange, onlyInStock, setOnlyInStock, inputRef }) {
  return (
    <div className="controls">
      <input ref={inputRef} type="text" placeholder="Search products" value={query}
        onChange={(e) => onQueryChange(e.target.value)} />
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
  const [filter, setFilter] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef(null);
  const cart = useCart();

  useEffect(() => { inputRef.current.focus(); }, []);

  function handleSearch(value) {
    setQuery(value);
    startTransition(() => setFilter(value));
  }

  const visible = useMemo(() => {
    const text = filter.trim().toLowerCase();
    return products.filter((product) =>
      product.title.toLowerCase().includes(text) && (!onlyInStock || product.inStock));
  }, [filter, onlyInStock]);

  return (
    <main className="page">
      <Header count={cart.totalCount} total={cart.totalPrice} onClear={cart.clear} />
      <SearchBar query={query} onQueryChange={handleSearch} onlyInStock={onlyInStock}
        setOnlyInStock={setOnlyInStock} inputRef={inputRef} />
      <p className="count">Found: {visible.length} {isPending && '· Updating results…'}</p>
      <ProductList items={visible} qtyById={cart.qtyById} onAdd={cart.add} onRemove={cart.remove} />
    </main>
  );
}
