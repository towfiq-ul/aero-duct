# Project Instructions

## ⛔ Git Push Prohibition (STRICT POLICY)
**NEVER EXECUTE `git push` UNDER ANY CIRCUMSTANCES.**
- The agent is strictly prohibited from proposing or executing `git push` (or any variant such as `git push origin`, `git push --force`, `git push --tags`).
- Local git operations (`git add`, `git commit`, `git status`, `git diff`) are allowed when requested.
- Remote pushing is reserved exclusively for the user.
- When changes are committed locally, inform the user and let them run `git push` manually.

## "check requirement"
If the user says **"check requirement"**, it means to execute the following sequence of actions:
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

## "verify and feedback"
If the user says **"verify and feedback"**, it means to execute the following sequence of actions:
1. Read `TASK_LIST.md` in full.
2. For every item marked `[x]` or listed under **✅ Implemented**, verify it actually exists in the codebase by checking file presence, route registration in `App.tsx`, and functional completeness (not just stubs).
3. For every item found to be falsely marked done (file missing, route unregistered, or content is a stub with no real logic), move it from ✅ to ❌ in `TASK_LIST.md` with a note explaining what is missing.
4. For items that are partially implemented (file exists but logic is stub/mock/placeholder), move them to 🟡 Partial with a description of what remains.
5. Update the "Last updated" date in `TASK_LIST.md`.
6. Write a `FEEDBACK.md` file (create if it doesn't exist, append if it does) with:
   - **🔴 Critical** — false positives: items claimed done that don't exist
   - **🟡 Medium** — incomplete implementations: stubs, missing logic, broken links
   - **🔵 Design / UX** — visual issues, accessibility gaps, consistency problems
   - **🟢 What's working well** — things verified as genuinely complete and functional
7. The feedback should be specific: reference exact file paths, component names, and route strings.
8. Do not modify any source code during this workflow — only update documentation files.
