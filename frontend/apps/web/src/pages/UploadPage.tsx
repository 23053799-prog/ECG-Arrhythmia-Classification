import { Upload, FileHeart } from "lucide-react"

export function UploadPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Upload ECG Record
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Import an ECG record to begin beat annotation review.
        </p>
      </div>

      <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-pink-200 bg-white p-8 text-center">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
          <Upload size={30} />
        </div>

        <h2 className="mt-5 text-lg font-bold text-slate-900">
          Upload functionality is coming next
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          We will implement drag-and-drop uploads, file validation,
          progress indicators and backend integration in Phase F3.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-3 text-xs text-pink-800">
          <FileHeart size={17} />
          WFDB and CSV input support will follow the API contract.
        </div>

      </div>

    </div>
  )
}