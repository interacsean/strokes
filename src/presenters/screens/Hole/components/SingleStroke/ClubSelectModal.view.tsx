import { Button, Flex } from "@chakra-ui/react";
import { Club } from "model/Club";
import { ClubStats } from "model/ClubStats";
import { Modal } from "presenters/components/Modal/Modal";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useMemo } from "react";

type ClubSelectModalProps = {
  clubs: {
    club: Club;
    clubImage?: string;
  }[];
  selectClub: (clubId: Club) => void;
  cancel: () => void;
  clubStats: ClubStats;
  distanceUnit: string;
  distToTarget: number | null;
};

export function ClubSelectModal(props: ClubSelectModalProps) {
  const { distToTarget } = props;
  const closestClub = useMemo(() => {
    if (distToTarget === null) return null;
    let closestClub = Club.D;
    let closestDist = 9999;
    props.clubs.forEach((club) => {
      const distMax = props.clubStats[club.club]?.Full?.sd1Distances[1];
      const distMed = props.clubStats[club.club]?.Full?.medianDistance;
      if ((distMax || distMed || 0) < distToTarget) return;
      const dist = distMed || 0;
      const diff = Math.abs(dist - distToTarget);
      if (diff < closestDist) {
        closestDist = diff;
        closestClub = club.club;
      }
    });
    return closestClub;
  }, [props.clubStats, distToTarget]);

  return (
    <Modal onClose={props.cancel}>
      <Flex justifyContent="flex-start" mb={4} flexDir="column">
        {props.clubs.map((club) => {
          const distMin = props.clubStats[club.club]?.Full?.sd1Distances[0];
          const distMax = props.clubStats[club.club]?.Full?.sd1Distances[1];
          const distMed = props.clubStats[club.club]?.Full?.medianDistance;
          const slx = club.club === closestClub ? <ArrowForwardIcon /> : "";
          return (
            <Button
              key={club.club}
              variant="ghost"
              fontWeight={club.club === closestClub ? "bold" : "normal"}
              onClick={() => props.selectClub(club.club)}
            >
              {slx}
              {club.club}
              {distMed && (
                <>
                  {" "}
                  - {distMin ? `${distMin}-[` : ""}
                  {distMed}
                  {props.distanceUnit}
                  {distMax ? `]-${distMax}` : ""}
                </>
              )}
            </Button>
          );
        })}
      </Flex>
    </Modal>
  );
}
