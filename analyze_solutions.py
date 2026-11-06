"""
analyze_solutions.py
Inspects each level and synthesizes exact solved circuit topology
"""
import re
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

content = open('js/data/levels.js', encoding='utf-8').read()
level_chunks = re.split(r'\{\s*levelId:\s*', content)[1:]

print(f"Total levels: {len(level_chunks)}")
for idx, chunk in enumerate(level_chunks):
    lid = int(re.search(r'^(\d+)', chunk).group(1))
    title = re.search(r'title:\s*\"([^\"]+)\"', chunk).group(1)
    act = int(re.search(r'act:\s*(\d+)', chunk).group(1))
    in_m = re.search(r'inputs:\s*(\{[^}]+\})', chunk)
    out_m = re.search(r'expectedOutputs:\s*(\{[^}]+\})', chunk)
    comp_m = re.search(r'availableComponents:\s*\[([^\]]*)\]', chunk)
    comps = [c.strip().replace('"', '').replace("'", '') for c in comp_m.group(1).split(',') if c.strip()] if comp_m else []
    print(f"L{lid:02d} (Act {act}): {title:20s} | In: {in_m.group(1) if in_m else '{}'} -> Out: {out_m.group(1) if out_m else '{}'} | Comps: {comps}")
