import { Input } from '@/ui/input';

interface BuscadorPacientesProps {
  value: string;
  onChange: (value: string) => void;
}

export function BuscadorPacientes({ value, onChange }: BuscadorPacientesProps) {
  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Buscar por nombre, apellido o DNI..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
}
