export type Tab<T extends string> = {
  id: T;
  label: string;
  /* Shown instead of `label` on phones, where the full category name
     makes the pills wrap awkwardly */
  short?: string;
};

type FilterTabsProps<T extends string> = {
  tabs: Tab<T>[];
  active: T;
  onChange: (id: T) => void;
  /* Styles for obsidian sections instead of ivory ones */
  onDark?: boolean;
  label: string;
};

/* Horizontal pill filter. On narrow screens the row scrolls sideways
   rather than wrapping into a cramped grid; from `sm` up it centres
   and wraps naturally. */
export function FilterTabs<T extends string>({
  tabs,
  active,
  onChange,
  onDark = false,
  label,
}: FilterTabsProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap justify-center gap-2 sm:gap-3"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;

        const activeCls = onDark
          ? "bg-gold text-obsidian border-gold"
          : "bg-charcoal text-ivory-light border-charcoal";
        const idleCls = onDark
          ? "bg-transparent text-muted-soft border-dark-line hover:border-gold/50 hover:text-gold-soft"
          : "bg-ivory-light text-muted border-cream-dark hover:border-gold hover:text-ink";

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-pressed={isActive}
            className={[
              "min-h-11 rounded-full border-2 px-4 text-base font-semibold break-words sm:min-h-12 sm:px-6",
              "transition-colors duration-200",
              isActive ? activeCls : idleCls,
            ].join(" ")}
          >
            {tab.short ? (
              <>
                <span className="sm:hidden">{tab.short}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </>
            ) : (
              tab.label
            )}
          </button>
        );
      })}
    </div>
  );
}
