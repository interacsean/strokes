import { Flex, Button } from '@chakra-ui/react';

type Props = {};

export function Home(props: Props) {
  return (
    <Flex flexDirection={'column'} alignItems={'stretch'}>
      <Button>New</Button>
    </Flex>
  );
};
