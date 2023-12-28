import { ElementRef, useRef, useState } from 'react';
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts';

function useTapShow() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [show, setShow] = useState<boolean>(false);
  const handleClick = (cb?: (...args: any[]) => void) => {
    if (isMobile && !show) {
      setShow(true);
    } else if (cb) {
      cb();
    }
    if (show) {
      setShow(false);
    }
  };
  const handleOutsideClick = () => {
    if (isMobile && show) {
      setShow(false);
    }
  };
  const ref = useRef<ElementRef<'div'>>(null);
  useOnClickOutside(ref, handleOutsideClick);
  return {
    ref,
    handleClick,
    isMobile,
    show,
  };
}

export default useTapShow;
