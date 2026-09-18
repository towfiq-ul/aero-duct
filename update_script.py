import re

# 1 & 2. Update PLAN.md from PRD.txt and clear PRD.txt
with open('PRD.txt', 'r') as f:
    prd_lines = f.readlines()

prd_tasks = []
for line in prd_lines:
    line = line.strip()
    if line.startswith('- '):
        prd_tasks.append(f"- [ ] {line[2:]} (from PRD)")

with open('PLAN.md', 'r') as f:
    plan_lines = f.readlines()

new_plan_lines = []
for line in plan_lines:
    new_plan_lines.append(line)
    if line.startswith('### Phase F2'):
        # Insert PRD tasks right after this heading
        new_plan_lines.extend([task + '\n' for task in prd_tasks])

# Write back to PRD.txt to clear it
with open('PRD.txt', 'w') as f:
    f.write('')

# 3 & 4. Move tasks from PLAN.md to TASK_LIST.md and remove from PLAN.md
final_plan_lines = []
moved_tasks_by_phase = {}
current_phase = None

for line in new_plan_lines:
    # Check if it is a task (starts with - [x], - [ ], or is indented under a task)
    # We will assume any line starting with `- ` or `  - ` that isn't a header is a task.
    if line.startswith('### '):
        current_phase = line.strip()
        final_plan_lines.append(line)
        moved_tasks_by_phase[current_phase] = []
    elif line.startswith('## '):
        current_phase = None
        final_plan_lines.append(line)
    elif current_phase and (line.strip().startswith('- [') or line.strip().startswith('- ')):
        moved_tasks_by_phase[current_phase].append(line)
    else:
        final_plan_lines.append(line)

# Write stripped PLAN.md
with open('PLAN.md', 'w') as f:
    f.writelines(final_plan_lines)

# Append to TASK_LIST.md
with open('TASK_LIST.md', 'r') as f:
    task_list_content = f.read()

task_list_content += "\n\n## Tasks Moved from PLAN.md\n"
for phase, tasks in moved_tasks_by_phase.items():
    if tasks:
        task_list_content += f"\n{phase}\n"
        for task in tasks:
            task_list_content += task

with open('TASK_LIST.md', 'w') as f:
    f.write(task_list_content)

