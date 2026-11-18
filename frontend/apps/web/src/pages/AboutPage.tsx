import { HeartPulse, Users, ShieldAlert } from "lucide-react"

export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          About the project
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          An ECG beat review, annotation and educational research application.
        </p>
      </div>

      <div className="space-y-5 rounded-3xl border border-pink-100 bg-white p-7">

        <div className="flex items-center gap-3">
          <HeartPulse className="text-pink-600" size={25} />
          <h2 className="font-bold text-slate-900">
            Project objective
          </h2>
        </div>

        <p className="text-sm leading-7 text-slate-600">
          This project provides an interface for exploring ECG records,
          examining model-suggested beat labels and correcting
          annotations through human review.
        </p>

        <div className="flex items-center gap-3">
          <Users className="text-pink-600" size={25} />
          <h2 className="font-bold text-slate-900">
            Human review
          </h2>
        </div>

        <p className="text-sm leading-7 text-slate-600">
          Model predictions are suggestions. Users remain responsible
          for reviewing and correcting annotations.
        </p>

        <div className="flex items-center gap-3">
          <ShieldAlert className="text-pink-600" size={25} />
          <h2 className="font-bold text-slate-900">
            Important limitation
          </h2>
        </div>

        <p className="text-sm leading-7 text-slate-600">
          This application is a research prototype and is not intended
          for clinical use.
        </p>

      </div>

    </div>
  )
}