import os

with open('PRD.txt', 'r') as f:
    prd_lines = [line.strip() for line in f.readlines() if line.strip()]

if not prd_lines:
    print("PRD is empty.")
    exit(0)

# 1 & 2 & 3 & 4: Move directly to TASK_LIST.md as new Phase
with open('TASK_LIST.md', 'a') as f:
    f.write("\n### Phase F9 — UI Overhaul & Dark Mode\n")
    for line in prd_lines:
        if "stripe" not in line.lower() and "bank" not in line.lower():
            f.write(f"- [ ] {line.lstrip('- ')}\n")
    
    f.write("\n### Phase F10 — Payment Integration (Frontend)\n")
    for line in prd_lines:
        if "stripe" in line.lower() or "bank" in line.lower():
            f.write(f"- [ ] {line.lstrip('- ')}\n")

    f.write("\n### Phase B10 — Payment Integration (Backend)\n")
    for line in prd_lines:
        if "stripe" in line.lower() or "bank" in line.lower():
            f.write(f"- [ ] Backend integration: {line.lstrip('- ')}\n")

# Clear PRD
with open('PRD.txt', 'w') as f:
    f.write("")

print("Tasks moved to TASK_LIST.md")
