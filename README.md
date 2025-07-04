# Le Crochet

A revolutionary coding platform for creating, visualizing, and selling crochet patterns through a custom programming language and real-time 2D diagram rendering.

## 🧶 Overview

Le Crochet transforms crochet pattern creation into a coding experience. Write patterns using our intuitive CrochetScript language on the left side of the screen and watch your 2D diagrams render in real-time on the right, similar to Overleaf's LaTeX editor. Share and sell your coded patterns in our integrated marketplace.

## ✨ Core Features

### CrochetScript Language
- **Intuitive Syntax**: Easy-to-learn language specifically designed for crochet patterns
- **Real-time Compilation**: See your pattern diagram update as you type
- **Error Highlighting**: Syntax errors and pattern inconsistencies highlighted inline
- **Auto-completion**: Smart suggestions for stitches, functions, and variables
- **Pattern Libraries**: Import and extend existing pattern modules

### Live 2D Diagram Rendering
- **Split-screen Interface**: Code on the left, diagram on the right (Overleaf-style)
- **SVG-based Rendering**: Scalable, crisp diagrams using optimized SVG assets
- **International Symbol Support**: Toggle between US and UK crochet symbols
- **Responsive Zoom**: Pan and zoom through complex pattern diagrams
- **Print-ready Export**: High-resolution PDF and PNG exports

### Marketplace
- **Pattern Sales**: Sell your coded patterns with 15% platform commission
- **Code Sharing**: Share patterns as forkable repositories
- **Version Control**: Track pattern iterations and changes
- **Creator Profiles**: Showcase your pattern coding portfolio
- **Reviews & Ratings**: Community feedback on pattern quality and code clarity

### Development Environment
- **Syntax Highlighting**: Color-coded CrochetScript for better readability
- **Line Numbers**: Easy navigation through complex patterns
- **Bracket Matching**: Visual matching of loops and function blocks
- **Find & Replace**: Advanced search functionality
- **Code Folding**: Collapse sections for better organization

## 🏗️ Technical Architecture

### Frontend (Next.js 14+)
```
├── components/
│   ├── CodeEditor/
│   ├── DiagramRenderer/
│   ├── LanguageServer/
│   ├── Marketplace/
│   └── Toolbar/
├── pages/
│   ├── editor/
│   ├── gallery/
│   ├── marketplace/
│   ├── docs/
│   └── pattern/[id]/
├── lib/
│   ├── crochetscript/
│   ├── compiler/
│   ├── renderer/
│   └── svg-loader/
├── public/
│   ├── symbols/
│   │   ├── us/
│   │   ├── uk/
│   │   └── generic/
│   └── icons/
└── styles/
```

**Key Technologies:**
- **Monaco Editor**: Advanced code editing with IntelliSense
- **Custom Compiler**: CrochetScript to SVG transformation
- **SVG Manipulation**: Dynamic diagram generation
- **WebWorkers**: Non-blocking pattern compilation
- **PWA**: Offline pattern coding

### Backend (Node.js/TypeScript)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: AWS S3 for pattern code and compiled diagrams
- **Authentication**: JWT with refresh tokens
- **Payment Processing**: Stripe integration
- **Pattern Parser**: Server-side CrochetScript compiler

### CrochetScript Language Features
- **Declarative Syntax**: Focus on what to create, not how to render
- **Pattern Inheritance**: Extend and modify existing patterns
- **Variables & Functions**: Reusable code components
- **Loops & Conditionals**: Complex pattern logic
- **Modular Design**: Import/export pattern modules

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Stripe account (for payments)
- AWS account (for file storage)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/le-crochet.git
cd le-crochet

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run db:migrate

# Start development servers
npm run dev        # Frontend (port 3000)
npm run dev:api    # Backend (port 8000)
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lecrochet_db"

# File Storage
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_BUCKET_NAME="lecrochet-patterns"
AWS_REGION="us-east-1"

# Authentication
JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_refresh_secret"

# Payment Processing
STRIPE_PUBLIC_KEY="your_stripe_public_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_webhook_secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
API_URL="http://localhost:8000"
```

## 💡 CrochetScript Language Guide

### Basic Syntax
```crochet
// Define a simple chain
chain(10)

// Create a single crochet row
row {
  sc(8)
  ch(1)
  turn
}

// Loop for multiple rows
repeat(5) {
  row {
    sc(8)
    ch(1)
    turn
  }
}
```

### Advanced Features
```crochet
// Variables and functions
let width = 20
let height = 15

function granny_square(size) {
  magic_ring {
    ch(3)
    dc(2)
    ch(2)
    repeat(3) {
      dc(3)
      ch(2)
    }
    join
  }
}

// Pattern inheritance
import "basic_scarf" as scarf

pattern my_scarf extends scarf {
  width = 25
  add_fringe = true
}
```

### Color and Yarn Management
```crochet
// Define colors
colors {
  A = "Red Heart Super Saver - Cherry Red"
  B = "Bernat Softee Baby - White"
  C = "Caron Simply Soft - Dark Country Blue"
}

// Use colors in patterns
with_color(A) {
  sc(10)
}
with_color(B) {
  sc(10)
}
```

## 🎨 SVG Asset System

### Symbol Library Structure
```
public/symbols/
├── us/                    # US terminology symbols
│   ├── chain.svg
│   ├── single_crochet.svg
│   ├── double_crochet.svg
│   ├── treble_crochet.svg
│   └── slip_stitch.svg
├── uk/                    # UK terminology symbols
│   ├── chain.svg
│   ├── double_crochet.svg
│   ├── treble_crochet.svg
│   ├── double_treble.svg
│   └── slip_stitch.svg
└── generic/               # Universal symbols
    ├── magic_ring.svg
    ├── decrease.svg
    ├── increase.svg
    └── color_change.svg
```

### Symbol Customization
- **Dynamic Coloring**: SVG symbols accept color parameters
- **Scalable Design**: Vector-based for all zoom levels
- **Accessibility**: Alt text and screen reader support
- **Themeable**: Dark/light mode compatible

## 💰 Revenue Model

### Platform Commission
- **15% commission** on all pattern sales
- Creators keep 85% of revenue
- Transparent fee structure with no hidden costs

### Premium Features (Optional)
- **Basic Account**: Free pattern coding and basic rendering
- **Creator Pro ($4.99/month)**:
  - Advanced compiler optimizations
  - Private pattern repositories
  - Enhanced analytics and insights
  - Priority marketplace placement
  - Custom SVG symbol uploads

### Additional Revenue Streams
- **Featured Listings**: Paid promotion in marketplace
- **Educational Content**: Premium CrochetScript tutorials
- **Enterprise Solutions**: Custom language extensions for yarn companies

## 🗂️ Project Structure

```
le-crochet/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor/
│   │   │   ├── DiagramRenderer/
│   │   │   ├── LanguageServer/
│   │   │   └── Marketplace/
│   │   ├── lib/
│   │   │   ├── crochetscript/
│   │   │   ├── compiler/
│   │   │   └── svg-renderer/
│   │   ├── pages/
│   │   └── styles/
│   ├── public/
│   │   ├── symbols/
│   │   └── templates/
│   └── package.json
├── backend/                 # Node.js/TypeScript API
│   ├── src/
│   │   ├── routes/
│   │   ├── compiler/
│   │   ├── models/
│   │   ├── services/
│   │   └── middleware/
│   └── package.json
├── language/               # CrochetScript language definition
│   ├── grammar/
│   ├── semantics/
│   └── stdlib/
├── docs/                   # Documentation
└── docker/                 # Container configurations
```

## 🧪 Development Roadmap

### Phase 1: Core Platform (Months 1-2)
- CrochetScript language design and parser
- Basic code editor with syntax highlighting
- Simple SVG diagram rendering
- User authentication

### Phase 2: Advanced Editor (Months 3-4)
- Real-time compilation and error checking
- Auto-completion and IntelliSense
- Advanced SVG rendering with symbols
- Pattern export functionality

### Phase 3: Marketplace (Months 5-6)
- Pattern sharing and versioning
- Payment processing integration
- Creator dashboard and analytics
- Community features and reviews

### Phase 4: Enhancement (Months 7-8)
- Mobile-responsive editor
- Advanced language features
- Performance optimization
- Educational content and tutorials

## 🛠️ API Endpoints

### Pattern Management
```
GET    /api/patterns              # List patterns
POST   /api/patterns              # Create pattern
GET    /api/patterns/:id          # Get pattern code
PUT    /api/patterns/:id          # Update pattern
DELETE /api/patterns/:id          # Delete pattern
POST   /api/patterns/:id/compile  # Compile pattern to SVG
```

### Language Server
```
POST   /api/language/parse        # Parse CrochetScript code
POST   /api/language/validate     # Validate pattern syntax
GET    /api/language/symbols      # Get available symbols
POST   /api/language/autocomplete # Auto-completion suggestions
```

### Marketplace
```
GET    /api/marketplace           # Browse marketplace
POST   /api/marketplace/:id/purchase  # Purchase pattern
GET    /api/sales                 # Creator sales data
POST   /api/patterns/:id/publish  # Publish to marketplace
```

## 🤝 Contributing

We welcome contributions from the crochet and developer communities!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests for language features
- Ensure SVG assets are optimized for web delivery
- Update documentation for language changes
- Test pattern compilation thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♀️ Support

- **Documentation**: [docs.lecrochet.com](https://docs.lecrochet.com)
- **Language Reference**: [lang.lecrochet.com](https://lang.lecrochet.com)
- **Community Discord**: [Join our server](https://discord.gg/lecrochet)
- **Email Support**: support@lecrochet.com
- **Bug Reports**: Use GitHub Issues

## 🏆 Acknowledgments

- Crochet community for pattern validation and feedback
- Monaco Editor team for the excellent code editing experience
- Overleaf team for inspiration on the split-screen interface
- SVG community for scalable graphics standards
- Open source crochet symbol libraries

---

*Code your crochet patterns to life* 🧶💻✨

