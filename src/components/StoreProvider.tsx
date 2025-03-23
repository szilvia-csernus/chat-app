"use client";
import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/redux-store/store";

type Props = {
  children: ReactNode;
};

export default function StoreProvider({
  children,
}: Props) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Creates the redux store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
