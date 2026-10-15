import React, { useState, useEffect, useMemo, useRef } from 'react';
import { products } from './data.js';

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

function ProductCard({ product }) {
  return (
    <article className="card">
      <h3>{product.title}</h3>
      <p>{product.price} RUB</p>
      <p>{product.inStock ? 'In stock' : 'Out of stock'}</p>
    </article>
  );
}

function ProductList({ items }) {
  return <div className="products">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current.focus(); }, []);

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return products.filter((product) =>
      product.title.toLowerCase().includes(text) && (!onlyInStock || product.inStock));
  }, [query, onlyInStock]);

  return (
    <main className="page">
      <header><h1>Store</h1></header>
      <SearchBar query={query} setQuery={setQuery} onlyInStock={onlyInStock}
        setOnlyInStock={setOnlyInStock} inputRef={inputRef} />
      <p className="count">Found: {visible.length}</p>
      <ProductList items={visible} />
    </main>
  );
}
