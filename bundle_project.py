import os
import shutil
import datetime
import re

def sanitize_filename(filename):
    """Convert any path separators or spaces to underscores"""
    return re.sub(r'[\\/\s]', '_', filename)

def is_sensitive_file(filename):
    """Check if a file might contain sensitive information"""
    strictly_sensitive = [
        '.env',
        'secret',
        'password',
        'credential',
        'token',
        '.pem',
        '.crt',
        '.key',
        '.p12',
        '.pfx'
    ]
    lower_filename = filename.lower()
    return any(pattern in lower_filename for pattern in strictly_sensitive)

def create_shadcn_component_list(ui_dir):
    """Create a list of shadcn components being used"""
    components = []
    if os.path.exists(ui_dir):
        for file in os.listdir(ui_dir):
            if file.endswith('.tsx'):
                component_name = file.replace('.tsx', '')
                components.append(component_name)
    
    content = """# shadcn/ui Components Used

The following components from shadcn/ui are implemented in this project:

{}

To add any missing components, use:
```bash
pnpm dlx @shadcn/ui@latest add component-name
```""".format('\n'.join(f'- {component}' for component in sorted(components)))
    
    return content

def create_flat_bundle():
    # Create timestamp for the bundle directory
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    bundle_dir = f"project_bundle_{timestamp}"
    
    # Create bundle directory
    os.makedirs(bundle_dir, exist_ok=True)
    
    # Root level files
    root_files = [
        ".gitignore",
        "package.json",
        "tsconfig.json",
        "README.md",
        "pnpm-workspace.yaml"
    ]
    
    # Copy root level files
    print("Copying root level files...")
    for file in root_files:
        if os.path.exists(file) and not is_sensitive_file(file):
            shutil.copy2(file, os.path.join(bundle_dir, file))
            print(f"Copied: {file}")
    
    # Frontend specific files
    frontend_config_files = [
        ("apps/frontend/postcss.config.js", "frontend_postcss.config.js"),
        ("apps/frontend/components.json", "frontend_components.json"),
        ("apps/frontend/eslint.config.js", "frontend_eslint.config.js"),
        ("apps/frontend/index.html", "frontend_index.html"),
        ("apps/frontend/tailwind.config.js", "frontend_tailwind.config.js"),
        ("apps/frontend/vite.config.ts", "frontend_vite.config.ts"),
        ("apps/frontend/tsconfig.json", "frontend_tsconfig.json")
    ]
    
    print("\nCopying frontend configuration files...")
    for src, dest in frontend_config_files:
        if os.path.exists(src) and not is_sensitive_file(src):
            shutil.copy2(src, os.path.join(bundle_dir, dest))
            print(f"Copied: {src} -> {dest}")
    
    # Frontend source files
    frontend_src_files = [
        ("apps/frontend/src/vite-env.d.ts", "frontend_src_vite-env.d.ts"),
        ("apps/frontend/src/main.tsx", "frontend_src_main.tsx"),
        ("apps/frontend/src/App.css", "frontend_src_App.css"),
        ("apps/frontend/src/App.tsx", "frontend_src_App.tsx"),
        ("apps/frontend/src/index.css", "frontend_src_index.css")
    ]
    
    print("\nCopying frontend source files...")
    for src, dest in frontend_src_files:
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(bundle_dir, dest))
            print(f"Copied: {src} -> {dest}")
    
    # Create shadcn/ui components list
    print("\nCreating shadcn/ui components list...")
    components_list = create_shadcn_component_list("apps/frontend/src/components/ui")
    with open(os.path.join(bundle_dir, 'shadcn_components.md'), 'w') as f:
        f.write(components_list)
    print("Created: shadcn_components.md")
    
    # Backend specific files
    backend_files = [
        ("apps/backend/package.json", "backend_package.json"),
        ("apps/backend/tsconfig.json", "backend_tsconfig.json")
    ]
    
    print("\nCopying backend files...")
    for src, dest in backend_files:
        if os.path.exists(src) and not is_sensitive_file(src):
            shutil.copy2(src, os.path.join(bundle_dir, dest))
            print(f"Copied: {src} -> {dest}")
    
    # Copy and combine types from packages/types
    print("\nCombining type definitions...")
    types_dir = "packages/types/src"
    combined_types = []
    if os.path.exists(types_dir):
        for type_file in os.listdir(types_dir):
            if type_file.endswith('.ts'):
                with open(os.path.join(types_dir, type_file), 'r') as f:
                    content = f.read()
                    combined_types.append(f"// From {type_file}\n{content}\n")
    
    with open(os.path.join(bundle_dir, 'types_combined.ts'), 'w') as f:
        f.write('\n'.join(combined_types))
    print("Created: types_combined.ts")
    
    # Copy TypeScript configs
    tsconfig_files = [
        ("tsconfig/base.json", "tsconfig_base.json"),
        ("tsconfig/react-lib.json", "tsconfig_react-lib.json"),
        ("tsconfig/node-lib.json", "tsconfig_node-lib.json")
    ]
    
    print("\nCopying TypeScript configurations...")
    for src, dest in tsconfig_files:
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(bundle_dir, dest))
            print(f"Copied: {src} -> {dest}")
    
    # Copy other important directories from frontend with prefixes
    frontend_dirs = [
        ("apps/frontend/src/layouts", "frontend_layout"),
        ("apps/frontend/src/pages", "frontend_page"),
        ("apps/frontend/src/lib", "frontend_lib"),
        ("apps/frontend/src/hooks", "frontend_hook"),
        ("apps/frontend/src/services", "frontend_service")
    ]
    
    print("\nCopying frontend directories...")
    for src_dir, prefix in frontend_dirs:
        if os.path.exists(src_dir):
            for root, _, files in os.walk(src_dir):
                for file in files:
                    if not is_sensitive_file(file):
                        src_path = os.path.join(root, file)
                        relative_path = os.path.relpath(src_path, src_dir)
                        new_filename = f"{prefix}_{sanitize_filename(relative_path)}"
                        dest_path = os.path.join(bundle_dir, new_filename)
                        shutil.copy2(src_path, dest_path)
                        print(f"Copied: {src_path} -> {new_filename}")
    
    # Copy backend source files with prefixes
    backend_src_dirs = [
        ("apps/backend/src/routes", "backend_route"),
        ("apps/backend/src/services", "backend_service")
    ]
    
    print("\nCopying backend source files...")
    for src_dir, prefix in backend_src_dirs:
        if os.path.exists(src_dir):
            for root, _, files in os.walk(src_dir):
                for file in files:
                    if not is_sensitive_file(file):
                        src_path = os.path.join(root, file)
                        relative_path = os.path.relpath(src_path, src_dir)
                        new_filename = f"{prefix}_{sanitize_filename(relative_path)}"
                        dest_path = os.path.join(bundle_dir, new_filename)
                        shutil.copy2(src_path, dest_path)
                        print(f"Copied: {src_path} -> {new_filename}")
    
    print(f"\nBundle created successfully in: {bundle_dir}")
    return bundle_dir

if __name__ == "__main__":
    try:
        bundle_path = create_flat_bundle()
        print(f"\nTotal bundle size: {sum(os.path.getsize(os.path.join(bundle_path, f)) for f in os.listdir(bundle_path)) / 1024:.2f} KB")
    except Exception as e:
        print(f"Error: {str(e)}")