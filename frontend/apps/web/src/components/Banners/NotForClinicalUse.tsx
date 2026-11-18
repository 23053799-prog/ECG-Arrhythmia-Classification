import { AlertTriangle } from "lucide-react"

export function NotForClinicalUse() {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 border-b border-rose-200
      bg-rose-50 px-5 py-3 text-sm text-rose-900"
    >
      <AlertTriangle size={19} className="shrink-0" />

      <p>
        <strong>Research prototype.</strong> This application is not
        intended for clinical use. All model labels require human review.
      </p>
    </div>
  )
}