import { BookOpen, ShieldAlert } from "lucide-react"

export function ModelCardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Model Card
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Understand the model's intended use, performance and limitations.
        </p>
      </div>

      <div className="rounded-3xl border border-pink-100 bg-white p-8">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
          <BookOpen size={28} />
        </div>

        <h2 className="mt-5 text-lg font-bold">
          Model information
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
          Model information, evaluation results, class support and
          limitations will be retrieved from the backend's model-card
          endpoint in Phase F6.
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">

          <ShieldAlert size={20} className="shrink-0" />

          <p>
            Model performance information must come from the backend.
            No evaluation metrics are displayed until they are available.
          </p>

        </div>

      </div>

    </div>
  )
}