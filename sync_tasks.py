import re

with open('PLAN.md', 'r') as f:
    plan_lines = f.readlines()

tasks_to_move = []
new_plan_lines = []

current_phase = ""
for line in plan_lines:
    if line.startswith('### Phase'):
        current_phase = line.strip()
        new_plan_lines.append(line)
    elif line.strip().startswith('- [ ]') or line.strip().startswith('- [x]'):
        tasks_to_move.append((current_phase, line.strip()))
    else:
        new_plan_lines.append(line)

with open('PLAN.md', 'w') as f:
    f.writelines(new_plan_lines)

# Now update TASK_LIST.md
with open('TASK_LIST.md', 'r') as f:
    task_list = f.read()

task_list += "\n\n## 📋 Roadmap Tasks (Moved from PLAN.md)\n\n"
current_cat = None
for phase, task in tasks_to_move:
    if phase != current_cat:
        task_list += f"\n{phase}\n"
        current_cat = phase
    task_list += f"{task}\n"

with open('TASK_LIST.md', 'w') as f:
    f.write(task_list)

