import React from 'react';
import { useProductStore, useLinksStore } from './stores';
import { Package, Play, Star, Tag, X } from './components/icons';
import './App.css';

function App() {
  const { products, loading, fetchAllProducts } = useProductStore();
  const { links, fetchLinks } = useLinksStore();

  React.useEffect(() => {
    fetchAllProducts();
    fetchLinks();
  }, [fetchAllProducts, fetchLinks]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <Package size={32} /> Ma Boutique Al Gran
        </h1>
      </header>

      <main>
        <section className="icons-demo">
          <h2>Icônes disponibles</h2>
          <div className="icons-grid">
            <Package size={48} />
            <Play size={48} />
            <Star size={48} />
            <Tag size={48} />
            <X size={48} />
          </div>
        </section>

        <section className="products">
          <h2>Produits</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="price">{product.price} €</p>
                  {product.isFeatured && (
                    <span className="featured-badge">
                      <Star size={16} /> En vedette
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
