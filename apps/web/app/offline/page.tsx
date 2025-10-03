export default function OfflinePage() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-12 text-center">
      <h1 className="text-2xl font-bold">Offline mode</h1>
      <p className="text-sm text-slate-300">
        You appear to be offline. ScamShield.my works best with an active connection, but you can still review saved
        reports from your browser history.
      </p>
    </main>
  );
}
