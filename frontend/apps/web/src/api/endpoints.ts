const encode = (value: string | number) =>
  encodeURIComponent(String(value))

export const endpoints = {
  health: "/health",

  classes: "/classes",

  modelCard: "/model-card",

  records: "/records",

  record: (recordId: string) =>
    `/records/${encode(recordId)}`,

  signal: (recordId: string) =>
    `/records/${encode(recordId)}/signal`,

  beats: (recordId: string) =>
    `/records/${encode(recordId)}/beats`,

  beat: (recordId: string, beatId: number) =>
    `/records/${encode(recordId)}/beats/${encode(beatId)}`,

  timeline: (recordId: string) =>
    `/records/${encode(recordId)}/timeline`,

  export: (recordId: string) =>
    `/records/${encode(recordId)}/export`,
} as const