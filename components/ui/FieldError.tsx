interface FieldErrorProps {
  message?: string;
}

export default function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}