import { Label } from "@/components/ui/label";

interface FieldLabelProps {
  htmlFor: string;
  children: string;
}

export default function FieldLabel({ htmlFor, children }: FieldLabelProps) {
  return (
    <Label htmlFor={htmlFor}>
      {children} <span className="text-red-500">*</span>
    </Label>
  );
}