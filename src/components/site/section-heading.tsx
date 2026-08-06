import { cn } from "@/lib/utils";

/**
 * Splits `title` on the first occurrence of `accent` and renders that
 * substring in the italic-berry editorial treatment used throughout the
 * site's headings (see hero-section.tsx). Falls back to the plain title
 * when `accent` isn't supplied or doesn't match.
 */
function AccentedTitle({ title, accent }: { title: string; accent?: string }) {
  if (!accent) return <>{title}</>;
  const idx = title.indexOf(accent);
  if (idx === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, idx)}
      <span className="italic text-berry">{accent}</span>
      {title.slice(idx + accent.length)}
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  /** A substring of `title` to render in the italic editorial accent treatment. */
  accent?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full bg-blush px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-berry">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-balance font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
        <AccentedTitle title={title} accent={accent} />
      </h2>
      {description && (
        <p className="mt-3 text-balance text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}
