import { LatLng } from "model/LatLng";
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface FakeGpsContextProps {
  fakePos: LatLng;
  setFakePos: (newPos: Partial<LatLng>) => void;
  setFakePosFromMap: boolean;
  setSetFakePosFromMap: (value: boolean) => void;
}

const FakeGpsContext = createContext<FakeGpsContextProps | undefined>(
  undefined
);

export const FakeGpsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [fakePos, setFakePos] = useState<LatLng>({
    lat: -37.758007544374024,
    lng: 144.98399686860003,
    alt: 45,
  });
  const [setFakePosFromMap, setSetFakePosFromMap] = useState(false);

  const setPartialFakeGps = (newPos: Partial<LatLng>) => {
    setFakePos((prev) => ({ ...prev, ...newPos }));
  };

  return (
    <FakeGpsContext.Provider
      value={{
        fakePos,
        setFakePos: setPartialFakeGps,
        setFakePosFromMap,
        setSetFakePosFromMap,
      }}
    >
      {children}
    </FakeGpsContext.Provider>
  );
};

export const useFakeGps = () => {
  const context = useContext(FakeGpsContext);
  if (!context) {
    throw new Error("useFakeGps must be used within a FakeGpsProvider");
  }
  return context;
};
