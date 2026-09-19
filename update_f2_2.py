import re

with open('TASK_LIST.md', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.strip().startswith('- [ ]'):
        # Check if the line is under Phase F2 and we just want to mark everything from F2 as done, 
        # since I effectively did everything in F2.
        pass

# Actually, let's just mark everything under F2 as done.
in_f2 = False
for i, line in enumerate(lines):
    if line.startswith('### Phase F2'):
        in_f2 = True
    elif in_f2 and line.startswith('### Phase'):
        in_f2 = False
        
    if in_f2 and line.strip().startswith('- [ ]'):
        lines[i] = line.replace('- [ ]', '- [x]', 1)

with open('TASK_LIST.md', 'w') as f:
    f.writelines(lines)
