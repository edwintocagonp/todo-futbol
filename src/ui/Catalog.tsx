import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { View } from "@react-three/drei";

import { CATEGORIES, PRODUCTS } from "../content";
import type { CategoryId, Product } from "../content";
import { money, variant } from "../cart";
import { ProductStage } from "../scene/ProductStage";
import { Icon } from "./icons";

type CardProps = { product: Product; onOpen: (id: string, variantId: string) => void; onQuickAdd: (p: Product, variantId: string) => void };

function ProductCard({ product, onOpen, onQuickAdd }: CardProps) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [hover, setHover] = useState(false);
  const card = useRef<HTMLElement>(null);
  const v = variant(product, variantId);
  const category = CATEGORIES.find((c) => c.id === product.category)?.name;
  const needsChoice = !!product.sizes || !!product.custom;

  const tilt = (e: PointerEvent) => {
    const el = card.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -6}deg`);
    el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`);
  };
  const reset = () => {
    setHover(false);
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
      onPointerEnter={() => setHover(true)}
      onPointerMove={tilt}
      onPointerLeave={reset}
      style={{ "--main": v.main, "--second": v.second } as CSSProperties}
    >
      <button type="button" className="card__media" onClick={() => onOpen(product.id, variantId)} aria-label={`Ver ${product.name}`}>
        <span className="card__glow" />
        <View as="span" className="card__view">
          <ProductStage product={product} variant={v} hovered={hover} />
        </View>
        {product.tag && <span className="card__tag">{product.tag}</span>}
      </button>
      <div className="card__body">
        <p className="card__cat">{category}</p>
        <h3 className="card__name">{product.name}</h3>
        {product.variants.length > 1 && (
          <div className="card__swatches" role="radiogroup" aria-label="Color">
            {product.variants.map((x) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={x.id === variantId}
                aria-label={x.name}
                title={x.name}
                className="dot"
                style={{ "--a": x.main, "--b": x.second } as CSSProperties}
                onClick={() => setVariantId(x.id)}
              />
            ))}
          </div>
        )}
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
            aria-label={needsChoice ? `Elegir talla de ${product.name}` : `Agregar ${product.name}`}
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
