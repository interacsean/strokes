import { useEffect, useRef } from "react";

export function useWhatChanged(props: any) {
  const lastProps = useRef(props);
  useEffect(
    () => {
      let whatChanged = {};
      Object.entries(props).forEach(([propName, propVal]) => {
        // @ts-ignore
        if (propVal !== lastProps[propName]) {
          // @ts-ignore
          whatChanged[propName] = propVal;
        }
        // @ts-ignore
        lastProps[propName] = propVal;
      });
      if (Object.keys(whatChanged).length > 0) {
        console.log("What Changed:", whatChanged);
      }
    },
    // eslint-disable-next-line
    [...Object.values(props)]
  );
}
