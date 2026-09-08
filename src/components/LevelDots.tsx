/* The 1-5 dot scale used in every detail modal to give a spec row a quick
   visual weight alongside its value. */
export function LevelDots({ level }: { level: number }) {
  return (
    <span className="flex gap-1" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`size-2 rounded-full ${n <= level ? "bg-gold" : "bg-cream-dark"}`}
        />
      ))}
    </span>
  );
}
