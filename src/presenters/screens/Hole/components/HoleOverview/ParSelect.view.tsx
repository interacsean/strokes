import { PropsWithChildren } from "react";
import { Box } from "@chakra-ui/react";

export const PARS = [3, 4, 5];

/**
 * Lays the native par picker invisibly over whatever stands for the par, so
 * tapping it brings up the phone's own picker.
 */
export function ParSelect({
  par,
  setPar,
  children,
}: PropsWithChildren<{
  par: number | undefined;
  setPar: (par: number) => void;
}>) {
  return (
    <Box position="relative" display="inline-flex">
      {children}
      <select
        aria-label={par ? "Edit par" : "Set par"}
        onChange={(e) => {
          const parNum = parseInt(e.target.value, 10);
          if (parNum) setPar(parNum);
        }}
        value={par ?? ""}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: "pointer",
        }}
      >
        <option value="" disabled hidden>
          Set par
        </option>
        {PARS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </Box>
  );
}
