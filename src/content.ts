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

export type Variant = { id: string; name: string; main: string; second: string; photo?: string };

export type Product = {
  id: string;
  category: CategoryId;
  name: string;
  blurb: string;
  price: number;
  dozen: number;
  variants: Variant[];
  sizes?: string[];
  custom?: boolean;
  tag?: string;
};

const DESIGNS = (product: string, list: [string, string, string, string][], first = false): Variant[] =>
  list.map(([id, name, main, second], i) => ({ id, name, main, second, photo: i || first ? `${product}-${id}` : undefined }));

const SOLID = (list: [string, string, string, string][]): Variant[] => list.map(([id, name, main, second]) => ({ id, name, main, second }));

const ADULT = ["S", "M", "L", "XL", "XXL"];
const KIDS_ADULT = ["6", "8", "10", "12", "14", ...ADULT];
const FEET = ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];

// USD con IVA, referencia de Otavalo y Quito (2026)
export const PRODUCTS: Product[] = [
  {
    id: "uniforme",
    category: "uniformes",
    name: "Uniforme sublimado",
    blurb: "Camiseta y pantaloneta en tela deportiva que respira. Número y nombre sin costo. Antes de producir te enviamos el diseño por WhatsApp.",
    price: 12.5,
    dozen: 10.5,
    variants: DESIGNS("uniforme", [
      ["negro", "Negro y dorado", "#141414", "#d8b04a"],
      ["amarillo", "Amarillo y negro", "#f2c418", "#141414"],
      ["azul", "Azul y blanco", "#1f56d6", "#ffffff"],
      ["rojo", "Rojo y negro", "#d61f2c", "#111111"],
      ["verde", "Verde y negro", "#1f8a3f", "#111111"],
      ["blanco", "Blanco, rojo y azul", "#f4f6f8", "#d61f2c"],
    ]),
    sizes: KIDS_ADULT,
    custom: true,
    tag: "Más pedido",
  },
  {
    id: "camiseta",
    category: "uniformes",
    name: "Camiseta de equipo",
    blurb: "Sublimada con escudo y auspiciantes, de secado rápido. Ideal para ligas barriales y campeonatos.",
    price: 8.5,
    dozen: 7,
    variants: DESIGNS("camiseta", [
      ["negro", "Negro y dorado", "#141414", "#d8b04a"],
      ["blanco", "Blanco, rojo y azul", "#f4f6f8", "#1f56d6"],
      ["azul", "Azul", "#1f56d6", "#0d2a6e"],
      ["verde", "Verde agua", "#5fd6b0", "#ffd21f"],
      ["rojo", "Rojo y negro", "#d61f2c", "#111111"],
      ["naranja", "Naranja", "#ff6b1a", "#141414"],
    ]),
    sizes: KIDS_ADULT,
    custom: true,
  },
  {
    id: "pantaloneta",
    category: "uniformes",
    name: "Pantaloneta",
    blurb: "Sublimada en los colores de tu equipo. Liviana, con elástico y cordón.",
    price: 5.5,
    dozen: 4.5,
    variants: DESIGNS("pantaloneta", [
      ["azul", "Azul", "#1f56d6", "#ffffff"],
      ["negro", "Negro y dorado", "#141414", "#d8b04a"],
      ["blanco", "Blanco", "#f4f6f8", "#d9dde2"],
    ]),
    sizes: KIDS_ADULT,
  },
  {
    id: "medias",
    category: "ropa",
    name: "Medias de fútbol",
    blurb: "Largas, con planta acolchada y puño que no se cae.",
    price: 2.8,
    dozen: 2.2,
    variants: SOLID([["rojo", "Rojo", "#d61f2c", "#ffffff"]]),
    sizes: ["Niño", "Adulto"],
  },
  {
    id: "calentador",
    category: "ropa",
    name: "Calentador deportivo",
    blurb: "Chompa con cierre y pantalón. Para el frío de la Sierra antes del partido.",
    price: 26.9,
    dozen: 23,
    variants: SOLID([["azul", "Azul marino y naranja", "#16264f", "#ff6b1a"]]),
    sizes: KIDS_ADULT,
  },
  {
    id: "balon-laminado",
    category: "balones",
    name: "Balón #5 laminado",
    blurb: "Cosido a máquina, para cancha de tierra o césped. El de todos los días.",
    price: 17.9,
    dozen: 15.5,
    variants: SOLID([["clasico", "Blanco y negro", "#f4f6f8", "#141414"]]),
  },
  {
    id: "balon-pro",
    category: "balones",
    name: "Balón #5 termosellado",
    blurb: "Paneles sellados con calor: no absorbe agua y vuela recto. Para partido.",
    price: 34.9,
    dozen: 30,
    variants: SOLID([["negro", "Blanco y negro", "#f4f6f8", "#141414"]]),
    tag: "Partido",
  },
  {
    id: "balon-indor",
    category: "balones",
    name: "Balón de indor #4",
    blurb: "Bote bajo para indor y fútbol sala, en cancha de cemento o sintética.",
    price: 16.5,
    dozen: 14,
    variants: SOLID([["amarillo", "Amarillo", "#e3e83a", "#1f9e48"]]),
  },
  {
    id: "pupos",
    category: "calzado",
    name: "Pupos para césped",
    blurb: "Tacos para césped natural y tierra firme, con capellada sintética.",
    price: 32.9,
    dozen: 29,
    variants: SOLID([["turquesa", "Turquesa", "#5fd6c8", "#e8f4f2"]]),
    sizes: FEET,
  },
  {
    id: "zapatos-indor",
    category: "calzado",
    name: "Zapatos de indor",
    blurb: "Suela plana de caucho que agarra en cemento y sintética.",
    price: 28.9,
    dozen: 25.5,
    variants: SOLID([["gris", "Gris y caramelo", "#5b6066", "#d9893f"]]),
    sizes: FEET,
  },
  {
    id: "canilleras",
    category: "proteccion",
    name: "Canilleras",
    blurb: "Livianas, con espuma por dentro. El par.",
    price: 5.9,
    dozen: 4.8,
    variants: SOLID([["negro", "Negro y rojo", "#16181a", "#d61f2c"]]),
    sizes: ["S", "M", "L"],
  },
  {
    id: "guantes",
    category: "proteccion",
    name: "Guantes de arquero",
    blurb: "Palma de látex con buen agarre y muñequera ajustable.",
    price: 14.9,
    dozen: 12.5,
    variants: SOLID([["negro", "Negro y azul", "#16181a", "#1f56d6"]]),
    sizes: ["7", "8", "9", "10"],
  },
  {
    id: "platillos",
    category: "entrenamiento",
    name: "Platillos x 20",
    blurb: "Conos planos de colores para marcar ejercicios, con soporte para llevarlos. No se rompen si los pisas.",
    price: 7.9,
    dozen: 6.5,
    variants: SOLID([["mix", "Colores", "#ff6b1a", "#ffd21f"]]),
  },
  {
    id: "escalera",
    category: "entrenamiento",
    name: "Escalera de agilidad",
    blurb: "Seis metros con peldaños regulables y bolso para guardarla.",
    price: 11.9,
    dozen: 10.5,
    variants: SOLID([["amarillo", "Amarillo", "#ffd21f", "#141414"]]),
  },
  {
    id: "petos",
    category: "entrenamiento",
    name: "Petos de entrenamiento",
    blurb: "Chalecos de malla para dividir equipos. Se ven desde lejos.",
    price: 2.5,
    dozen: 2,
    variants: DESIGNS(
      "petos",
      [
        ["naranja", "Naranja", "#ff6b1a", "#141414"],
        ["verde", "Verde", "#2fd65f", "#141414"],
      ],
      true,
    ),
  },
  {
    id: "mini-arco",
    category: "entrenamiento",
    name: "Mini arcos plegables",
    blurb: "El par. Se abren solos y se doblan en segundos. 1,2 × 0,8 m, con estacas y bolso.",
    price: 24.9,
    dozen: 21.9,
    variants: SOLID([["azul", "Azul", "#1f56d6", "#f4f6f8"]]),
  },
  {
    id: "cronometro",
    category: "tecnologia",
    name: "Cronómetro digital",
    blurb: "Mide vueltas y tiempos de ejercicio. Resistente al agua, con cordón.",
    price: 7.9,
    dozen: 6.5,
    variants: SOLID([["negro", "Negro", "#16181a", "#2fd65f"]]),
  },
  {
    id: "inflador",
    category: "tecnologia",
    name: "Inflador de pie",
    blurb: "Bomba con aguja para balones. Infla en segundos y también sirve para la bici.",
    price: 11.9,
    dozen: 9.9,
    variants: SOLID([["negro", "Negro", "#1b1d20", "#2fd65f"]]),
  },
  {
    id: "pizarra",
    category: "tecnologia",
    name: "Pizarra táctica",
    blurb: "Magnética, con fichas de dos colores y marcador borrable.",
    price: 14.9,
    dozen: 12.9,
    variants: SOLID([["verde", "Verde", "#1f8a3f", "#ffffff"]]),
  },
];

export const photo = (p: Product, width: 600 | 1200, v?: Variant) => `/productos/${v?.photo ?? p.id}-${width}.webp`;
export const photoSet = (p: Product, v?: Variant) => `${photo(p, 600, v)} 600w, ${photo(p, 1200, v)} 1200w`;

export const DOZEN = 12;

export const DELIVERY = [
  { id: "retiro", name: "Retiro en Otavalo", detail: "Gratis, en el local", price: 0 },
  { id: "imbabura", name: "Ibarra, Cotacachi y Atuntaqui", detail: "Entrega en 24 h", price: 2.5 },
  { id: "quito", name: "Quito", detail: "Entrega en 24 a 48 h", price: 3.5 },
  { id: "ecuador", name: "Resto de Ecuador", detail: "Por courier, 2 a 4 días", price: 6 },
];

export const FREE_SHIPPING = 120;
