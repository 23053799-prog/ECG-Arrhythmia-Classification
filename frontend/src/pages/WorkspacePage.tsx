import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function WorkspacePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Beat workspace</h1>
        <p className="mt-2 text-sm text-slate-600">
          The signal viewer, beat table, and review queue will be added in Phases F4 and F5.
        </p>
      </div>
      <Card className="border-pink-100 shadow-sm">
        <CardHeader>
          <CardTitle>No record selected</CardTitle>
          <CardDescription>
            Upload a record first. The waveform and beat review tools are not available yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          No signal or beat data is being displayed in this scaffold phase.
        </CardContent>
      </Card>
    </div>
  );
}
