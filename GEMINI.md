# Project Rules

## ⛔ Git Push Prohibition (STRICT POLICY)

**NEVER EXECUTE `git push` UNDER ANY CIRCUMSTANCES.**

- The agent is strictly prohibited from proposing or executing `git push` or any variation thereof (e.g. `git push origin`, `git push --force`, `git push --tags`).
- Local git operations (`git add`, `git commit`, `git status`, `git diff`) are allowed when requested.
- Remote pushing is reserved exclusively for the user.
- When changes are committed locally, report the commit to the user and prompt the user to execute `git push` themselves.
- This rule applies globally across all projects, workspaces, and sessions.
