import { FileSearch } from 'lucide-react';

export default function SearchEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 pt-16">
      <FileSearch
        className="text-muted-foreground/60 size-12"
        strokeWidth={0.5}
      />
      <h3 className="text-muted-foreground text-sm">
        We couldn&apos;t find anything matching your search
      </h3>
    </div>
  );
}
