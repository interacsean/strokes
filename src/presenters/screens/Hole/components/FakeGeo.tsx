import { Flex, Input, Text } from "@chakra-ui/react";
import { metersToLon } from "presenters/utils/metersToLongitude";
import { useInput } from "presenters/utils/useInput/useInput";
import { LatLng } from "model/LatLng";
import { Dispatch, SetStateAction } from "react";
import { useFakeGps } from "presenters/components/FakePos/FakePosContext";

export function FakeGeo() {
  const { fakePos: pos, setFakePos: setPos } = useFakeGps();
  const latInput = useInput({
    initValue: `${pos.lat}`,
    onBlur: (value) => setPos({ lat: parseFloat(value) }),
  });
  const lngInput = useInput({
    initValue: `${pos.lng}`,
    onBlur: (value) => setPos({ lng: parseFloat(value) }),
  });
  const altInput = useInput({
    initValue: `${pos.alt}`,
    onBlur: (value) => setPos({ alt: parseFloat(value) }),
  });
  const latShiftInput = useInput({
    initValue: `0`,
    onBlur: (value) => {
      const newPos = pos.lat + parseFloat(value) / 111320;
      setPos({ lat: newPos });
      latInput.setCurrentValue(`${newPos}`);
    },
  });
  const lngShiftInput = useInput({
    initValue: `0`,
    onBlur: (value) => {
      const shiftInLng = metersToLon(parseFloat(value), pos.lat);
      const newPos = pos.lng + shiftInLng;
      setPos({ lng: newPos });
      lngInput.setCurrentValue(`${newPos}`);
    },
  });
  return (
    <>
      <Flex mt={4} columnGap={2}>
        <Text>Pos</Text>
        <Input {...latInput.inputProps} />
        <Input {...lngInput.inputProps} />
        <Input {...altInput.inputProps} />
      </Flex>
      <Flex mt={4} columnGap={2}>
        <Text>Shift (m)</Text>
        <Input {...latShiftInput.inputProps} />
        <Input {...lngShiftInput.inputProps} />
      </Flex>
    </>
  );
}
