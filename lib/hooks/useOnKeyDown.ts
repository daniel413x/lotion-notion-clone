import { useEventListener } from 'usehooks-ts';

function useOnKeyDown(eKey: KeyboardEvent['key'], cb: () => void) {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === eKey) {
      cb();
    }
  };
  useEventListener('keydown', onKeyDown);
}

export default useOnKeyDown;
