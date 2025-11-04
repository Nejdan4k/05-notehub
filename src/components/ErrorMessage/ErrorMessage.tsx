import css from './ErrorMessage.module.css';

export interface ErrorMessageProps {
  text: string;
}

export default function ErrorMessage({ text }: ErrorMessageProps) {
  return <div className={css.error}>{text}</div>;
}
