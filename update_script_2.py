import re

# 1. Read PRD.txt
with open('PRD.txt', 'r') as f:
    prd_lines = f.readlines()

new_tasks = []
for line in prd_lines:
    line = line.strip()
    if line.startswith('- '):
        new_tasks.append(f"- [ ] {line[2:]} (from PRD)")

# 2. Update PLAN.md
# We will temporarily add them to PLAN.md under "### Phase F2 — Pages (Done ✅)"
with open('PLAN.md', 'r') as f:
    plan_lines = f.readlines()

updated_plan = []
for line in plan_lines:
    updated_plan.append(line)
    if line.startswith('### Phase F2'):
        for task in new_tasks:
            updated_plan.append(task + '\n')

with open('PLAN.md', 'w') as f:
    f.writelines(updated_plan)

# 3. Clear PRD.txt (remove what was added to PLAN.md)
with open('PRD.txt', 'w') as f:
    f.write('')

# 4. Extract tasks from PLAN.md and add to TASK_LIST.md
# Because we only added tasks under F2, we can just grab them and append them to TASK_LIST.md under F2.
with open('PLAN.md', 'r') as f:
    fresh_plan = f.readlines()

tasks_to_move = []
final_plan = []
current_phase = None

for line in fresh_plan:
    if line.startswith('### '):
        current_phase = line.strip()
        final_plan.append(line)
    elif line.startswith('## '):
        current_phase = None
        final_plan.append(line)
    elif current_phase and (line.strip().startswith('- [') or line.strip().startswith('- ')):
        tasks_to_move.append((current_phase, line))
    else:
        final_plan.append(line)

with open('PLAN.md', 'w') as f:
    f.writelines(final_plan)

with open('TASK_LIST.md', 'r') as f:
    task_list = f.readlines()

# Let's insert the new tasks right after the '### Phase F2 — Pages (Done ✅)' in TASK_LIST.md
new_task_list = []
i = 0
while i < len(task_list):
    line = task_list[i]
    new_task_list.append(line)
    if line.startswith('### Phase F2'):
        # insert all new F2 tasks
        for phase, task in tasks_to_move:
            if phase.startswith('### Phase F2'):
                new_task_list.append(task)
    i += 1

with open('TASK_LIST.md', 'w') as f:
    f.writelines(new_task_list)

