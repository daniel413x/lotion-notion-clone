import {
  useState, useRef, ElementRef, useCallback,
} from 'react';
import { useEventListener, useIsomorphicLayoutEffect } from 'usehooks-ts';

const useTrackRefDimensions = () => {
  const ref = useRef<ElementRef<'object'>>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const handleSize = useCallback(() => {
    if (ref.current) {
      setWidth(ref.current.clientWidth);
      setHeight(ref.current.clientHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.current?.offsetHeight, ref?.current?.offsetWidth]);
  useEventListener('resize', handleSize);
  useIsomorphicLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.current?.offsetHeight, ref?.current?.offsetWidth]);
  return { ref, height, width };
};

export default useTrackRefDimensions;
