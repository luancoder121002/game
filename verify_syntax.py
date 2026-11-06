import os, re

import os, re, glob

js_files = [f for f in glob.glob('js/**/*.js', recursive=True) if not f.endswith('.min.js')]

def check_js(filename):
    code = open(filename, encoding='utf-8').read()
    # Strip comments
    code = re.sub(r'//.*', '', code)
    code = re.sub(r'/\*[\s\S]*?\*/', '', code)
    # Strip backtick template strings first (as they contain quotes)
    code = re.sub(r'`(?:[^`\\]|\\.)*`', '``', code, flags=re.DOTALL)
    # Strip quotes
    code = re.sub(r'\"(?:[^\"\\]|\\.)*\"', '""', code)
    code = re.sub(r"\'(?:[^\'\\]|\\.)*\'", "''", code)
    
    braces = code.count('{') - code.count('}')
    brackets = code.count('[') - code.count(']')
    parens = code.count('(') - code.count(')')
    if braces != 0 or brackets != 0 or parens != 0:
        print(f"SYNTAX ERROR IN {filename}: braces={braces}, brackets={brackets}, parens={parens}")
        return False
    return True

all_valid = all(check_js(f) for f in js_files)
if all_valid:
    print(f"VERIFIED: All {len(js_files)} JavaScript files have 100% PERFECTLY BALANCED syntax!")
else:
    print("SOME FILES FAILED")
