#!/usr/bin/env python3
"""
🤖 RASA 3.6.4 Automotive Chatbot Setup - ONE BY ONE INSTALLATION
Installs each dependency individually with success/failure tracking
"""

import subprocess
import sys
import os
from pathlib import Path
import platform

def print_colored(message, color='white'):
    """Print colored messages"""
    colors = {
        'red': '\033[91m',
        'green': '\033[92m',
        'yellow': '\033[93m',
        'blue': '\033[94m',
        'cyan': '\033[96m',
        'white': '\033[97m',
        'reset': '\033[0m'
    }
    color_code = colors.get(color, colors['white'])
    reset_code = colors['reset']
    print(f"{color_code}{message}{reset_code}")

def run_command(command, description, timeout=120):
    """Run a command with timeout and return success status"""
    try:
        print_colored(f"🔧 {description}...", 'cyan')
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        
        if result.returncode == 0:
            print_colored(f"✅ {description} - SUCCESS", 'green')
            return True
        else:
            print_colored(f"❌ {description} - FAILED", 'red')
            if result.stderr:
                print_colored(f"   Error: {result.stderr[:200]}...", 'red')
            return False
            
    except subprocess.TimeoutExpired:
        print_colored(f"⏰ {description} - TIMEOUT", 'yellow')
        return False
    except Exception as e:
        print_colored(f"❌ {description} - ERROR: {str(e)}", 'red')
        return False

def read_requirements():
    """Read and parse requirements.txt"""
    requirements_file = Path("backend/requirements.txt")
    if not requirements_file.exists():
        print_colored("❌ requirements.txt not found!", 'red')
        return []
    
    with open(requirements_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    packages = []
    for line in lines:
        line = line.strip()
        if line and not line.startswith('#') and not line.startswith('-'):
            packages.append(line)
    
    return packages

def install_package_individually(package):
    """Install a single package"""
    python_exe = ".venv\\Scripts\\python.exe" if os.name == 'nt' else ".venv/bin/python"
    command = f"{python_exe} -m pip install \"{package}\" --timeout 180"
    return run_command(command, f"Installing {package}")

def main():
    print_colored("============================================================", 'cyan')
    print_colored("🤖 RASA 3.6.4 Automotive Chatbot Setup - ONE BY ONE", 'cyan')
    print_colored("============================================================", 'cyan')
    
    # Check Python version
    python_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    print_colored(f"🐍 Python {python_version}", 'blue')
    
    if sys.version_info < (3, 9):
        print_colored("❌ Python 3.9+ required for this setup", 'red')
        return
    
    print_colored("✅ Perfect! Python 3.9+ - compatible versions", 'green')
    
    # Check virtual environment
    if not os.path.exists('.venv'):
        print_colored("❌ Virtual environment not found! Please create .venv first", 'red')
        return
    
    print_colored("📦 Virtual environment exists", 'blue')
    
    # Upgrade pip
    if not run_command(".venv\\Scripts\\python.exe -m pip install --upgrade pip", "Upgrading pip"):
        print_colored("⚠️ Pip upgrade failed, continuing anyway...", 'yellow')
    
    # Install RASA core first
    print_colored("📦 Step 1: Installing RASA core...", 'blue')
    rasa_success = install_package_individually("rasa==3.6.4")
    if rasa_success:
        rasa_sdk_success = install_package_individually("rasa-sdk==3.6.1")
    else:
        rasa_sdk_success = False
    
    # Read requirements and install one by one
    print_colored("📦 Step 2: Installing dependencies ONE BY ONE...", 'blue')
    packages = read_requirements()
    
    # Remove RASA packages since we already installed them
    packages = [p for p in packages if not p.startswith('rasa==') and not p.startswith('rasa-sdk==')]
    
    print_colored(f"🔍 Found {len(packages)} additional packages to install", 'blue')
    
    success_list = []
    failed_list = []
    
    if rasa_success:
        success_list.append("rasa==3.6.4")
    else:
        failed_list.append("rasa==3.6.4")
        
    if rasa_sdk_success:
        success_list.append("rasa-sdk==3.6.1")
    else:
        failed_list.append("rasa-sdk==3.6.1")
    
    # Install each package individually
    for i, package in enumerate(packages, 1):
        print_colored(f"📦 [{i}/{len(packages)}] Processing: {package}", 'blue')
        
        if install_package_individually(package):
            success_list.append(package)
        else:
            failed_list.append(package)
        
        print()  # Add spacing
    
    # Summary Report
    print_colored("============================================================", 'cyan')
    print_colored("📊 INSTALLATION SUMMARY REPORT", 'cyan')
    print_colored("============================================================", 'cyan')
    
    print_colored(f"✅ SUCCESSFUL INSTALLATIONS ({len(success_list)}):", 'green')
    for package in success_list:
        print_colored(f"   ✓ {package}", 'green')
    
    print()
    print_colored(f"❌ FAILED INSTALLATIONS ({len(failed_list)}):", 'red')
    for package in failed_list:
        print_colored(f"   ✗ {package}", 'red')
    
    # CRITICAL FIX: Force packaging version for RASA compatibility
    print()
    print_colored("🔧 CRITICAL FIX: Enforcing RASA-compatible packaging version...", 'yellow')
    if run_command(".venv\\Scripts\\python.exe -m pip install packaging==20.9 --force-reinstall --no-deps", "Fixing packaging version for RASA"):
        print_colored("✅ Packaging version fixed for RASA compatibility", 'green')
    else:
        print_colored("⚠️ Warning: Could not fix packaging version", 'yellow')
    
    print()
    print_colored("🧪 Testing core installations...", 'blue')
    
    # Test installations
    test_results = {}
    test_packages = {
        "RASA": "import rasa; print('RASA:', rasa.__version__)",
        "RASA SDK": "import rasa_sdk; print('RASA SDK:', rasa_sdk.__version__)",
        "FastAPI": "import fastapi; print('FastAPI:', fastapi.__version__)",
        "Transformers": "import transformers; print('Transformers:', transformers.__version__)",
        "LangChain": "import langchain; print('LangChain:', langchain.__version__)",
        "FAISS": "import faiss; print('FAISS: Available')",
        "PyPDF": "import pypdf; print('PyPDF:', pypdf.__version__)"
    }
    
    for name, test_code in test_packages.items():
        if run_command(f".venv\\Scripts\\python.exe -c \"{test_code}\"", f"Testing {name}"):
            test_results[name] = "✅ Working"
        else:
            test_results[name] = "❌ Failed"
    
    print()
    print_colored("🔍 COMPONENT TEST RESULTS:", 'blue')
    for name, result in test_results.items():
        color = 'green' if '✅' in result else 'red'
        print_colored(f"   {result} {name}", color)
    
    # Install frontend dependencies
    print()
    print_colored("🌐 Installing frontend dependencies...", 'blue')
    if run_command("npm --version", "Checking npm"):
        print_colored("✅ npm available", 'green')
        
        # Install root dependencies
        if run_command("npm install", "Installing root package dependencies"):
            print_colored("✅ Root dependencies installed", 'green')
        else:
            print_colored("⚠️ Root dependencies failed", 'yellow')
        
        # Install frontend dependencies
        if run_command("cd frontend && npm install", "Installing frontend dependencies"):
            print_colored("✅ Frontend dependencies installed", 'green')
        else:
            print_colored("⚠️ Frontend dependencies failed", 'yellow')
    else:
        print_colored("⚠️ npm not found - frontend setup needed", 'yellow')
    
    print()
    print_colored("============================================================", 'cyan')
    if len(failed_list) == 0:
        print_colored("🎉 ALL PACKAGES INSTALLED SUCCESSFULLY!", 'green')
    elif len(success_list) > len(failed_list):
        print_colored("🎯 MOSTLY SUCCESSFUL - Core functionality available!", 'yellow')
    else:
        print_colored("⚠️ MANY FAILURES - Check dependency conflicts", 'red')
    print_colored("============================================================", 'cyan')
    
    print_colored("🚀 Setup complete! Check the summary above for details.", 'cyan')

if __name__ == "__main__":
    main() 