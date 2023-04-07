import { Flex, Input, Text } from "@chakra-ui/react";
import { metersToLon } from "presenters/utils/metersToLongitude";
import { useInput } from "presenters/utils/useInput/useInput";
import { LatLng } from "model/LatLng";
import { Dispatch, SetStateAction } from "react";

export
  function FakeGeo({ setPos, pos }: { pos: LatLng, setPos: Dispatch<SetStateAction<LatLng>> }) {
  const latInput = useInput({
    initValue: `${pos.lat}`, onBlur:
      value => setPos((curLatLng) => ({ ...curLatLng, lat: parseFloat(value) }))
  });
  const lngInput = useInput({
    initValue: `${pos.lng}`, onBlur:
      value => setPos((curLatLng) => ({ ...curLatLng, lng: parseFloat(value) }))
  });
  const altInput = useInput({
    initValue: `${pos.alt}`, onBlur:
      value => setPos((curLatLng) => ({ ...curLatLng, alt: parseFloat(value) }))
  });
  const latShiftInput = useInput({
    initValue: `0`, onBlur:
      value => {
        const newPos = pos.lat + parseFloat(value) / 111320;
        setPos((curLatLng) => ({ ...curLatLng, lat: newPos }))
        latInput.setCurrentValue(`${newPos}`)
      }
  });
  const lngShiftInput = useInput({
    initValue: `0`, onBlur:
      value => {
        const shiftInLng = metersToLon(parseFloat(value), pos.lat);
        const newPos = pos.lng + shiftInLng;
        setPos((curLatLng) => ({ ...curLatLng, lng: newPos }))
        lngInput.setCurrentValue(`${newPos}`)
      }
  });
  return <>
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
}
