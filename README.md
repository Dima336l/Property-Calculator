# PropertyPro - UK Property Sourcing & Analysis Platform

A simple, easy-to-use property investment platform built with Next.js, TypeScript, and Tailwind CSS. No login required - just install and start using immediately!

## 🚀 Features

### Property Sourcing
- **Advanced Search**: Search across UK property portals with powerful filters
- **Sourcing Filters**: Find properties that are:
  - In need of modernisation
  - Back on the market
  - Reduced in price
  - Repossessed
  - In potential negative equity
- **Email Alerts**: Get instant notifications for matching properties

### Investment Analysis
- **BTL Calculator**: Calculate Buy-to-Let returns, yields, and cash flow
- **BRR Calculator**: Analyze Buy, Refurbish, Refinance deals with capital extraction
- **HMO Calculator**: Calculate returns for House in Multiple Occupation properties
- **Area Demographics**: Access detailed local market data
- **Sales Comparables**: View recent sales in the area

### Deal Management
- **Property Pipeline**: Track properties from discovery to completion
- **Custom Labels**: Organize properties with tags and categories
- **Notes & Status**: Add notes and update deal status
- **Deal Packaging**: Generate professional brochures and deal packages
- **D2V Letters**: Send Direct to Vendor letters for off-market leads

### Professional Tools
- **One-Click Brochures**: Create investor-ready deal packages
- **Financial Reports**: Comprehensive ROI and cash flow analysis
- **Portfolio Tracking**: Manage multiple properties and deals
- **Export Options**: Download data and reports

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Run the application:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser and start using it!

**That's it!** No login, no signup, no configuration needed. Just start searching for properties!

## 🏗️ Project Structure

```
├── app/
│   ├── calculators/     # BTL, BRR, HMO calculators
│   ├── packaging/      # Deal packaging & brochures
│   ├── pipeline/       # Property pipeline tracking
│   ├── property/       # Property detail pages
│   ├── search/         # Property search interface
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Landing page
│   └── globals.css     # Global styles
├── components/
│   └── Header.tsx      # Navigation header
├── public/             # Static assets
└── package.json        # Dependencies
```

## 🎨 Key Pages

### Landing Page (`/`)
- Hero section with CTA
- Feature highlights
- Social proof and testimonials
- Pricing overview

### Search Page (`/search`)
- Advanced property search
- Multiple filter options
- Property grid with details
- Save to pipeline

### Property Detail (`/property/[id]`)
- Full property information
- Image gallery
- Financial metrics
- Area data and comparables
- Action buttons (analyze, save, contact)

### Calculators (`/calculators`)
- BTL (Buy-to-Let) calculator
- BRR (Buy, Refurb, Refinance) calculator
- HMO (House in Multiple Occupation) calculator
- Real-time calculations
- Comprehensive financial metrics

### Pipeline (`/pipeline`)
- Property tracking dashboard
- Status management
- Labels and notes
- Quick actions

### Deal Packaging (`/packaging`)
- Professional brochure generator
- Customizable templates
- Include/exclude sections
- PDF export and email

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Future Enhancements

- [ ] Backend API integration
- [ ] Real property portal integration (Rightmove, Zoopla APIs)
- [ ] Database integration for saving properties
- [ ] Email notification system for alerts
- [ ] Advanced analytics dashboard
- [ ] Export data to Excel/CSV
- [ ] API for third-party integrations
- [ ] Automated property alerts

## 📝 License

This project is for demonstration purposes. All rights reserved.

## 🤝 Contributing

This is a demo project. For any questions or suggestions, please open an issue.

## 📧 Contact

For support or inquiries: [email protected]

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

