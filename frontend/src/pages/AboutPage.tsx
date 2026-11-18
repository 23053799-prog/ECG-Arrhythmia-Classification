import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">About this project</h1>
        <p className="mt-2 text-sm text-slate-600">A research prototype for ECG beat review and annotation.</p>
      </div>
      <Card className="border-pink-100 shadow-sm">
        <CardHeader>
          <CardTitle>Human-led ECG beat review</CardTitle>
          <CardDescription>
            The application presents model labels as suggestions. The person reviewing the record
            remains responsible for the final annotation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
          <p>
            Education mode is intended to help users explore waveform segments, suggested labels,
            probabilities, class explanations, and model limitations.
          </p>
          <p>
            Annotation mode is intended to help a reviewer work through beats, correct labels,
            mark beats as reviewed, and export corrected annotations.
          </p>
          <p className="font-semibold text-rose-800">Research prototype, not for clinical use.</p>
        </CardContent>
      </Card>
    </div>
  );
}
