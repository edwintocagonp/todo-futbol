export const BRAND = {
  name: "TODO FÚTBOL",
  city: "Otavalo",
  region: "Imbabura",
  whatsapp: "593000000000",
  phone: "+593 00 000 0000",
};

export type CategoryId = "uniformes" | "ropa" | "balones" | "calzado" | "proteccion" | "entrenamiento" | "tecnologia";

export const CATEGORIES: { id: CategoryId; name: string }[] = [
  { id: "uniformes", name: "Uniformes" },
  { id: "ropa", name: "Ropa" },
  { id: "balones", name: "Balones" },
  { id: "calzado", name: "Calzado" },
  { id: "proteccion", name: "Protección" },
  { id: "entrenamiento", name: "Entrenamiento" },
  { id: "tecnologia", name: "Tecnología" },
];

export type ModelId =
  | "kit"
  | "jersey"
  | "shorts"
  | "socks"
  | "jacket"
  | "ball"
  | "boot"
  | "shinguard"
  | "gloves"
  | "cones"
  | "ladder"
  | "bib"
  | "goal"
  | "stopwatch"
  | "pump"
  | "board";

export type Pattern = "plain" | "stripes" | "sash" | "halves" | "hoops";

export type Variant = { id: string; name: string; main: string; second: string; pattern?: Pattern };

export type Product = {
  id: string;
  category: CategoryId;
  model: ModelId;
  name: string;
  blurb: string;
  price: number;
  dozen: number;
  variants: Variant[];
  sizes?: string[];
  custom?: boolean;
  tag?: string;
};

const KIT_COLORS: Variant[] = [
  { id: "verde", name: "Verde y negro", main: "#2fd65f", second: "#0c0f0a", pattern: "sash" },
  { id: "tricolor", name: "Amarillo, azul y rojo", main: "#ffd21f", second: "#1d3fa8", pattern: "hoops" },
  { id: "azul", name: "Azul y blanco", main: "#1f56d6", second: "#ffffff", pattern: "stripes" },
  { id: "rojo", name: "Rojo y negro", main: "#d61f2c", second: "#111111", pattern: "halves" },
  { id: "blanco", name: "Blanco y celeste", main: "#f4f6f8", second: "#58b6ff", pattern: "sash" },
  { id: "negro", name: "Negro y dorado", main: "#141414", second: "#d8b04a", pattern: "plain" },
];

const SOLID = (list: [string, string, string, string][]): Variant[] => list.map(([id, name, main, second]) => ({ id, name, main, second }));

const ADULT = ["S", "M", "L", "XL", "XXL"];
const KIDS_ADULT = ["6", "8", "10", "12", "14", ...ADULT];
const FEET = ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];

// USD con IVA, referencia de Otavalo y Quito (2026)
export const PRODUCTS: Product[] = [
  {
    id: "uniforme",
    category: "uniformes",
    model: "kit",
    name: "Uniforme sublimado",
    blurb: "Camiseta y pantaloneta en tela deportiva que respira. Número y nombre sin costo.",
    price: 12.5,
    dozen: 10.5,
    variants: KIT_COLORS,
    sizes: KIDS_ADULT,
    custom: true,
    tag: "Más pedido",
  },
  {
    id: "camiseta",
    category: "uniformes",
    model: "jersey",
    name: "Camiseta de equipo",
    blurb: "Sublimada, de secado rápido. Ideal para ligas barriales y campeonatos.",
    price: 8.5,
    dozen: 7,
    variants: KIT_COLORS,
    sizes: KIDS_ADULT,
    custom: true,
  },
  {
    id: "pantaloneta",
    category: "uniformes",
    model: "shorts",
    name: "Pantaloneta",
    blurb: "Liviana, con elástico y cordón. Combina con cualquier camiseta.",
    price: 5.5,
    dozen: 4.5,
    variants: KIT_COLORS,
    sizes: KIDS_ADULT,
  },
  {
    id: "medias",
    category: "ropa",
    model: "socks",
    name: "Medias de fútbol",
    blurb: "Largas, con planta acolchada y puño que no se cae.",
    price: 2.8,
    dozen: 2.2,
    variants: SOLID([
      ["negro", "Negro", "#141414", "#2fd65f"],
      ["blanco", "Blanco", "#f4f6f8", "#1f56d6"],
      ["rojo", "Rojo", "#d61f2c", "#ffffff"],
      ["azul", "Azul", "#1f56d6", "#ffffff"],
      ["amarillo", "Amarillo", "#ffd21f", "#141414"],
    ]),
    sizes: ["Niño", "Adulto"],
  },
  {
    id: "calentador",
    category: "ropa",
    model: "jacket",
    name: "Calentador deportivo",
    blurb: "Chompa con cierre y pantalón. Para el frío de la Sierra antes del partido.",
    price: 26.9,
    dozen: 23,
    variants: SOLID([
      ["negro", "Negro y verde", "#16181a", "#2fd65f"],
      ["azul", "Azul marino", "#16264f", "#ffffff"],
      ["rojo", "Rojo vino", "#6e1420", "#ffd21f"],
      ["gris", "Gris", "#5b6066", "#141414"],
    ]),
    sizes: KIDS_ADULT,
  },
  {
    id: "balon-laminado",
    category: "balones",
    model: "ball",
    name: "Balón #5 laminado",
    blurb: "Cosido a máquina, para cancha de tierra o césped. El de todos los días.",
    price: 17.9,
    dozen: 15.5,
    variants: SOLID([
      ["clasico", "Blanco y negro", "#f4f6f8", "#141414"],
      ["verde", "Blanco y verde", "#f4f6f8", "#1f9e48"],
      ["naranja", "Naranja y negro", "#ff6b1a", "#141414"],
    ]),
  },
  {
    id: "balon-pro",
    category: "balones",
    model: "ball",
    name: "Balón #5 termosellado",
    blurb: "Paneles sellados con calor: no absorbe agua y vuela recto. Para partido.",
    price: 34.9,
    dozen: 30,
    variants: SOLID([
      ["blanco", "Blanco y azul", "#f4f6f8", "#1f56d6"],
      ["dorado", "Blanco y dorado", "#f4f6f8", "#c99a2e"],
    ]),
    tag: "Partido",
  },
  {
    id: "balon-indor",
    category: "balones",
    model: "ball",
    name: "Balón de indor #4",
    blurb: "Bote bajo para indor y fútbol sala, en cancha de cemento o sintética.",
    price: 16.5,
    dozen: 14,
    variants: SOLID([
      ["amarillo", "Amarillo y azul", "#ffd21f", "#1d3fa8"],
      ["rojo", "Rojo y blanco", "#d61f2c", "#f4f6f8"],
    ]),
  },
  {
    id: "pupos",
    category: "calzado",
    model: "boot",
    name: "Pupos para césped",
    blurb: "Tacos para césped natural y tierra firme, con capellada sintética.",
    price: 32.9,
    dozen: 29,
    variants: SOLID([
      ["verde", "Verde y negro", "#2fd65f", "#141414"],
      ["negro", "Negro y blanco", "#16181a", "#f4f6f8"],
      ["azul", "Azul y naranja", "#1f56d6", "#ff6b1a"],
    ]),
    sizes: FEET,
  },
  {
    id: "zapatos-indor",
    category: "calzado",
    model: "boot",
    name: "Zapatos de indor",
    blurb: "Suela plana de caucho que agarra en cemento y sintética.",
    price: 28.9,
    dozen: 25.5,
    variants: SOLID([
      ["blanco", "Blanco y rojo", "#f4f6f8", "#d61f2c"],
      ["negro", "Negro y verde", "#16181a", "#2fd65f"],
    ]),
    sizes: FEET,
  },
  {
    id: "canilleras",
    category: "proteccion",
    model: "shinguard",
    name: "Canilleras",
    blurb: "Livianas, con espuma por dentro. El par.",
    price: 5.9,
    dozen: 4.8,
    variants: SOLID([
      ["negro", "Negro", "#16181a", "#2fd65f"],
      ["blanco", "Blanco", "#f4f6f8", "#1f56d6"],
      ["rojo", "Rojo", "#d61f2c", "#141414"],
    ]),
    sizes: ["S", "M", "L"],
  },
  {
    id: "guantes",
    category: "proteccion",
    model: "gloves",
    name: "Guantes de arquero",
    blurb: "Palma de látex con buen agarre y muñequera ajustable.",
    price: 14.9,
    dozen: 12.5,
    variants: SOLID([
      ["verde", "Verde y negro", "#2fd65f", "#141414"],
      ["naranja", "Naranja y azul", "#ff6b1a", "#1d3fa8"],
    ]),
    sizes: ["7", "8", "9", "10"],
  },
  {
    id: "platillos",
    category: "entrenamiento",
    model: "cones",
    name: "Platillos x 10",
    blurb: "Conos planos de colores para marcar ejercicios. No se rompen si los pisas.",
    price: 5.5,
    dozen: 4.5,
    variants: SOLID([["mix", "Colores", "#ff6b1a", "#ffd21f"]]),
  },
  {
    id: "escalera",
    category: "entrenamiento",
    model: "ladder",
    name: "Escalera de agilidad",
    blurb: "Seis metros con peldaños regulables y bolso para guardarla.",
    price: 11.9,
    dozen: 10.5,
    variants: SOLID([["amarillo", "Amarillo", "#ffd21f", "#141414"]]),
  },
  {
    id: "petos",
    category: "entrenamiento",
    model: "bib",
    name: "Petos de entrenamiento",
    blurb: "Chalecos de malla para dividir equipos. Se ven desde lejos.",
    price: 2.5,
    dozen: 2,
    variants: SOLID([
      ["verde", "Verde", "#2fd65f", "#141414"],
      ["naranja", "Naranja", "#ff6b1a", "#141414"],
      ["azul", "Azul", "#1f56d6", "#ffffff"],
    ]),
  },
  {
    id: "mini-arco",
    category: "entrenamiento",
    model: "goal",
    name: "Mini arco plegable",
    blurb: "1,8 × 1,2 m, se arma en un minuto. Para el patio o el entrenamiento.",
    price: 24.9,
    dozen: 21.9,
    variants: SOLID([["blanco", "Blanco", "#f4f6f8", "#2fd65f"]]),
  },
  {
    id: "cronometro",
    category: "tecnologia",
    model: "stopwatch",
    name: "Cronómetro digital",
    blurb: "Mide vueltas y tiempos de ejercicio. Resistente al agua, con cordón.",
    price: 7.9,
    dozen: 6.5,
    variants: SOLID([
      ["negro", "Negro", "#16181a", "#2fd65f"],
      ["azul", "Azul", "#1f56d6", "#ffffff"],
    ]),
  },
  {
    id: "inflador",
    category: "tecnologia",
    model: "pump",
    name: "Inflador eléctrico",
    blurb: "Infla un balón en segundos y se detiene solo a la presión que elijas. Recargable.",
    price: 22.9,
    dozen: 19.9,
    variants: SOLID([["negro", "Negro", "#1b1d20", "#2fd65f"]]),
    tag: "Nuevo",
  },
  {
    id: "pizarra",
    category: "tecnologia",
    model: "board",
    name: "Pizarra táctica",
    blurb: "Magnética, con fichas de dos colores y marcador borrable.",
    price: 14.9,
    dozen: 12.9,
    variants: SOLID([["verde", "Verde", "#1f8a3f", "#ffffff"]]),
  },
];

export const DOZEN = 12;

export const DELIVERY = [
  { id: "retiro", name: "Retiro en Otavalo", detail: "Gratis, en el local", price: 0 },
  { id: "imbabura", name: "Ibarra, Cotacachi y Atuntaqui", detail: "Entrega en 24 h", price: 2.5 },
  { id: "quito", name: "Quito", detail: "Entrega en 24 a 48 h", price: 3.5 },
  { id: "ecuador", name: "Resto de Ecuador", detail: "Por courier, 2 a 4 días", price: 6 },
];

export const FREE_SHIPPING = 120;
