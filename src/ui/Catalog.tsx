import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

import { CATEGORIES, PRODUCTS, photo, photoSet } from "../content";
import type { CategoryId, Product } from "../content";
import { money } from "../cart";
import { Icon } from "./icons";

type CardProps = { product: Product; onOpen: (id: string, variantId: string) => void; onQuickAdd: (p: Product, variantId: string) => void };

function ProductCard({ product, onOpen, onQuickAdd }: CardProps) {
  const card = useRef<HTMLElement>(null);
  const variantId = product.variants[0].id;
  const category = CATEGORIES.find((c) => c.id === product.category)?.name;
  const needsChoice = !!product.sizes || !!product.custom || product.variants.length > 1;
  const note = product.category === "uniformes" ? "Diseño y colores a tu gusto" : product.variants.length > 1 ? product.variants.map((x, i) => (i ? x.name.toLowerCase() : x.name)).join(" o ") : null;

  const tilt = (e: PointerEvent) => {
    const el = card.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -6}deg`);
    el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`);
  };
  const reset = () => {
    card.current?.style.setProperty("--rx", "0deg");
    card.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <motion.article
      ref={card}
      layout
      className="card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      onPointerMove={tilt}
      onPointerLeave={reset}
    >
      <button type="button" className="card__media" onClick={() => onOpen(product.id, variantId)} aria-label={`Ver ${product.name}`}>
        <img
          className="card__photo"
          src={photo(product, 600)}
          srcSet={photoSet(product)}
          sizes="(max-width: 760px) 50vw, 300px"
          width={600}
          height={480}
          alt={product.name}
          loading="lazy"
          decoding="async"
        />
        {product.tag && <span className="card__tag">{product.tag}</span>}
      </button>
      <div className="card__body">
        <p className="card__cat">{category}</p>
        <h3 className="card__name">{product.name}</h3>
        {note && <p className="card__note">{note}</p>}
        <div className="card__foot">
          <div className="price">
            <strong>{money(product.price)}</strong>
            <span>
              Docena <b>{money(product.dozen)}</b> c/u
            </span>
          </div>
          <button
            type="button"
            className="card__add"
            aria-label={needsChoice ? `Elegir opciones de ${product.name}` : `Agregar ${product.name}`}
            onClick={() => (needsChoice ? onOpen(product.id, variantId) : onQuickAdd(product, variantId))}
          >
            <Icon name="plus" size={20} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function Catalog({ onOpen, onQuickAdd }: { onOpen: (id: string, variantId: string) => void; onQuickAdd: (p: Product, variantId: string) => void }) {
  const [filter, setFilter] = useState<CategoryId | "todo">("todo");
  const list = filter === "todo" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
  return (
    <section className="catalog" id="catalogo">
      <header className="section-head">
        <p className="kicker">Catálogo</p>
        <h2 className="display">
          Todo para <span className="outline">la cancha</span>
        </h2>
      </header>
      <div className="filters" role="tablist" aria-label="Categorías">
        {[{ id: "todo" as const, name: "Todo" }, ...CATEGORIES].map((c) => (
          <button key={c.id} type="button" role="tab" aria-selected={filter === c.id} className="filter" onClick={() => setFilter(c.id)}>
            {filter === c.id && <motion.span layoutId="filter" className="filter__thumb" transition={{ type: "spring", bounce: 0.2, duration: 0.45 }} />}
            <span>{c.name}</span>
          </button>
        ))}
      </div>
      <motion.div layout className="grid">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={onOpen} onQuickAdd={onQuickAdd} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
