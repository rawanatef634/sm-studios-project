import { useEffect } from "react";
import { initHeronSignal } from "@heronsignal/web";

let hasInitializedHeronSignal = false;

export default function HeronSignalProvider() {
  useEffect(() => {
    if (hasInitializedHeronSignal) return;

    hasInitializedHeronSignal = true;
    void initHeronSignal({ publicKey: "pk_3c_K1ROzpMcCFeP57vB6S_Cc3jg5Gv7r" });
  }, []);

  return null;
}
