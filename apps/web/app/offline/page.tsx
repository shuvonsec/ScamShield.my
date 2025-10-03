export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold">Offline</h1>
      <p className="text-sm text-slate-300">
        You appear to be offline. ScamShield requires connectivity to fetch the latest threat intelligence.
      </p>
    </main>
  );
}
