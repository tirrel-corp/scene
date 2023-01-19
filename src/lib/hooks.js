import { useEffect } from "react";

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

export function useOutsideAlerter(ref, callback) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, ref]);
}