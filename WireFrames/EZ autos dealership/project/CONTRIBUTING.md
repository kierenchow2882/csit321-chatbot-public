# Contributing to EZ Autos

Thank you for your interest in contributing to EZ Autos! This document provides guidelines and instructions for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- Git

### Setup Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ez-autos.git
   cd ez-autos
   ```
3. **Run the setup script**:
   ```bash
   # On macOS/Linux:
   chmod +x setup.sh
   ./setup.sh
   
   # On Windows:
   setup.bat
   ```

## 🔧 Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Follow the coding standards outlined below
- Write tests for new functionality
- Update documentation as needed

### 3. Test Your Changes
```bash
# Backend tests
python manage.py test

# Frontend linting
npm run lint

# Manual testing
# Start both servers and test functionality
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```
Then create a pull request on GitHub.

## 📝 Coding Standards

### Backend (Django/Python)
- Follow PEP 8 style guidelines
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Keep functions small and focused
- Use type hints where appropriate

```python
def calculate_monthly_payment(principal: float, rate: float, term: int) -> float:
    """
    Calculate monthly loan payment.
    
    Args:
        principal: Loan amount
        rate: Annual interest rate (as decimal)
        term: Loan term in months
    
    Returns:
        Monthly payment amount
    """
    monthly_rate = rate / 12
    return (principal * monthly_rate * (1 + monthly_rate) ** term) / ((1 + monthly_rate) ** term - 1)
```

### Frontend (React/TypeScript)
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and reusable
- Use meaningful prop and variable names

```typescript
interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect?: (vehicle: Vehicle) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect }) => {
  // Component implementation
};
```

### CSS/Styling
- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use semantic class names for custom CSS

## 🧪 Testing Guidelines

### Backend Testing
- Write unit tests for models and views
- Test API endpoints
- Test authentication and authorization
- Use Django's test framework

```python
from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Profile

class ProfileTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_profile_creation(self):
        profile = Profile.objects.create(user=self.user, role='user')
        self.assertEqual(profile.role, 'user')
```

### Frontend Testing
- Test component rendering
- Test user interactions
- Test API integration
- Use React Testing Library

## 📚 Documentation

### Code Documentation
- Add comments for complex logic
- Update README.md for new features
- Document API endpoints
- Include examples in documentation

### Commit Messages
Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Examples:
```
feat: add vehicle search functionality
fix: resolve login authentication issue
docs: update API documentation
style: format code with prettier
refactor: extract common utility functions
test: add unit tests for vehicle model
chore: update dependencies
```

## 🐛 Bug Reports

When reporting bugs, please include:
1. **Description** of the issue
2. **Steps to reproduce** the bug
3. **Expected behavior**
4. **Actual behavior**
5. **Environment details** (OS, browser, versions)
6. **Screenshots** if applicable

## 💡 Feature Requests

When suggesting features:
1. **Describe the feature** clearly
2. **Explain the use case** and benefits
3. **Provide examples** if possible
4. **Consider implementation** complexity

## 🔍 Code Review Process

### For Contributors
- Ensure your code follows the style guidelines
- Write clear commit messages
- Include tests for new functionality
- Update documentation as needed

### For Reviewers
- Check code quality and style
- Verify functionality works as expected
- Ensure tests pass
- Provide constructive feedback

## 📋 Pull Request Checklist

Before submitting a pull request:

- [ ] Code follows project style guidelines
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Commit messages follow conventional format
- [ ] No merge conflicts
- [ ] Feature works in both development and production builds

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the code of conduct
- Ask questions when unsure

## 📞 Getting Help

If you need help:
1. Check existing documentation
2. Search existing issues
3. Ask questions in discussions
4. Contact maintainers

Thank you for contributing to EZ Autos! 🚗💨