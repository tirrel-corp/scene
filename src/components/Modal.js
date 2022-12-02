import { useEffect, useRef } from "react";
import cn from "classnames";

const Modal = (props) => {
  const { children, className, isOpen, onRequestClose, title, ...rest } = props;
  const dialogRef = useRef();
  useEffect(() => {
    if (!dialogRef.current) {
      return;
    }
    if (isOpen && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, [isOpen]);
  useEffect(() => {
    if (!dialogRef.current) {
      return;
    }
    if (!isOpen && dialogRef.current.open) {
      onRequestClose();
      dialogRef.current.close();
    }
  });
  return (
    <dialog
      ref={dialogRef}
      onCancel={onRequestClose}
      onClose={onRequestClose}
      className={cn(
        "rounded-lg bg-zinc-700 border-stone-300 border-2 text-neutral-100",
        className
      )}
      {...rest}
    >
      <header className="flex justify-between items-center">
        <div>{!!title && <h1 className="text-2xl">{title}</h1>}</div>
        <button onClick={onRequestClose}>Close</button>
      </header>
      {children}
    </dialog>
  );
};

export default Modal;
