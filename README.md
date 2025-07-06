# Le Crochet

A modern crochet pattern creation platform that lets you write patterns using CrocheTeX and visualize them in real-time with 2D diagrams and 3D models.

## 🧶 Overview

Le Crochet transforms crochet pattern creation into a coding experience. Write patterns using our CrocheTeX language on the left side of the screen and watch your diagrams render in real-time on the right, similar to Overleaf's LaTeX editor. The platform supports both traditional 2D symbol charts and innovative 3D visualizations.

## ✨ Current Features

### CrocheTeX Language & Compiler
- **Custom Language**: CrocheTeX syntax specifically designed for crochet patterns
- **Real-time Compilation**: See your pattern update as you type with live error checking
- **Pattern Types**: Support for linear, circular, and granny square patterns
- **Advanced Stitches**: Comprehensive stitch library including post stitches, clusters, and shells
- **Safety Limits**: Built-in protection against performance-degrading operations

### Interactive Code Editor
- **Monaco Editor**: Professional code editing experience with syntax highlighting
- **Auto-completion**: Smart suggestions for stitches and CrocheTeX syntax
- **Error Highlighting**: Real-time error and warning indicators
- **Pattern Examples**: Pre-built examples to get started quickly

### Live Visualization
- **2D Diagrams**: Traditional crochet symbol charts with pan and zoom
- **3D Models**: Interactive 3D visualization showing stitch structure and yarn flow
- **View Toggle**: Switch between 2D and 3D views instantly
- **SVG Rendering**: Scalable vector graphics for crisp diagrams at any zoom level

### Pattern Management
- **Example Patterns**: Built-in library including basic scarf, granny square, circular doily
- **Download Patterns**: Export your CrocheTeX code as text files
- **Pattern Validation**: Comprehensive error checking and suggestions

### User Experience
- **Google Authentication**: Secure login with NextAuth
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Dark/Light Mode**: Theme support for different preferences

## 🛠️ Technical Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with TypeScript
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Monaco Editor**: VS Code editor in the browser
- **Three.js**: 3D rendering and visualization
- **React Three Fiber**: React bindings for Three.js
- **Framer Motion**: Smooth animations and transitions

### Authentication & APIs
- **NextAuth**: Authentication with Google OAuth
- **API Routes**: Built-in Next.js API handling

### Development Tools
- **ESLint**: Code linting and formatting
- **Vercel Analytics**: Performance monitoring
- **PostCSS**: CSS processing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Google OAuth credentials (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/le-crochet.git
cd le-crochet

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Google OAuth credentials

# Start development server
npm run dev
```

### Environment Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
```

## 💡 CrocheTeX Language

### Basic Syntax
```crochet
// Foundation chain
chain(30)
turn

// Single crochet row
sc(28)
ch(1)
turn

// Repeat pattern
repeat(10) {
  sc(28)
  ch(1)
  turn
}

end
```

### Circular Patterns
```crochet
// Magic ring start
magic_ring {
  sc(8)
  join
}

// Increase round
round {
  repeat(8) {
    sc(2)
  }
  join
}
```

### Granny Square
```crochet
// Classic granny square
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
```

## 🎨 Pattern Visualization

### 2D Symbol Charts
- Traditional crochet symbols
- Pan and zoom functionality
- Stitch numbering for linear patterns
- Grid background for reference

### 3D Visualization
- Interactive 3D models showing stitch structure
- Yarn flow visualization with bezier curves
- Orbit controls for rotation and zoom
- Vertex highlighting for stitch identification

## 🏗️ Project Structure

```
le-crochet/
├── app/
│   ├── (site)/                    # Marketing pages
│   ├── create/                    # Pattern creation interface
│   ├── api/auth/                  # Authentication API
│   └── layout.tsx                 # Root layout
├── components/
│   ├── create/                    # Pattern creation components
│   ├── ui/                        # Reusable UI components
│   └── site/                      # Site-wide components
├── lib/
│   ├── enhanced-crochet-compiler.ts  # CrocheTeX compiler
│   ├── 3d-pattern-processor.ts      # 3D geometry processing
│   ├── pattern-examples.ts          # Example patterns
│   └── stitch-mappings.ts           # Stitch-to-SVG mappings
├── hooks/
│   └── use-diagram-transform.ts   # Pan/zoom functionality
└── public/
    └── stitches/                  # SVG stitch symbols
```

## 🔮 Future Roadmap

The following features are planned but not yet implemented:

### Marketplace (Planned)
- Pattern sharing and sales
- Creator profiles and portfolios
- Payment processing integration
- Community features and reviews

### Advanced Features (Planned)
- Pattern version control
- Collaborative editing
- Advanced 3D rendering
- Mobile app development
- Pattern export to PDF
- International symbol support

### Backend Infrastructure (Planned)
- Database integration
- User pattern storage
- Advanced authentication
- File storage system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♀️ Support

- **GitHub Issues**: Report bugs and request features
- **Email**: Contact for general inquiries

---

*Code your crochet patterns to life* 🧶💻✨

