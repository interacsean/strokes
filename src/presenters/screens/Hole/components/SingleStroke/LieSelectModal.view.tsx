import { Button, Flex } from "@chakra-ui/react";
import { Lie } from "model/Lie";

type LieSelectModalprops = {
  selectLie: (lie: Lie) => void;
};

const liesSet: Record<Lie, Lie> = {
  [Lie.TEE]: Lie.TEE, // ? how to deal with the multiple tees
  [Lie.TEE_GRASS]: Lie.TEE_GRASS,
  [Lie.FAIRWAY]: Lie.FAIRWAY,
  [Lie.LIGHT_ROUGH]: Lie.LIGHT_ROUGH,
  [Lie.DEEP_ROUGH]: Lie.DEEP_ROUGH,
  [Lie.BUNKER]: Lie.BUNKER,
  [Lie.GREEN]: Lie.GREEN,
  [Lie.FRINGE]: Lie.FRINGE,
  [Lie.WATER]: Lie.WATER,
  [Lie.HAZARD]: Lie.HAZARD,
};
const lies: Lie[] = Object.values(liesSet);

export function LieSelectModal(props: LieSelectModalprops) {
  return (
    <Flex flexDir={"column"} alignItems={"stretch"} columnGap={2}>
      {lies.map((lie) => (
        // todo: lie image
        <Button key={lie} variant="ghost" onClick={() => props.selectLie(lie)}>
          {lie}
        </Button>
      ))}
    </Flex>
  );
}
