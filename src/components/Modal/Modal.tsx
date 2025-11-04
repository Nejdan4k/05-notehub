import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

export interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const ensureModalRoot = () => {
  let el = document.getElementById('modal-root');
  if (!el) {
    el = document.createElement('div');
    el.id = 'modal-root';
    document.body.appendChild(el);
  }
  return el;
};

export default function Modal({ children, onClose }: ModalProps) {
  const root = ensureModalRoot();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);

    requestAnimationFrame(() => {
      modalRef.current?.classList.add(css.open);
    });

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onEsc);
    };
  }, [onClose]);

  return createPortal(
    <div
      className={`${css.backdrop} ${css.open}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div ref={modalRef} className={css.modal}>
        {children}
      </div>
    </div>,
    root,
  );
}
