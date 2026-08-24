export const menuCrepes = [
  { id: "monet", name: "Monet", type: "Salgado", price: 44.99, time: "12–15 min", base: "Tradicional", highlight: "Carne + bacon", calories: 720, protein: 32, image: "/images/jaime/monet-cutout-v2.png", color: "green" },
  { id: "matisse", name: "Matisse", type: "Salgado", price: 44.99, time: "12–15 min", base: "Tradicional", highlight: "Frango cremoso", calories: 650, protein: 29, image: "/images/jaime/matisse-cutout-v2.png", color: "red" },
  { id: "chapelle", name: "Chapelle", type: "Salgado", price: 42.99, time: "10–12 min", base: "Tradicional", highlight: "Brócolis", calories: 540, protein: 19, image: "/images/jaime/chapelle-cutout-v2.png", color: "navy" },
  { id: "cezanne", name: "Cezanne", type: "Salgado", price: 42.99, time: "12–14 min", base: "Tradicional", highlight: "Bacon + Doritos", calories: 760, protein: 26, image: "/images/jaime/cezanne-cutout-v2.png", color: "navy" },
  { id: "lucie", name: "Lucie", type: "Doce", price: 40.99, time: "10–12 min", base: "Baunilha", highlight: "KitKat", calories: 680, protein: 12, image: "/images/jaime/lucie-cutout-v2.png", color: "red" },
  { id: "margot", name: "Margot", type: "Doce", price: 47.99, time: "10–12 min", base: "Chocolate", highlight: "Morango + Oreo", calories: 710, protein: 11, image: "/images/jaime/margot-cutout-v2.png", color: "cream" },
] as const;

export type MenuCrepe = (typeof menuCrepes)[number];
export type MenuCrepeId = MenuCrepe["id"];

export const customCrepeTypes = ["Salgado", "Doce"] as const;
export type CustomCrepeType = (typeof customCrepeTypes)[number];

export const customBasePrice = 18;
export const customBases: Record<CustomCrepeType, readonly string[]> = {
  Salgado: ["Tradicional"],
  Doce: ["Tradicional", "Chocolate"],
};

export const builderOptions: Record<CustomCrepeType, readonly { name: string; price: number }[]> = {
  Salgado: [
    { name: "Carne moída", price: 7 }, { name: "Frango", price: 7 }, { name: "Calabresa", price: 7 },
    { name: "Bacon", price: 5 }, { name: "Doritos", price: 5 }, { name: "Queijo prato", price: 5 },
    { name: "Requeijão", price: 5 }, { name: "Champignon", price: 5 }, { name: "Cheddar", price: 5 },
    { name: "Muçarela", price: 5 }, { name: "Batata palha", price: 5 }, { name: "Brócolis", price: 5 },
    { name: "Cebola roxa", price: 5 }, { name: "Tomate cereja", price: 5 },
  ],
  Doce: [
    { name: "Chocolate com avelã", price: 9 }, { name: "Chocolate branco", price: 9 }, { name: "Chocolate meio amargo", price: 9 },
    { name: "Frutas vermelhas", price: 9 }, { name: "Suspiro", price: 7 }, { name: "Farofa de Oreo", price: 7 },
    { name: "Kit Kat", price: 7 }, { name: "Ovomaltine", price: 7 }, { name: "Leite em pó", price: 7 },
    { name: "Nuts", price: 7 }, { name: "Morango", price: 7 }, { name: "Confete", price: 7 },
  ],
};

export type CartItem =
  | { kind: "menu"; id: MenuCrepeId; quantity: number }
  | { kind: "custom"; type: CustomCrepeType; dough: string; ingredients: string[]; quantity: number };

export const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function isMenuCrepeId(value: string): value is MenuCrepeId {
  return menuCrepes.some((item) => item.id === value);
}

export function isCustomCrepeType(value: string): value is CustomCrepeType {
  return customCrepeTypes.some((type) => type === value);
}

export function getCustomPrice(type: CustomCrepeType, ingredients: string[]) {
  const allowed = new Map(builderOptions[type].map((option) => [option.name, option.price]));
  return customBasePrice + [...new Set(ingredients)].reduce((total, ingredient) => total + (allowed.get(ingredient) ?? 0), 0);
}

export function getCartLine(item: CartItem) {
  if (item.kind === "menu") {
    const crepe = menuCrepes.find((entry) => entry.id === item.id);
    if (!crepe) throw new Error("Crepe inválido.");
    return { title: crepe.name, description: crepe.highlight, unitPrice: crepe.price };
  }

  return {
    title: `Crêpe personalizado · ${item.type}`,
    description: [item.dough, ...item.ingredients].join(" · ") || "Massa tradicional",
    unitPrice: getCustomPrice(item.type, item.ingredients),
  };
}

export function getCartTotal(cart: CartItem[]) {
  return cart.reduce((total, item) => total + getCartLine(item).unitPrice * item.quantity, 0);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getQuantity(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= 20 ? value : 1;
}

export function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry): CartItem[] => {
    if (!isRecord(entry) || typeof entry.kind !== "string") return [];

    if (entry.kind === "menu" && typeof entry.id === "string" && isMenuCrepeId(entry.id)) {
      return [{ kind: "menu", id: entry.id, quantity: getQuantity(entry.quantity) }];
    }

    if (entry.kind === "custom" && typeof entry.type === "string" && isCustomCrepeType(entry.type) && typeof entry.dough === "string" && customBases[entry.type].includes(entry.dough) && Array.isArray(entry.ingredients) && entry.ingredients.every((ingredient) => typeof ingredient === "string")) {
      const allowedIngredients = new Set(builderOptions[entry.type].map((option) => option.name));
      const rawIngredients = entry.ingredients.filter((ingredient): ingredient is string => typeof ingredient === "string");
      const ingredients = [...new Set(rawIngredients)].filter((ingredient) => allowedIngredients.has(ingredient));
      return [{ kind: "custom", type: entry.type, dough: entry.dough, ingredients, quantity: getQuantity(entry.quantity) }];
    }

    return [];
  });
}

