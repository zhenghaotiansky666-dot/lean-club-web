import { UNLOCK_STORAGE_KEY } from "./constants";

export interface UnlockState {
  /** 9.9 元排行榜门票 */
  ticket: boolean;
  /** 100 元 21 天挑战押金 */
  deposit: boolean;
  ticketOrderId?: string;
  depositOrderId?: string;
  since?: string;
}

export const EMPTY_UNLOCK: UnlockState = { ticket: false, deposit: false };

let cache: UnlockState | null = null;
const listeners = new Set<() => void>();

function read(): UnlockState {
  if (typeof window === "undefined") return EMPTY_UNLOCK;
  try {
    const raw = window.localStorage.getItem(UNLOCK_STORAGE_KEY);
    if (!raw) return EMPTY_UNLOCK;
    return { ...EMPTY_UNLOCK, ...(JSON.parse(raw) as Partial<UnlockState>) };
  } catch {
    return EMPTY_UNLOCK;
  }
}

function emit() {
  listeners.forEach((l) => l());
}

/** localStorage 作为外部数据源，配合 useSyncExternalStore 使用（hydration 安全） */
export const unlockStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === UNLOCK_STORAGE_KEY) {
        cache = read();
        emit();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  /** 客户端快照（必须返回稳定引用，因此缓存起来） */
  getSnapshot(): UnlockState {
    if (cache === null) cache = read();
    return cache;
  },
  /** 服务端预渲染快照：一律未解锁 */
  getServerSnapshot(): UnlockState {
    return EMPTY_UNLOCK;
  },
  set(next: UnlockState) {
    cache = next;
    try {
      window.localStorage.setItem(UNLOCK_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* 无痕模式等场景忽略 */
    }
    emit();
  },
};
