import type { ModelCard } from "../../api/types"

import { mockClasses } from "./classes"

export const mockModelCard: ModelCard = {
  model_version: "mock-stub-v1",

  is_stub: true,

  intended_use: [
    "Local frontend development and API integration testing using synthetic data.",
  ],

  not_intended_for: [
    "Clinical decisions",
    "Patient diagnosis",
    "Clinical treatment decisions",
  ],

  disclaimer:
    "Research prototype, not for clinical use. Mock outputs are synthetic and are not production model predictions.",

  training_data: null,

  evaluation: null,

  calibration: null,

  class_support: mockClasses,

  limitations: [
    "Mock responses are synthetic and are not predictions from the production model.",

    "The model misses most S beats and essentially all F beats. A missing S or F label is not evidence of absence.",

    "Confidence scores are not calibrated.",

    "Class percentages are estimates.",

    "Class explanations require clinician verification before any public demonstration.",
  ],

  generated_at: new Date().toISOString(),
}