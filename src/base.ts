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

export type Xaranthian = {
  factories: number;
  turtles: number;
  deployers: number;
  growers: number;
  guns: number;
};

export type RoomData = {
  // Everything specific to the current room. Deleted when leaving the room.
  damage: number;
  armorDamage: number;
  poison: number;
  kills: number;
  xaranthian: Xaranthian;
};
export type RunData = {
  // Everything specific to the current run. Deleted when the run ends.
  weaponLevel: number;
  speedLevel: number;
  desertBlessingMultiplier: number;
  steps: number;
  turns: string[];
  gold: number;
  fruit: number; // Fruit collected in this run. Added to team.fruit on retreat.
  saplings: number;
  skips: number;
  capturedMonsters: string[];
  room: RoomData;
  timers: Record<string, Timer>;
  skipTime: number; // Time to skip in the next frame, for time-skip abilities.
};

export type Settings = {
  blurImages: boolean;
  online: boolean;
  sound: boolean;
  teamId?: string;
}

export type LocalData = {
  band: Band;
  destination?: string, // Coordinate key for destination room.
  settings: Settings;
}

export type TeamData = {
  fruit: number;
  packs: number;
  bestWeaponLevel: number;
  unlocked: string[];
  discovered: string[];
  name: string;
}

export type Store = {
  run: RunData;
  local: LocalData;
  team: TeamData;
  currentEnemy: () => Enemy | undefined;
  currentRoom: () => Room;
  currentPath: () => Room[];
  addDamage: (amount: number) => void;
  addPoison: (amount: number) => void;
  bandByName: () => Record<string, { row: number; col: number }>;
  onboard: (name: string) => { row: number; col: number } | undefined;
  emptySpacesAround: (row: number, col: number) => { row: number; col: number }[];
  available: (row: number, col: number) => boolean;
  lightRadius: () => string;
  getRewards: (enemy: Enemy) => { gold: number; fruit: number };
  takeTurn: (turn: string) => void;
  fruitMultiplier: () => number;
};

export type Turn = {
  title?: string; // Not included in Room.next, but added otherwise.
  label?: string; // The label of the next room.
  description?: string; // Description of the turn.
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
  hidden?: ((store: Store) => boolean);
  description: string | ((store: Store) => string);
  duration: number;
  damage?: number | ((store: Store) => number);
  consumes?: { [x: string]: number } | ((store: Store) => { [x: string]: number });
  onCompleted?: (store: Store) => void;
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
  onAdded?: (store: Store) => void;
  onRemoved?: (store: Store) => void;
}

export type Enemy = {
  name: string;
  health: number;
  armor?: number;
  immune?: string[];
  regen?: number;
  count?: number;
  dodge?: number; // Attacks slower than this will miss. Chance to hit ramps to 100% as duration approaches 0.
  ethereal?: boolean;
  rewards?: { gold?: number, fruit?: number };
  abilities?: Ability[];
  passiveEffects?: string[];
  weaknesses?: string[];
};

const _numberFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
export function numberFormat(x: number) {
  if (x > 1_000_000_000) {
    return `${_numberFormat.format(x / 1_000_000_000)} B`;
  }
  return _numberFormat.format(x);
}
export function costOfPacks(packs: number): number {
  return Math.floor(0.00000001 * packs ** 7 + packs);
}
