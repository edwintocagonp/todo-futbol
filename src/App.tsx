import { useCallback, useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { View } from "@react-three/drei";

import { BRAND, DOZEN, FREE_SHIPPING, PRODUCTS } from "./content";
import type { Product } from "./content";
import { money, product as findProduct, totals, unitsByProduct, useCart } from "./cart";
import type { CartItem } from "./cart";
import { HeroScene } from "./scene/Hero";
import { CartDrawer } from "./ui/CartDrawer";
import { Catalog } from "./ui/Catalog";
import { BallMark, Icon, WhatsAppIcon } from "./ui/icons";
import { ProductModal } from "./ui/ProductModal";

function useMedia(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [query]);
  return match;
}

function Clear() {
  useFrame(({ gl }) => {
    gl.setScissorTest(false);
    gl.clear(true, true, true);
  }, 0);
  return null;
}

const WORDS = ["Uniformes", "Balones", "Pupos", "Medias", "Calentadores", "Guantes", "Petos", "Canilleras", "Tecnología"];

function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {row.map((w, i) => (
          <span key={i}>
            {w}
            <BallMark size={28} />
          </span>
        ))}
      </div>
    </div>
  );
}

const SHOWCASE = ["uniforme", "medias", "balon-laminado"].map((id) => PRODUCTS.find((p) => p.id === id)!);

export default function App() {
  const cart = useCart();
  const [modal, setModal] = useState<{ id: string; variant: string } | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [kick, setKick] = useState(0);
  const [goal, setGoal] = useState(0);
  const [bump, setBump] = useState(0);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const narrow = useMedia("(max-width: 760px)");
  const t = totals(cart.items, "retiro");
  const units = unitsByProduct(cart.items);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!goal) return;
    const id = setTimeout(() => setGoal(0), 1600);
    return () => clearTimeout(id);
  }, [goal]);

  const add = (entry: Omit<CartItem, "key">) => {
    cart.add(entry);
    setBump((b) => b + 1);
    const p = findProduct(entry.productId);
    const total = (units.get(p.id) ?? 0) + entry.qty;
    setToast({ id: Date.now(), text: total >= DOZEN ? `${p.name}: precio por docena aplicado` : `${p.name} agregado al carrito` });
  };
  const quickAdd = (p: Product, variantId: string) => add({ productId: p.id, variantId, size: "", number: "", player: "", qty: 1 });
  const openProduct = (id: string, variantId: string) => setModal({ id, variant: variantId });
  const closeModal = useCallback(() => setModal(null), []);
  const onGoal = useCallback(() => setGoal(Date.now()), []);

  const shoot = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    setKick((k) => k + 1);
  };

  const modalProduct = modal ? findProduct(modal.id) : null;

  return (
    <>
      <header className="header">
        <a className="logo" href="#inicio" aria-label={`${BRAND.name}, inicio`}>
          <BallMark />
          <span>{BRAND.name}</span>
        </a>
        <nav className="nav" aria-label="Secciones">
          <a href="#catalogo">Catálogo</a>
          <a href="#docena">Por docena</a>
          <a href="#comprar">Cómo comprar</a>
        </nav>
        <motion.button key={bump} type="button" className="cart-btn" onClick={() => setCartOpen(true)} animate={bump ? { scale: [1, 1.15, 1] } : undefined} transition={{ duration: 0.35 }}>
          <Icon name="bag" size={20} />
          <span className="cart-btn__total">{money(t.subtotal)}</span>
          {t.count > 0 && <span className="cart-btn__count">{t.count}</span>}
        </motion.button>
      </header>

      <main>
        <section className="hero" id="inicio" onClick={shoot}>
          <View className="hero__view">
            <HeroScene kick={kick} onGoal={onGoal} narrow={narrow} />
          </View>
          <div className="hero__content">
            <motion.p className="kicker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              {BRAND.city} · {BRAND.region} · envíos a todo Ecuador
            </motion.p>
            <motion.h1 className="display display--hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}>
              Equipa a <span className="outline">tu equipo</span>
            </motion.h1>
            <motion.p className="lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              Uniformes sublimados, balones, pupos y todo para el partido, con precios de Otavalo. Desde 12 unidades, más barato.
            </motion.p>
            <motion.div className="hero__actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <a className="cta" href="#catalogo">
                Ver catálogo <Icon name="arrow" size={20} />
              </a>
              <button type="button" className="btn" onClick={() => openProduct("uniforme", "negro")}>
                <Icon name="team" size={20} /> Armar uniformes
              </button>
            </motion.div>
            <motion.ul className="hero__facts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <li>
                <Icon name="team" size={18} /> Precio por docena
              </li>
              <li>
                <Icon name="truck" size={18} /> Envío gratis desde {money(FREE_SHIPPING)}
              </li>
              <li>
                <WhatsAppIcon size={18} /> Pedido por WhatsApp
              </li>
            </motion.ul>
          </div>
          <p className="hero__hint">Toca la cancha para patear</p>
          <AnimatePresence>
            {goal > 0 && (
              <motion.p
                key={goal}
                className="goal"
                initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: -4 }}
                exit={{ scale: 1.3, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                aria-live="polite"
              >
                ¡Golazo!
              </motion.p>
            )}
          </AnimatePresence>
        </section>

        <Marquee />

        <Catalog onOpen={openProduct} onQuickAdd={quickAdd} />

        <section className="dozen" id="docena">
          <header className="section-head">
            <p className="kicker">Precio por docena</p>
            <h2 className="display">
              Más jugadores, <span className="outline">menos precio</span>
            </h2>
            <p className="lead">Desde 12 unidades del mismo producto, todas pasan al precio por docena. Puedes mezclar tallas.</p>
          </header>
          <div className="dozen__cards">
            {SHOWCASE.map((p) => (
              <article key={p.id} className="dozen-card">
                <p className="dozen-card__name">{p.name}</p>
                <p className="dozen-card__old">{money(p.price)}</p>
                <p className="dozen-card__new">
                  {money(p.dozen)} <span>c/u</span>
                </p>
                <p className="dozen-card__save">Ahorras {money((p.price - p.dozen) * DOZEN)} por docena</p>
              </article>
            ))}
          </div>
        </section>

        <section className="steps" id="comprar">
          <header className="section-head">
            <p className="kicker">Cómo comprar</p>
            <h2 className="display">
              Sin tarjeta, <span className="outline">por WhatsApp</span>
            </h2>
          </header>
          <ol className="steps__list">
            <li>
              <span>01</span>
              <h3>Arma tu carrito</h3>
              <p>Elige productos y tallas. Las camisetas llevan número y nombre sin costo.</p>
            </li>
            <li>
              <span>02</span>
              <h3>Envía el pedido</h3>
              <p>El carrito escribe el pedido completo en WhatsApp: productos, precios y entrega.</p>
            </li>
            <li>
              <span>03</span>
              <h3>Paga y recibe</h3>
              <p>Pagas por transferencia o al retirar en Otavalo. Enviamos a Imbabura, Quito y todo Ecuador.</p>
            </li>
          </ol>
        </section>
      </main>

      <footer className="footer">
        <div className="logo">
          <BallMark />
          <span>{BRAND.name}</span>
        </div>
        <p>
          {BRAND.city}, {BRAND.region} · WhatsApp {BRAND.phone}
        </p>
        <p className="muted small">Tienda de demostración para portafolio. Precios referenciales con IVA y número de WhatsApp de prueba.</p>
      </footer>

      <Canvas className="gl" eventSource={document.getElementById("root")!} eventPrefix="client" dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
        <Clear />
        <View.Port />
      </Canvas>

      <ProductModal product={modalProduct} initialVariant={modal?.variant ?? ""} inCart={modalProduct ? units.get(modalProduct.id) ?? 0 : 0} onClose={closeModal} onAdd={add} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart.items} setQty={cart.setQty} clear={cart.clear} />

      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} className="toast" role="status" initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 10, x: "-50%" }}>
            <Icon name="check" size={18} />
            <span>{toast.text}</span>
            <button type="button" onClick={() => setCartOpen(true)}>
              Ver carrito
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
