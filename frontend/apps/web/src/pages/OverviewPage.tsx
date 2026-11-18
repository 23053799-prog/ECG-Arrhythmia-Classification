import {
  Activity,
  Upload,
  ClipboardList,
  BookOpen,
  ArrowRight,
  FileHeart,
} from "lucide-react"

import { useNavigate } from "react-router"
import { Button } from "@workspace/ui/components/button"

export function OverviewPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      <section className="relative overflow-hidden rounded-3xl border border-pink-100 bg-linear-to-br from-pink-100 via-pink-50 to-white p-7 sm:p-10">

        <div className="relative z-10 max-w-2xl">

          <span className="rounded-full border border-pink-200 bg-white/80 px-3 py-1 text-xs font-semibold text-pink-700">
            ECG RESEARCH WORKSPACE
          </span>

          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Welcome to your
            <span className="block text-pink-700">
              ECG Beat Review
            </span>
            workspace.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            Upload ECG records, explore model-suggested beat labels,
            review predictions and prepare corrected annotations.
            Human review remains in control.
          </p>

          <Button
            onClick={() => navigate("/upload")}
            className="mt-7 rounded-xl bg-pink-600 px-5 text-white hover:bg-pink-700"
          >
            <Upload size={17} />
            Upload ECG Record
            <ArrowRight size={16} />
          </Button>

        </div>

        <div className="absolute -right-8 -top-8 hidden h-64 w-64 items-center justify-center rounded-full border-[35px] border-white/50 md:flex">

          <div className="flex h-36 w-36 items-center justify-center rounded-full bg-white/80 text-pink-400">
            <Activity size={75} strokeWidth={1.2} />
          </div>

        </div>

      </section>

      <section>

        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Get started
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose what you would like to work on.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">

          <button
            onClick={() => navigate("/upload")}
            className="group rounded-2xl border border-pink-100 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100"
          >

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-700">
              <Upload size={23} />
            </div>

            <h3 className="font-bold text-slate-900">
              Upload a record
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Select an ECG record to begin reviewing its beat annotations.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-pink-700">
              Get started <ArrowRight size={15} className="transition group-hover:translate-x-1" />
            </div>

          </button>

          <button
            onClick={() => navigate("/workspace")}
            className="group rounded-2xl border border-pink-100 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100"
          >

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <ClipboardList size={23} />
            </div>

            <h3 className="font-bold text-slate-900">
              Review beats
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Examine suggested labels and make human corrections.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-pink-700">
              Open workspace <ArrowRight size={15} />
            </div>

          </button>

          <button
            onClick={() => navigate("/model-card")}
            className="group rounded-2xl border border-pink-100 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100"
          >

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <BookOpen size={23} />
            </div>

            <h3 className="font-bold text-slate-900">
              Understand the model
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Explore model information, intended use and limitations.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-pink-700">
              View model card <ArrowRight size={15} />
            </div>

          </button>

        </div>

      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="font-bold text-slate-900">
              Recent records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your uploaded ECG records will appear here.
            </p>
          </div>

          <FileHeart className="text-pink-300" size={27} />

        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
            <Activity size={27} />
          </div>

          <h3 className="mt-4 font-semibold text-slate-800">
            No records to display
          </h3>

          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Upload your first ECG record to start exploring the beat
            review workspace.
          </p>

          <button
            onClick={() => navigate("/upload")}
            className="mt-5 text-sm font-semibold text-pink-700 hover:underline"
          >
            Upload your first record
          </button>

        </div>

      </section>

      <p className="pb-4 text-center text-xs text-slate-400">
        ECG Beat Review is a research prototype. Model labels are
        suggestions, not clinical conclusions.
      </p>

    </div>
  )
}