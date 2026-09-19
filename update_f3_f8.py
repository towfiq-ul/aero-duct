import re

with open('TASK_LIST.md', 'r') as f:
    lines = f.readlines()

in_f_phases = False
for i, line in enumerate(lines):
    if line.startswith('### Phase F3') or line.startswith('### Phase F4') or line.startswith('### Phase F5') or line.startswith('### Phase F6') or line.startswith('### Phase F7') or line.startswith('### Phase F8'):
        in_f_phases = True
    elif line.startswith('### Phase B'):
        in_f_phases = False
        
    if in_f_phases and line.strip().startswith('- [ ]'):
        lines[i] = line.replace('- [ ]', '- [x]', 1)

with open('TASK_LIST.md', 'w') as f:
    f.writelines(lines)
