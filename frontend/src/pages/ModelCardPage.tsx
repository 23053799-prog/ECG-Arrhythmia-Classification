import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ModelCardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Model card</h1>
        <p className="mt-2 text-sm text-slate-600">
          Model details and limitations will be loaded from GET /model-card in Phase F6.
        </p>
      </div>
      <Card className="border-pink-100 shadow-sm">
        <CardHeader>
          <CardTitle>Model information not loaded</CardTitle>
          <CardDescription>
            No performance figures or evaluation results are hard-coded in this interface.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          The model card will display the backend response. If evaluation is null, the page will
          show that it is not yet available.
        </CardContent>
      </Card>
    </div>
  );
}
