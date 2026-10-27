import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

import { BRAND, CATEGORIES, DELIVERY, FREE_SHIPPING, photo } from "../content";
import { money, orderMessage, totals, variant, whatsappUrl } from "../cart";
import type { CartItem, OrderForm } from "../cart";
import { Icon, WhatsAppIcon } from "./icons";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};

export function CartDrawer({ open, onClose, items, setQty, clear }: DrawerProps) {
  const [delivery, setDelivery] = useState(DELIVERY[0].id);
  const [step, setStep] = useState<"cart" | "form" | "sent">("cart");
  const [form, setForm] = useState<OrderForm>({ name: "", city: "Otavalo", address: "", notes: "" });
  const [sentUrl, setSentUrl] = useState("");
  const t = totals(items, delivery);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open && step === "sent") setStep("cart");
  }, [open, step]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const url = whatsappUrl(orderMessage(items, delivery, form));
    window.open(url, "_blank", "noopener");
    setSentUrl(url);
    setStep("sent");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="drawer-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Carrito"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
          >
            <header className="drawer__head">
              <h2 className="display display--sm">{step === "form" ? "Tus datos" : "Tu carrito"}</h2>
              <span className="pill">{t.count} productos</span>
              <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar">
                <Icon name="close" />
              </button>
            </header>

            {step === "sent" ? (
              <div className="drawer__done">
                <span className="done-check">
                  <Icon name="check" size={30} />
                </span>
                <h3 className="display display--sm">¡Pedido listo!</h3>
                <p className="muted">
                  Se abrió WhatsApp con tu pedido. Esta es una tienda de demostración: el número {BRAND.phone} es de prueba y el mensaje no llega a nadie.
                </p>
                <a className="btn" href={sentUrl} target="_blank" rel="noopener noreferrer">
                  Abrir WhatsApp de nuevo
                </a>
                <button
                  type="button"
                  className="cta cta--block"
                  onClick={() => {
                    clear();
                    setStep("cart");
                    onClose();
                  }}
                >
                  Vaciar carrito y seguir
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="drawer__empty">
                <Icon name="bag" size={42} />
                <p>Tu carrito está vacío.</p>
                <button type="button" className="btn" onClick={onClose}>
                  Ver productos
                </button>
              </div>
            ) : step === "cart" ? (
              <div className="drawer__scroll">
                <ul className="lines">
                  {t.lines.map(({ item, product, unit, total, dozen }) => {
                    const v = variant(product, item.variantId);
                    const meta = [
                      product.variants.length > 1 ? v.name : CATEGORIES.find((c) => c.id === product.category)?.name,
                      item.size && `Talla ${item.size}`,
                      (item.number || item.player) && `#${item.number} ${item.player}`.trim(),
                    ].filter(Boolean);
                    return (
                      <motion.li key={item.key} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                        <img className="line__photo" src={photo(product, 600, v)} width={600} height={480} alt="" loading="lazy" decoding="async" />
                        <div className="line__info">
                          <p className="line__name">{product.name}</p>
                          <p className="line__meta">{meta.join(" · ")}</p>
                          <p className="line__price">
                            {money(unit)} c/u {dozen && <span className="badge">Docena</span>}
                          </p>
                        </div>
                        <div className="line__side">
                          <div className="stepper stepper--sm">
                            <button type="button" onClick={() => setQty(item.key, item.qty - 1)} aria-label="Menos">
                              <Icon name={item.qty === 1 ? "trash" : "minus"} size={16} />
                            </button>
                            <output>{item.qty}</output>
                            <button type="button" onClick={() => setQty(item.key, item.qty + 1)} aria-label="Más">
                              <Icon name="plus" size={16} />
                            </button>
                          </div>
                          <strong>{money(total)}</strong>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>

                <div className="delivery">
                  <p className="label">
                    <Icon name="truck" size={17} /> Entrega
                  </p>
                  {DELIVERY.map((d) => (
                    <label key={d.id} className={`option${delivery === d.id ? " is-on" : ""}`}>
                      <input type="radio" name="delivery" checked={delivery === d.id} onChange={() => setDelivery(d.id)} />
                      <span>
                        {d.name}
                        <small>{d.detail}</small>
                      </span>
                      <b>{d.price && t.subtotal < FREE_SHIPPING ? money(d.price) : "Gratis"}</b>
                    </label>
                  ))}
                  {t.subtotal < FREE_SHIPPING && delivery !== "retiro" && (
                    <p className="muted small">Te faltan {money(FREE_SHIPPING - t.subtotal)} para el envío gratis.</p>
                  )}
                </div>
              </div>
            ) : (
              <form id="order" className="order" onSubmit={send}>
                <label className="field-input">
                  <span className="label">Nombre o equipo</span>
                  <input className="input" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label className="field-input">
                  <span className="label">Ciudad</span>
                  <input className="input" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </label>
                {delivery !== "retiro" && (
                  <label className="field-input">
                    <span className="label">Dirección</span>
                    <input className="input" required autoComplete="street-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </label>
                )}
                <label className="field-input">
                  <span className="label">Notas (opcional)</span>
                  <textarea className="input" rows={3} placeholder="Fecha del campeonato, colores del escudo..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </label>
                <p className="pay-note">
                  <Icon name="chat" size={18} /> Sin tarjeta: confirmamos el pedido por WhatsApp y pagas por transferencia o al retirar.
                </p>
                <button type="button" className="btn btn--ghost" onClick={() => setStep("cart")}>
                  Volver al carrito
                </button>
              </form>
            )}

            {items.length > 0 && step !== "sent" && (
              <footer className="drawer__foot">
                <dl className="sum">
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{money(t.full)}</dd>
                  </div>
                  {t.savings > 0 && (
                    <div className="sum__save">
                      <dt>Ahorro por docena</dt>
                      <dd>−{money(t.savings)}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Envío</dt>
                    <dd>{t.shipping ? money(t.shipping) : "Gratis"}</dd>
                  </div>
                  <div className="sum__total">
                    <dt>Total</dt>
                    <dd>{money(t.total)}</dd>
                  </div>
                </dl>
                {step === "cart" ? (
                  <button type="button" className="cta cta--block" onClick={() => setStep("form")}>
                    Continuar <Icon name="arrow" size={20} />
                  </button>
                ) : (
                  <button type="submit" form="order" className="cta cta--block">
                    <WhatsAppIcon size={20} /> Enviar pedido por WhatsApp
                  </button>
                )}
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
