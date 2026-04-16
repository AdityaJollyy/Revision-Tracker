export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="hidden md:block sticky top-16 z-20 bg-surface-0/80 backdrop-blur-xl border-b border-border-subtle -mx-4 sm:-mx-6 px-4 sm:px-6 mb-6">
        <div className="flex gap-2 py-1">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="h-10 w-24 rounded-lg bg-surface-1 border border-border-subtle animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-surface-1 border border-border-subtle animate-pulse"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-16 rounded bg-surface-2" />
              <div className="w-7 h-7 rounded-lg bg-surface-2" />
            </div>
            <div className="h-8 w-14 rounded bg-surface-2" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-4 w-40 rounded bg-surface-2 animate-pulse" />
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="rounded-xl bg-surface-1 border border-border-subtle p-4 animate-pulse"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-3/5 rounded bg-surface-2" />
                <div className="h-3 w-1/3 rounded bg-surface-2" />
              </div>
              <div className="h-6 w-16 rounded-full bg-surface-2" />
            </div>
            <div className="space-y-2">
              {[0, 1].map((line) => (
                <div
                  key={line}
                  className="h-10 rounded-lg bg-surface-2 border border-border-subtle"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
