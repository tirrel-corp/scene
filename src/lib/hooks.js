import { useCallback, useEffect } from 'react';

export const useClickOutside = (parentRefs, callback) => {
  if (!Array.isArray(parentRefs)) {
    throw new Error('useClickOutside requires an array of parentRefs');
  }

  useEffect(() => {
    const handleClickOutside = ev => {
      if (parentRefs.every(r => !r.current.contains(ev.target))) {
        callback();
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [parentRefs, callback]);
}
