import type { CakeFlavour, CakeSize } from "@/types";

export type Occasion =
  | "Birthday"
  | "Wedding"
  | "Graduation"
  | "Baby Shower"
  | "Corporate"
  | "Anniversary"
  | "Other";

export type Filling = "Buttercream" | "Ganache" | "Cream Cheese" | "Fruit" | "Caramel" | "Jam";

export type DecorationStyle = "Fondant" | "Buttercream" | "Text" | "Topper" | "Candles" | "Flowers";

export type BuilderPhoto = {
  id: string;
  url: string;
  name: string;
};

export type FulfilmentType = "pickup" | "delivery";

export type DecorationState = {
  color: string;
  theme: string;
  styles: DecorationStyle[];
  message: string;
};

export type EventInfoState = {
  date: string; // ISO yyyy-mm-dd
  time: string;
  guests: string;
  fulfilment: FulfilmentType;
  venueOrAddress: string;
  instructions: string;
};

export type BuilderState = {
  occasion: Occasion | null;
  size: CakeSize | null;
  flavours: CakeFlavour[];
  filling: Filling | null;
  decoration: DecorationState;
  photos: BuilderPhoto[];
  event: EventInfoState;
};

export const INITIAL_BUILDER_STATE: BuilderState = {
  occasion: null,
  size: null,
  flavours: [],
  filling: null,
  decoration: { color: "", theme: "", styles: [], message: "" },
  photos: [],
  event: {
    date: "",
    time: "",
    guests: "",
    fulfilment: "pickup",
    venueOrAddress: "",
    instructions: "",
  },
};

export const STEP_LABELS = [
  "Occasion",
  "Size",
  "Flavour",
  "Filling",
  "Decoration",
  "Photos",
  "Event Info",
  "Quote",
] as const;

export const TOTAL_STEPS = STEP_LABELS.length;
