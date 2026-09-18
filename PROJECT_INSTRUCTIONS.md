# Project Instructions

## "check for task"
If the user says **"check for task"**, it means to execute the following sequence of actions:
1. Check `PRD.txt` and update `PLAN.md` accordingly.
2. Remove items from `PRD.txt` which are already added in `PLAN.md`.
3. Create tasks from `PLAN.md` and add them into `TASK_LIST.md`.
4. After adding tasks into `TASK_LIST.md`, remove them from `PLAN.md`.
5. Check `TASK_LIST.md` for frontend tasks and share the remaining tasks.

## "implement FE" / "implement BE"
If the user says **"implement FE"** (or **"implement BE"** for backend), it means to execute the following sequence of actions:
1. Check `TASK_LIST.md` and identify Frontend (or Backend) tasks.
2. Start implementing from the remaining tasks from the top.
3. After implementing one task, update `TASK_LIST.md` (e.g. mark it as completed).
4. Complete all tasks until forced to stop.
5. **Conditional limits**: If asked to implement up to a certain point (e.g., "implement FE up to Phase X") or a specific phase (e.g., "implement FE Phase Y"), strictly stop implementing after that point or only implement that specific phase.
