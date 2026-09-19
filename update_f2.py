import re

with open('TASK_LIST.md', 'r') as f:
    content = f.read()

tasks_to_check = [
    "Top Menu: Include tabs for \"Services\", \"Reviews\", \"FAQ\", and \"Contact\"",
    "Service Area Update: Limit the service area dropdown",
    "Expanded Residential Services",
    "Commercial Services",
    "New Packages",
    "Design Reference:",
    "Exclusions: Remove \"Live Dispatch\"",
    "Fees Calculator",
    "Catchy Heading",
    "Trust Signals",
    "Design Quality"
]

lines = content.split('\n')
for i, line in enumerate(lines):
    if line.strip().startswith('- [ ]'):
        for task in tasks_to_check:
            if task in line:
                lines[i] = line.replace('- [ ]', '- [x]', 1)

with open('TASK_LIST.md', 'w') as f:
    f.write('\n'.join(lines))
