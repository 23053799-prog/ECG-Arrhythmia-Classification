import type { ClassInfo } from "../../api/types"

// These are mock API response values.
// The real class_catalog.json supplied by the backend
// must replace this fixture during integration.

const placeholderExplanation =
  "Placeholder for local interface development only. Replace with the clinician-reviewed explanation from the backend class catalog before any public demonstration."

const placeholderDescription =
  "Mock catalog entry pending backend class catalog."

export const mockClasses: ClassInfo[] = [
  {
    code: "N",
    name: "Class N",
    short_description: placeholderDescription,
    plain_language_explanation: placeholderExplanation,
    support_level: "supported",
    support_note: "Provisional mock support value; verify against the backend catalog.",
  },
  {
    code: "S",
    name: "Class S",
    short_description: placeholderDescription,
    plain_language_explanation: placeholderExplanation,
    support_level: "experimental",
    support_note: "Provisional mock support value; verify against the backend catalog.",
  },
  {
    code: "V",
    name: "Class V",
    short_description: placeholderDescription,
    plain_language_explanation: placeholderExplanation,
    support_level: "supported",
    support_note: "Provisional mock support value; verify against the backend catalog.",
  },
  {
    code: "F",
    name: "Class F",
    short_description: placeholderDescription,
    plain_language_explanation: placeholderExplanation,
    support_level: "unsupported",
    support_note: "The model cannot reliably detect this class.",
  },
  {
    code: "Q",
    name: "paced / unclassifiable",
    short_description: placeholderDescription,
    plain_language_explanation: placeholderExplanation,
    support_level: "experimental",
    support_note: "Provisional mock support value; verify against the backend catalog.",
  },
]