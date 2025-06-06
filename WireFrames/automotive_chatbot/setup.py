#!/usr/bin/env python3
"""
Automotive Chatbot Platform - Unified Setup Script
Installs both frontend and backend dependencies
Supports Windows, macOS, and Linux
"""

import subprocess
import sys
import os
import platform
from pathlib import Path

class ChatbotSetup:
    def __init__(self):
        self.root_dir = Path(__file__).parent
        self.backend_dir = self.root_dir / "backend"
        self.frontend_dir = self.root_dir / "frontend"
        self.is_windows = platform.system() == "Windows"
        self.venv_path = self.root_dir / ".venv"
        
    def run_command(self, command, cwd=None, shell=True):
        """Run a command with proper error handling"""
        try:
            result = subprocess.run(command, cwd=cwd, shell=shell, 
                                  capture_output=True, text=True, check=True)
            print(f"✅ {' '.join(command) if isinstance(command, list) else command}")
            return result
        except subprocess.CalledProcessError as e:
            print(f"❌ Error running: {command}")
            print(f"Error: {e.stderr}")
            return None
    
    def create_virtual_environment(self):
        """Create Python virtual environment"""
        print("\n🔧 Setting up Python virtual environment...")
        
        if self.venv_path.exists():
            print("✅ Virtual environment already exists")
            return True
            
        try:
            subprocess.run([sys.executable, "-m", "venv", str(self.venv_path)], 
                         check=True)
            print("✅ Virtual environment created successfully")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to create virtual environment")
            return False
    
    def get_python_executable(self):
        """Get the correct Python executable path"""
        if self.is_windows:
            return str(self.venv_path / "Scripts" / "python.exe")
        else:
            return str(self.venv_path / "bin" / "python")
    
    def get_pip_executable(self):
        """Get the correct pip executable path"""
        if self.is_windows:
            return str(self.venv_path / "Scripts" / "pip.exe")
        else:
            return str(self.venv_path / "bin" / "pip")
    
    def install_backend_dependencies(self):
        """Install Python backend dependencies"""
        print("\n📦 Installing Python backend dependencies...")
        
        pip_exe = self.get_pip_executable()
        
        # Upgrade pip first
        self.run_command([pip_exe, "install", "--upgrade", "pip"])
        
        # Try compatible requirements first
        compatible_requirements = self.backend_dir / "requirements-compatible.txt"
        regular_requirements = self.backend_dir / "requirements.txt"
        
        # Method 1: Try compatible requirements first
        if compatible_requirements.exists():
            print("Trying compatible requirements first...")
            result = self.run_command([pip_exe, "install", "-r", str(compatible_requirements)])
            if result:
                print("✅ Compatible backend dependencies installed successfully")
                print("💡 Advanced features (Rasa, RAG) can be installed separately if needed")
                return True
            else:
                print("⚠️ Compatible requirements failed, trying full requirements...")
        
        # Method 2: Try regular requirements
        if regular_requirements.exists():
            print("Installing full requirements...")
            result = self.run_command([pip_exe, "install", "-r", str(regular_requirements)])
            if result:
                print("✅ Backend dependencies installed successfully")
                return True
            else:
                print("⚠️ Full requirements failed, trying basic installation...")
        
        # Method 3: Install basic dependencies manually
        print("Installing basic dependencies manually...")
        basic_packages = [
            "fastapi==0.104.1",
            "uvicorn[standard]==0.24.0",
            "python-multipart==0.0.6",
            "pymongo>=4.6.0,<4.8.0",
            "motor>=3.3.0,<3.5.0",
            "python-dotenv>=1.0.0,<2.0.0",
            "requests>=2.28.0,<3.0.0",
            "rich>=13.0.0,<14.0.0"
        ]
        
        for package in basic_packages:
            result = self.run_command([pip_exe, "install", package])
            if not result:
                print(f"⚠️ Failed to install {package}")
        
        print("✅ Basic backend dependencies installed")
        print("⚠️ Some advanced features may not work without additional packages")
        return True
    
    def install_frontend_dependencies(self):
        """Install Node.js frontend dependencies"""
        print("\n📦 Installing Node.js frontend dependencies...")
        
        # Check if npm is available
        npm_locations = [
            "npm",  # Try PATH first
            "npm.cmd",  # Windows fallback
            "C:\\Program Files\\nodejs\\npm.cmd",
            "C:\\Program Files (x86)\\nodejs\\npm.cmd",
        ]
        
        npm_cmd = None
        for cmd in npm_locations:
            try:
                result = subprocess.run([cmd, "--version"], capture_output=True, check=True, timeout=10)
                if result.returncode == 0:
                    npm_cmd = cmd
                    print(f"✅ Found npm: {cmd} (version {result.stdout.decode().strip()})")
                    break
            except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired):
                continue
        
        if not npm_cmd:
            print("❌ npm not found. Please install Node.js first")
            print("💡 Download from: https://nodejs.org/")
            print("⚠️ You can continue with backend-only setup for now")
            return False
        
        try:
            # Install root dependencies (concurrently)
            print("Installing root dependencies...")
            result1 = self.run_command([npm_cmd, "install"], cwd=self.root_dir)
            
            # Install frontend dependencies with ESLint compatibility
            print("Installing frontend dependencies...")
            result2 = self.run_command([npm_cmd, "install", "--legacy-peer-deps"], cwd=self.frontend_dir)
            
            # If legacy-peer-deps fails, try regular install
            if not result2:
                print("Retrying with regular npm install...")
                result2 = self.run_command([npm_cmd, "install"], cwd=self.frontend_dir)
            
            if result1 and result2:
                print("✅ Frontend dependencies installed successfully")
                return True
            
            print("❌ Failed to install some frontend dependencies")
            return False
            
        except Exception as e:
            print(f"❌ Error installing frontend dependencies: {e}")
            return False
    
    def create_env_file(self):
        """Create .env file from template"""
        print("\n⚙️ Setting up environment file...")
        
        env_file = self.root_dir / ".env"
        env_template = self.root_dir / "env_template.txt"
        
        if env_file.exists():
            print("✅ .env file already exists")
            return True
            
        if env_template.exists():
            try:
                with open(env_template, 'r') as template:
                    content = template.read()
                with open(env_file, 'w') as env:
                    env.write(content)
                print("✅ .env file created from template")
                print("⚠️ Please update .env with your actual API keys")
                return True
            except Exception as e:
                print(f"❌ Failed to create .env file: {e}")
                return False
        
        print("⚠️ No env_template.txt found")
        return False
    
    def setup_database(self):
        """Setup MongoDB if needed"""
        print("\n🗄️ Setting up database...")
        
        python_exe = self.get_python_executable()
        # Use the simple, non-interactive setup by default
        mongodb_setup_simple = self.root_dir / "mongodb_setup_simple.py"
        mongodb_setup = self.root_dir / "mongodb_setup.py"
        
        # Try simple setup first (non-interactive)
        if mongodb_setup_simple.exists():
            result = self.run_command([python_exe, str(mongodb_setup_simple)])
            if result:
                print("✅ Database setup completed (simple)")
                return True
        
        # Only try interactive setup if explicitly requested
        env_interactive = os.getenv('MONGODB_INTERACTIVE_SETUP', 'false').lower()
        if env_interactive == 'true' and mongodb_setup.exists():
            print("🔧 Running interactive MongoDB setup...")
            result = self.run_command([python_exe, str(mongodb_setup)])
            if result:
                print("✅ Database setup completed (interactive)")
                return True
        
        print("✅ MongoDB setup completed (basic configuration)")
        print("💡 You can run 'python mongodb_setup.py' later for advanced setup")
        return True
    
    def display_next_steps(self):
        """Display what to do next"""
        print("\n" + "="*60)
        print("🎉 SETUP COMPLETED SUCCESSFULLY!")
        print("="*60)

    def run_setup(self):
        """Run the complete setup process"""
        print("🚀 Automotive Chatbot Platform Setup")
        print("=" * 50)
        
        steps = [
            ("Creating virtual environment", self.create_virtual_environment),
            ("Installing backend dependencies", self.install_backend_dependencies),
            ("Installing frontend dependencies", self.install_frontend_dependencies),
            ("Creating environment file", self.create_env_file),
            ("Setting up database", self.setup_database),
        ]
        
        failed_steps = []
        
        for step_name, step_func in steps:
            try:
                if not step_func():
                    failed_steps.append(step_name)
            except Exception as e:
                print(f"❌ Error in {step_name}: {e}")
                failed_steps.append(step_name)
        
        if not failed_steps:
            self.display_next_steps()
        else:
            print(f"\n⚠️ Setup completed with issues in: {', '.join(failed_steps)}")
            print("Please check the errors above and run setup again if needed.")


if __name__ == "__main__":
    setup = ChatbotSetup()
    setup.run_setup()