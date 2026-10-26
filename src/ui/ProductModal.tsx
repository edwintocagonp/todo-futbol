import { Suspense, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { CATEGORIES, DOZEN } from "../content";
import type { Product } from "../content";
import { money, unitPrice, variant } from "../cart";
import type { CartItem } from "../cart";
import { ProductStage } from "../scene/ProductStage";
import { Icon } from "./icons";

type ModalProps = {
  product: Product | null;
  initialVariant: string;
  inCart: number;
  onClose: () => void;
  onAdd: (entry: Omit<CartItem, "key">) => void;
};

export function ProductModal({ product, initialVariant, inCart, onClose, onAdd }: ModalProps) {
  return (
    <AnimatePresence>
      {product && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
          <Sheet key={product.id} product={product} initialVariant={initialVariant} inCart={inCart} onClose={onClose} onAdd={onAdd} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Sheet({ product, initialVariant, inCart, onClose, onAdd }: ModalProps & { product: Product }) {
  const [variantId, setVariantId] = useState(initialVariant);
  const [size, setSize] = useState(product.sizes?.[Math.min(2, product.sizes.length - 1)] ?? "");
  const [number, setNumber] = useState("10");
  const [player, setPlayer] = useState("");
  const [qty, setQty] = useState(1);
  const v = variant(product, variantId);
  const units = inCart + qty;
  const unit = unitPrice(product, units);
  const missing = Math.max(0, DOZEN - units);
  const category = CATEGORIES.find((c) => c.id === product.category)?.name;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const add = () => {
    onAdd({ productId: product.id, variantId, size, number: product.custom ? number : "", player: product.custom ? player.trim() : "", qty });
    onClose();
  };

  return (
    <motion.div
      className="sheet"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      initial={{ y: 40, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 30, opacity: 0 }}
      transition={{ type: "spring", bounce: 0.16, duration: 0.55 }}
      style={{ "--main": v.main, "--second": v.second } as CSSProperties}
    >
      <button type="button" className="icon-btn sheet__close" onClick={onClose} aria-label="Cerrar">
        <Icon name="close" />
      </button>
      <div className="sheet__stage">
        <span className="sheet__halo" />
        <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}>
          <Suspense fallback={null}>
            <ProductStage product={product} variant={v} number={number || "0"} player={player} detail={5} spin={false} distance={7} />
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1.6} minPolarAngle={1} maxPolarAngle={2.1} />
        </Canvas>
        <p className="sheet__hint">
          <Icon name="rotate" size={16} /> Arrastra para girarlo
        </p>
      </div>

      <div className="sheet__info">
        <p className="kicker">{category}</p>
        <h2 className="sheet__name">{product.name}</h2>
        <p className="muted">{product.blurb}</p>

        <div className="dozen-box">
          <div>
            <span className="label">Precio</span>
            <strong>{money(product.price)}</strong>
          </div>
          <div className={missing === 0 ? "is-on" : ""}>
            <span className="label">Por docena</span>
            <strong>{money(product.dozen)}</strong>
          </div>
          <p className="dozen-box__note">
            {missing === 0 ? (
              <>
                <Icon name="check" size={16} /> Precio por docena aplicado
              </>
            ) : (
              <>Te faltan {missing} para el precio por docena</>
            )}
          </p>
          <span className="dozen-box__bar" style={{ "--p": `${Math.min(1, units / DOZEN) * 100}%` } as CSSProperties} />
        </div>

        {product.variants.length > 1 && (
          <div className="field">
            <span className="label">
              Color · <b>{v.name}</b>
            </span>
            <div className="swatches" role="radiogroup" aria-label="Color">
              {product.variants.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={x.id === variantId}
                  aria-label={x.name}
                  title={x.name}
                  className="dot dot--big"
                  style={{ "--a": x.main, "--b": x.second } as CSSProperties}
                  onClick={() => setVariantId(x.id)}
                />
              ))}
            </div>
          </div>
        )}

        {product.sizes && (
          <div className="field">
            <span className="label">Talla</span>
            <div className="sizes" role="radiogroup" aria-label="Talla">
              {product.sizes.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={s === size} className="size" onClick={() => setSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.custom && (
          <div className="field">
            <span className="label">Número y nombre (sin costo)</span>
            <div className="custom">
              <input
                className="input input--number"
                inputMode="numeric"
                aria-label="Número"
                value={number}
                onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 2))}
              />
              <input
                className="input"
                aria-label="Nombre en la espalda"
                placeholder="Nombre en la espalda"
                maxLength={12}
                value={player}
                onChange={(e) => setPlayer(e.target.value.replace(/[^\p{L}\s.'-]/gu, "").slice(0, 12))}
              />
            </div>
            <p className="muted small">Para el equipo completo, la lista de números y nombres se envía por WhatsApp.</p>
          </div>
        )}

        <div className="buy">
          <div className="stepper" aria-label="Cantidad">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos">
              <Icon name="minus" size={18} />
            </button>
            <output>{qty}</output>
            <button type="button" onClick={() => setQty((q) => Math.min(999, q + 1))} aria-label="Más">
              <Icon name="plus" size={18} />
            </button>
          </div>
          <button type="button" className="chip-btn" onClick={() => setQty((q) => q + DOZEN)}>
            <Icon name="team" size={18} /> +12
          </button>
        </div>
        <button type="button" className="cta cta--block" onClick={add}>
          <Icon name="bag" size={20} />
          Agregar · {money(unit * qty)}
        </button>
      </div>
    </motion.div>
  );
}
