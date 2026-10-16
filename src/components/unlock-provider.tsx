"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  EMPTY_UNLOCK,
  unlockStore,
  type UnlockState,
} from "@/lib/unlock-store";

interface UnlockContextValue extends UnlockState {
  unlockTicket: (orderId?: string) => void;
  unlockDeposit: (orderId?: string) => void;
  reset: () => void;
}

const UnlockContext = createContext<UnlockContextValue | null>(null);

export function UnlockProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(
    unlockStore.subscribe,
    unlockStore.getSnapshot,
    unlockStore.getServerSnapshot,
  );

  const persist = useCallback((next: UnlockState) => {
    unlockStore.set(next);
  }, []);

  const unlockTicket = useCallback(
    (orderId?: string) =>
      persist({
        ...state,
        ticket: true,
        ticketOrderId: orderId ?? state.ticketOrderId,
        since: state.since ?? new Date().toISOString(),
      }),
    [persist, state],
  );

  const unlockDeposit = useCallback(
    (orderId?: string) =>
      persist({
        ...state,
        ticket: true,
        deposit: true,
        depositOrderId: orderId ?? state.depositOrderId,
        since: state.since ?? new Date().toISOString(),
      }),
    [persist, state],
  );

  const reset = useCallback(() => persist(EMPTY_UNLOCK), [persist]);

  const value = useMemo<UnlockContextValue>(
    () => ({ ...state, unlockTicket, unlockDeposit, reset }),
    [state, unlockTicket, unlockDeposit, reset],
  );

  return (
    <UnlockContext.Provider value={value}>{children}</UnlockContext.Provider>
  );
}

export function useUnlock(): UnlockContextValue {
  const ctx = useContext(UnlockContext);
  if (!ctx) {
    throw new Error("useUnlock 必须在 <UnlockProvider> 内使用");
  }
  return ctx;
}
