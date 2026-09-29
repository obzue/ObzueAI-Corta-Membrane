# ObzueAI Corta Membrane

Company name: **ObzueAI**.

This folder is the instructor brain only. Download or fork it, then copy the folder into ObzueAI Instructor. It does not import SI MemBrain, Matrix, or Cortex.

## Sequence

ObzueAI, Greeting, Consent, Voice, Memory, Intake, Script, Reason, Host.

```ts
import { blankMembrane, coreSequence, buildPlan, greeting, resolveVoice } from "./index.ts";
```

Voice: male or female. British, Australian male, and Indian male are the documented accents. Caribbean English needs a cloned voice id. Until then she speaks clear English.
