import { Activity, FileUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function UploadPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <div>
        <p className="text-sm font-medium text-pink-700">Welcome to the research workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Review ECG beats with a human in control.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Upload a supported ECG record, inspect suggested model labels, and review or correct
          individual beats. This interface is being built in phases.
        </p>
      </div>

      <Card className="border-pink-100 shadow-sm">
        <CardHeader>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
            <FileUp size={23} aria-hidden="true" />
          </div>
          <CardTitle className="pt-2 text-xl">Upload an ECG record</CardTitle>
          <CardDescription>
            The upload form and file validation will be added in Phase F3.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-2 border-dashed border-pink-200 bg-[#fffafd] px-5 py-10 text-center">
            <Activity className="mx-auto text-pink-400" size={30} aria-hidden="true" />
            <p className="mt-3 font-medium text-slate-800">Your record upload area</p>
            <p className="mt-1 text-sm text-slate-500">
              WFDB and CSV input support will be implemented in the upload phase.
            </p>
            <Button className="mt-5" disabled>
              Upload flow coming in F3
            </Button>
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-pink-50 p-4 text-sm text-pink-950">
            <ShieldCheck className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
            <p>
              The model provides suggested labels only. Human review is required; this prototype
              must not be used for clinical decisions.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-pink-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Education mode</CardTitle>
            <CardDescription>
              Explore waveform segments, model labels, probabilities, and class explanations.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-pink-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Annotation mode</CardTitle>
            <CardDescription>
              Review the suggested labels, correct them when needed, and track review progress.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
