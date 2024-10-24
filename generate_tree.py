import os
import io
import pyperclip

def generate_tree(startpath, exclude_dirs=['node_modules', 'coverage', '.git', '__pycache__']):
    output = io.StringIO()
    for root, dirs, files in os.walk(startpath):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        level = root.replace(startpath, '').count(os.sep)
        indent = '│   ' * (level - 1) + '├── ' if level > 0 else ''
        print(f'{indent}{os.path.basename(root)}/', file=output)
        for f in files:
            print(f'{indent}│   {f}', file=output)
    return output.getvalue()

# Usage
tree_output = generate_tree('./')
print(tree_output)  # This will print to console

# Copy to clipboard
# pyperclip.copy(tree_output)
print("File tree has been copied to clipboard!")