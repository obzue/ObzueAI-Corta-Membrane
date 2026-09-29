# ObzueAI Corta Membrane

Company name: **ObzueAI**.

This repository is one of three separate entities. It is not the web site and not the app.

| Entity | Repository |
| --- | --- |
| Web | https://github.com/obzue/ObzueAI-Web |
| App | https://github.com/obzue/ObzueAI-App |
| Corta membrane | https://github.com/obzue/ObzueAI-Corta-Membrane |

Copy this folder into ObzueAI Instructor when you want the brain. Do not merge the three repositories into one project.

## Sequence

ObzueAI, Greeting, Consent, Voice, Memory, Intake, Script, Reason, Host.

```ts
import { blankMembrane, coreSequence, buildPlan, greeting, resolveVoice } from "./index.ts";
```

Voice: male or female. British, Australian male, and Indian male are the documented accents. Caribbean English needs a cloned voice id. Until then she speaks clear English.
