import useHasMounted from './useHasMounted';

const useOrigin = () => {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
  if (!useHasMounted()) {
    return '';
  }
  return origin;
};

export default useOrigin;
