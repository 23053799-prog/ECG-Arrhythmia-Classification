type StubModelProps = {
  isStub: boolean;
};

export function StubModel({ isStub }: StubModelProps) {
  if (!isStub) return null;

  return (
    <div
      role="alert"
      className="border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-950"
    >
      STUB MODEL: results are fake.
    </div>
  );
}
