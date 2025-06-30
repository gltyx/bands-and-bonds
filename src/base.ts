export type Timer = {
  time?: number;
  duration: number;
  cb?: (timer: Timer) => void;
};

export type Band = {
  width: number;
  height: number;
  [x: number]: string;
};

export type RoomData = {
  // Everything specific to the current room. Deleted when leaving the room.
  damage: number;
  armorDamage: number;
  poison: number;
  kills: number;
};
export type RunData = {
  // Everything specific to the current run. Deleted when the run ends.
  weaponLevel: number;
  speedLevel: number;
  steps: number;
  turns: string[];
  gold: number;
  fruit: number; // Fruit collected in this run. Only for statistics.
  capturedAbilities: Ability[];
  room: RoomData;
  timers: Record<string, Timer>;
};

export type Settings = {
  blurImages: boolean;
  online: boolean;
  sound: boolean;
  teamId?: string;
}

export type Store = {
  run: RunData;
  band: Band;
  fruit: number;
  packs: number;
  unlocked: string[];
  discovered: string[];
  destination?: string, // Coordinate key for destination room.
  settings: Settings;
};

export type Turn = {
  title?: string; // Not included in Room.next, but added otherwise.
  label?: string; // The label of the next room.
  description?: string; // Description of the turn.
  skipConfirmation?: boolean;
};

export type Room = {
  x: number;
  y: number;
  type: string;
  name?: string;
  next?: Record<string, Turn>; // The path diverges.
  label?: string; // Referenced from "next", like a goto label.
  end?: boolean; // If true, this is the end of the path.
};

export type Ability = {
  name: string;
  image?: string;
  description: string | ((store: Store) => string);
  duration: number;
  damage?: number;
  consumes?: { [x: string]: number };
  onCompleted?: (store: DecoratedStore) => void;
  automatic?: boolean;
  tags?: string[];
  source?: { name: string; row: number; col: number }; // The friend this comes from.
};

export type Friend = {
  name: string;
  cost: number;
  description?: string;
  abilities?: Ability[];
  super?: Partial<Friend>;
  descriptionHtml?: string | Promise<string>;
  passiveEffects?: string[];
}

export type Enemy = {
  name: string;
  health: number;
  armor?: number;
  immune?: string[];
  regen?: number;
  count?: number;
  dodge?: number; // Attacks slower than this will miss. Chance to hit ramps to 100% as duration approaches 0.
  rewards?: { gold?: number, fruit?: number };
  abilities?: Ability[];
  passiveEffects?: string[];
  weaknesses?: string[];
};

const _numberFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
export function numberFormat(x: number) {
  return _numberFormat.format(x);
}
export function costOfPacks(packs: number): number {
  return Math.floor(1.2 ** packs) + packs;
}

export type DecoratedStore = Store & {
  currentEnemy?: Enemy;
  currentRoom: Room;
  currentPath: Room[];
  damage: (amount: number) => void;
};
