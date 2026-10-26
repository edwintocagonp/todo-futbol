import { useEffect, useState } from "react";

import { BRAND, DELIVERY, DOZEN, FREE_SHIPPING, PRODUCTS } from "./content";
import type { Product, Variant } from "./content";

export type CartItem = {
  key: string;
  productId: string;
  variantId: string;
  size: string;
  number: string;
  player: string;
  qty: number;
};

const currency = new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" });
export const money = (n: number) => currency.format(n);

export const product = (id: string): Product => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
export const variant = (p: Product, id: string): Variant => p.variants.find((v) => v.id === id) ?? p.variants[0];

export const itemKey = (i: Omit<CartItem, "key" | "qty">) => [i.productId, i.variantId, i.size, i.number, i.player].join("|");

export function unitsByProduct(items: CartItem[]) {
  const units = new Map<string, number>();
  for (const i of items) units.set(i.productId, (units.get(i.productId) ?? 0) + i.qty);
  return units;
}

export const unitPrice = (p: Product, units: number) => (units >= DOZEN ? p.dozen : p.price);

export function totals(items: CartItem[], deliveryId: string) {
  const units = unitsByProduct(items);
  let full = 0;
  let subtotal = 0;
  const lines = items.map((i) => {
    const p = product(i.productId);
    const unit = unitPrice(p, units.get(p.id) ?? 0);
    full += p.price * i.qty;
    subtotal += unit * i.qty;
    return { item: i, product: p, unit, total: unit * i.qty, dozen: unit < p.price };
  });
  const delivery = DELIVERY.find((d) => d.id === deliveryId) ?? DELIVERY[0];
  const shipping = subtotal >= FREE_SHIPPING ? 0 : delivery.price;
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { lines, full, subtotal, savings: full - subtotal, shipping, delivery, total: subtotal + shipping, count };
}

export type OrderForm = { name: string; city: string; address: string; notes: string };

export function orderMessage(items: CartItem[], deliveryId: string, form: OrderForm) {
  const t = totals(items, deliveryId);
  const rows = t.lines.map(({ item, product: p, unit, total, dozen }) => {
    const v = variant(p, item.variantId);
    const details = [p.variants.length > 1 ? v.name : null, item.size ? `talla ${item.size}` : null, item.number || item.player ? `#${item.number} ${item.player}`.trim() : null]
      .filter(Boolean)
      .join(", ");
    return `• ${item.qty} × ${p.name}${details ? ` (${details})` : ""}: ${money(unit)} c/u${dozen ? " por docena" : ""} = ${money(total)}`;
  });
  const custom = t.lines.some((l) => l.product.custom);
  return [
    `Hola ${BRAND.name} ⚽ Quiero hacer este pedido:`,
    "",
    ...rows,
    "",
    t.savings > 0 ? `Ahorro por docena: ${money(t.savings)}` : null,
    `Entrega: ${t.delivery.name}${t.shipping ? ` (${money(t.shipping)})` : " (gratis)"}`,
    `Total: ${money(t.total)}`,
    "",
    `Nombre: ${form.name}`,
    `Ciudad: ${form.city}`,
    form.address.trim() ? `Dirección: ${form.address.trim()}` : null,
    form.notes.trim() ? `Notas: ${form.notes.trim()}` : null,
    custom ? "La lista de números y nombres de las camisetas la envío por aquí." : null,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export const whatsappUrl = (text: string) => `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;

const STORAGE = "todo-futbol-cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) ?? "[]") as CartItem[];
      return Array.isArray(saved) ? saved.filter((i) => PRODUCTS.some((p) => p.id === i.productId) && i.qty > 0) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(items));
    } catch {
      return;
    }
  }, [items]);

  const add = (entry: Omit<CartItem, "key">) =>
    setItems((list) => {
      const key = itemKey(entry);
      const found = list.find((i) => i.key === key);
      return found ? list.map((i) => (i.key === key ? { ...i, qty: i.qty + entry.qty } : i)) : [...list, { ...entry, key }];
    });
  const setQty = (key: string, qty: number) =>
    setItems((list) => (qty <= 0 ? list.filter((i) => i.key !== key) : list.map((i) => (i.key === key ? { ...i, qty: Math.min(999, qty) } : i))));
  const clear = () => setItems([]);

  return { items, add, setQty, clear };
}
