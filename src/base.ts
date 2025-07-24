export type Timer = {
  time?: number;
  duration: number;
  cost: { gold: number; fruit: number };
  automatic?: boolean;
  attack?: boolean; // Effects like speed level only apply to attacks.
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
  weaponLevelAdded: number;
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

export type AbilityEffects = {
  damageMultiplier: number; // Total multiplier.
  weaknessMultiplier: number; // For information.
  hitChance: number;
  rndHits(numAttacks: number): number; // Returns the random number of hits based on the hit chance.
};

export type Store = {
  run: RunData;
  local: LocalData;
  team: TeamData;
  startTimer: (key: string, timer: Timer) => void;
  timerFinished: (key: string, timer: Timer, times: number) => void;
  currentEnemy: () => Enemy | undefined;
  currentRoom: () => Room;
  currentPath: () => Room[];
  addDamage: (amount: number, times: number) => void;
  addPoison: (amount: number) => void;
  bandByName: () => Record<string, { row: number; col: number }>;
  onboard: (name: string) => { row: number; col: number } | undefined;
  emptySpacesAround: (row: number, col: number) => { row: number; col: number }[];
  available: (row: number, col: number) => boolean;
  lightRadius: () => string;
  getRewards: (enemy: Enemy) => { gold: number; fruit: number };
  takeTurn: (turn: string) => void;
  fruitMultiplier: () => number;
  abilityEffects: (ab: Ability) => AbilityEffects;
  weaponLevel: () => number;
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
  description: string | ((store: Store, self: Ability) => string);
  duration: number | ((store: Store) => number);
  damage?: number | ((store: Store) => number);
  consumes?: { [x: string]: number } | ((store: Store) => { [x: string]: number });
  onCompleted?: (store: Store, times: number, self: Ability) => void;
  preventRepeat?: boolean; // If true, fire at most once per tick. Use it if "consumes" is not fixed!
  automatic?: boolean;
  tags?: string[];
  peaceful?: boolean; // If true, can be used outside of combat.
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
  ethereal?: boolean;
  rewards?: { gold?: number, fruit?: number };
  abilities?: Ability[];
  passiveEffects?: string[];
  weaknesses?: string[];
  slowTime?: number;
};

const _numberFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
export function numberFormat(x: number) {
  if (x > 9_999_999_999) {
    return `${_numberFormat.format(x / 1_000_000_000)} B`;
  }
  return _numberFormat.format(x);
}
export function costOfPacks(packs: number): number {
  return Math.floor(0.00000001 * packs ** 7 + packs);
}
