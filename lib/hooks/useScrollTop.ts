import { useState } from 'react';
import { useEventListener } from 'usehooks-ts';

function useScrollTop(threshhold = 10) {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const handleScroll = () => {
    if (window.scrollY > threshhold) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  useEventListener('scroll', handleScroll);
  return scrolled;
}

export default useScrollTop;
