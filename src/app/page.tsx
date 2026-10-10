import { Suspense } from "react";
import { PlayerPage } from "@/components/PlayerPage";

export default function Home() {
  return (
    <Suspense fallback={<main style={{ minHeight: "100dvh", background: "#f3f3f3" }} />}>
      <PlayerPage />
    </Suspense>
  );
}
