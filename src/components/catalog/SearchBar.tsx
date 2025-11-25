import { useEffect, useState } from "react";

interface SearchBarProps {
  initialValue?: string;
  onSearch: (value: string) => void;
}

export const SearchBar = ({ initialValue = "", onSearch }: SearchBarProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-xl border bg-white px-4 py-3 shadow-sm"
    >
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar por nome ou descrição"
        className="flex-1 border-none bg-transparent text-sm outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          Limpar
        </button>
      )}
      <button
        type="submit"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        Buscar
      </button>
    </form>
  );
};


