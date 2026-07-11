import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import guestData from "./data/guests.json";
import type { GuestData } from "./lib/types";
import { createGuestIndex } from "./lib/search";
import { useGuestSearch } from "./hooks/useGuestSearch";
import { FloralBackground } from "./components/FloralBackground";
import { Header } from "./components/Header";
import { SearchBox } from "./components/SearchBox";
import { ResultCard } from "./components/ResultCard";

const data = guestData as GuestData;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function App() {
  const fuse = useMemo(() => createGuestIndex(data.guests), []);

  const search = useGuestSearch({ fuse });

  // Other guests seated at the selected guest's table (excluding the guest).
  const tableMates = useMemo(
    () =>
      search.selected
        ? data.guests.filter(
            (g) => g.table === search.selected!.table && g.name !== search.selected!.name,
          )
        : [],
    [search.selected],
  );

  const showResult = search.status !== "searching";

  return (
    <div className="relative min-h-full w-full">
      <FloralBackground />

      <main
        className="relative z-10 mx-auto flex min-h-full w-full max-w-xl flex-col px-5 pb-10 pt-[calc(env(safe-area-inset-top)+2.5rem)]"
        aria-live="polite"
      >
        <Header event={data.event} />

        <section className="mt-10 flex flex-1 items-start justify-center sm:mt-14">
          <div className="w-full max-w-md rounded-[1.75rem] border border-gold/30 bg-ivory/85 p-6 shadow-card backdrop-blur-md sm:p-9">
            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="mb-5 text-center font-display text-xl italic text-plum-soft">
                    Find your seat
                  </p>
                  <SearchBox
                    query={search.query}
                    matches={search.matches}
                    onQueryChange={search.setQuery}
                    onSelect={search.selectGuest}
                    onSubmit={search.submit}
                  />
                  <p className="mt-6 text-center text-xs leading-relaxed text-plum-soft/80">
                    Type your name as it appears on your invitation.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <ResultCard
                    status={search.status as "found" | "multiple" | "notfound"}
                    guest={search.selected}
                    candidates={search.candidates}
                    tableMates={tableMates}
                    onSelect={search.selectGuest}
                    onReset={search.reset}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <footer className="mt-8 text-center text-[0.7rem] uppercase tracking-[0.25em] text-plum-soft/70">
          Seating · Zanti
        </footer>
      </main>
    </div>
  );
}
