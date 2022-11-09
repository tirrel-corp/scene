import { useEffect } from "react";

export const useClickOutside = (ids, callback) => {
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string")) {
    throw new Error("useClickOutside requires an array of ids");
  }

  useEffect(() => {
    const handleClickOutside = (ev) => {
      if (
        ids.every((id) => !document.getElementById(id)?.contains?.(ev.target))
      ) {
        callback();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [ids, callback]);
};

export function useOutsideAlerter(ref, callback) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
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
