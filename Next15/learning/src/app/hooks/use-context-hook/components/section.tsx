import { useContext } from "react";
import { LevelContext } from "./level-context";

export default function Section({
  children,
  isFancy = false,
}: Readonly<{
  children: React.ReactNode;
  isFancy?: boolean;
}>) {
  const level = useContext(LevelContext);
  return (
    <section
      className={
        "section p-3 space-y-4  bg-slate-50" +
        " " +
        (isFancy ? "border border-red-400" : "")
      }
    >
      <LevelContext value={level + 1}>{children}</LevelContext>
    </section>
  );
}
