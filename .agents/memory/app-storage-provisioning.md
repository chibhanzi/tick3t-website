---
name: App Storage provisioning
description: A transient setup failure observed while provisioning App Storage in this project.
---

If App Storage setup returns a generic internal failure without a budget-suspension message, retry the idempotent setup once before changing implementation strategy.

**Why:** The first setup attempt failed internally, while an immediate later retry succeeded and provisioned the bucket and environment variables normally.

**How to apply:** Retry only generic transient setup failures once. Continue to follow the documented budget-exceeded handling when the error explicitly reports suspension.