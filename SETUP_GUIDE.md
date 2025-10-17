# Complete Setup Guide

## 🚀 Quick Installation

1. **Install Dependencies**
```bash
npm install
```

This will install:
- ✅ Next.js & React (frontend framework)
- ✅ Tailwind CSS (styling)
- ✅ Puppeteer (web scraping)
- ✅ jsPDF (PDF export)
- ✅ Node-cache (caching scraper results)

2. **Run the Application**
```bash
npm run dev
```

3. **Open in Browser**
Navigate to: http://localhost:3000

**That's it! No login, no configuration needed.**

---

## 📊 Features Overview

### 1. Web Scraping (Real Property Data)

**What it does:**
- Scrapes live property listings from Rightmove & Zoopla
- Extracts: price, bedrooms, bathrooms, address, images, etc.
- Detects special flags: "Reduced in Price", "Needs Modernisation"
- Calculates estimated rental yields

**Rate Limiting (Important!):**
- Max **8 requests per minute** to avoid being blocked
- **3 second delay** between requests
- **30 minute caching** - results are saved to avoid repeated scraping
- Browser runs in headless mode (invisible)

**How to Use:**
1. Go to `/search` page
2. Enter a location (e.g., "Manchester", "Birmingham", "London")
3. Select source: Rightmove or Zoopla
4. Add filters (price, bedrooms, etc.)
5. Click "Search"
6. Wait 10-30 seconds while it scrapes
7. Results will display

**First Search = Slow (scraping)**
**Repeat Search = Fast (cached for 30 min)**

### 2. PDF Export from Calculators

**What it does:**
- Exports your deal analysis as a professional PDF
- Includes all inputs and calculated results
- Formatted with colors and sections
- Ready to share with investors

**How to Use:**
1. Go to `/calculators`
2. Choose calculator type (BTL, BRR, or HMO)
3. Fill in all the fields
4. See live results update
5. Click **"Export PDF"** button (top right of results)
6. PDF downloads automatically

**PDF Includes:**
- ✅ All purchase details
- ✅ Rental income & costs
- ✅ Investment returns (highlighted)
- ✅ ROI, Yields, Cash Flow
- ✅ Date generated
- ✅ Professional formatting

### 3. Property Search with Filters

**Available Filters:**
- Price range (min/max)
- Number of bedrooms
- Property type (house/flat/bungalow)
- Sourcing filters:
  - Needs Modernisation
  - Reduced in Price
  
**How Properties are Flagged:**
- **Reduced in Price**: Scraped from listing if price was dropped
- **Needs Modernisation**: Detected from description keywords

### 4. Property Pipeline

**Track Your Deals:**
- Save properties you're interested in
- Add custom labels (BTL, BRR, HMO)
- Add notes
- Update status (Watching → Contacted → Viewing → Offer Made → Completed)
- Quick access to analyze or view details

**Note:** Currently data resets on page refresh. To persist data, you can add localStorage (simple) or a database (advanced).

### 5. Deal Packaging

**Generate Investor Brochures:**
- Professional property brochures
- Customize what to include
- Add your contact details
- Download as PDF or email

---

## ⚙️ Technical Details

### Rate Limiter

Location: `lib/scraper/rate-limiter.ts`

```typescript
// Current settings
maxRequestsPerWindow: 8,     // Max 8 requests
windowMs: 60000,             // Per 60 seconds (1 minute)
delayBetweenRequests: 3000   // 3 seconds between each request
```

**To adjust:**
- Increase `maxRequestsPerWindow` for faster scraping (risk of being blocked)
- Decrease for safer, slower scraping
- Increase `delayBetweenRequests` to be more polite

### Caching

Location: `lib/scraper/cache.ts`

```typescript
// Current settings
stdTTL: 1800  // 30 minutes cache
```

**To adjust:**
- Increase for longer cache (less scraping)
- Decrease for fresher data (more scraping)

**Clear cache manually:**
```bash
# Call the API endpoint
curl -X POST http://localhost:3000/api/properties/clear-cache
```

Or just wait 30 minutes for auto-refresh.

### Scraped Property Sites

**Rightmove:**
- URL: `https://www.rightmove.co.uk/`
- Coverage: UK-wide
- Data: Price, beds, baths, address, images, reduced prices

**Zoopla:**
- URL: `https://www.zoopla.co.uk/`
- Coverage: UK-wide
- Data: Similar to Rightmove

**Note:** Web scraping structure may break if these sites update their HTML. You'll need to update the selectors in `lib/scraper/rightmove-scraper.ts`.

---

## 🐛 Troubleshooting

### Problem: "No properties found"

**Solutions:**
1. Check your internet connection
2. Try a different location
3. Try switching from Rightmove to Zoopla (or vice versa)
4. Clear cache: http://localhost:3000/api/properties/clear-cache
5. Check console for errors (F12 in browser)

### Problem: "Scraping is very slow"

**Normal!** First search takes 10-30 seconds because it:
1. Opens a headless browser
2. Navigates to property site
3. Waits for page to load
4. Extracts data from multiple properties
5. Processes and formats results

**Subsequent searches** (same criteria) will be instant (cached).

### Problem: "Browser/Puppeteer errors"

```bash
# Reinstall Puppeteer with browser
npm install puppeteer --force
```

On Windows, you might need:
```bash
# Run as administrator
npm install puppeteer --unsafe-perm=true
```

### Problem: "PDF export not working"

Check if jsPDF is installed:
```bash
npm install jspdf html2canvas
```

### Problem: "Rate limit reached"

You'll see: `Rate limit reached. Waiting...`

**Solutions:**
1. Wait 1 minute for the window to reset
2. Use cached results (same search within 30 min)
3. Adjust rate limiter settings (see above)

---

## 📖 Daily Workflow

### Morning Routine

1. **Open app**: http://localhost:3000
2. **Go to Search**: `/search`
3. **Set your criteria**:
   - Location: Your target area
   - Price range: Your budget
   - Bedrooms: Your preference
   - Enable "Reduced in Price" filter
4. **Search** - first search = slow (scraping), subsequent = instant (cached)
5. **Browse results** - click any property for details
6. **Add to Pipeline** - save interesting ones

### Analyzing Deals

1. **Go to Calculators**: `/calculators`
2. **Choose strategy**: BTL / BRR / HMO
3. **Enter property details**:
   - Purchase price (from search)
   - Your deposit
   - Estimated rent (use local knowledge)
   - All costs (stamp duty, fees, refurb)
4. **See instant results**:
   - ROI
   - Cash flow
   - Yields
5. **Export PDF** if it's a good deal

### Sharing with Investors

1. **Go to Deal Packaging**: `/packaging`
2. **Customize brochure**:
   - Include financials
   - Include photos
   - Add your contact details
3. **Preview**
4. **Download PDF**
5. **Email to investor**

---

## 🔒 Legal & Ethical Considerations

### Web Scraping

**Legal:**
- ✅ Scraping publicly available data is generally legal in UK
- ⚠️ Check each website's Terms of Service
- ⚠️ Don't overload servers (we use rate limiting)
- ⚠️ Don't scrape copyrighted content

**Best Practices:**
- Respect robots.txt
- Use rate limiting (we do!)
- Cache results (we do!)
- Consider using official APIs when available

**Alternative to Scraping:**
- Sign up for Zoopla API (free tier available)
- Partner with Rightmove for data access
- Use property data providers (paid)

### Data Usage

- Don't redistribute scraped data commercially
- Use for personal investment research only
- Property images may be copyrighted
- Always verify data independently before investing

---

## 🚀 Production Deployment

### Option 1: Run Locally (Easiest)

```bash
# Keep it running on your computer
npm run dev
```

Access via: http://localhost:3000

### Option 2: Deploy to Vercel (Free)

```bash
npm install -g vercel
vercel
```

**Note:** Puppeteer may not work on Vercel's free tier (requires larger instance).

### Option 3: Deploy to VPS (Digital Ocean, AWS, etc.)

```bash
# Build for production
npm run build

# Start production server
npm run start
```

**Requirements:**
- Node.js 18+
- Chrome/Chromium (for Puppeteer)

---

## 📚 File Structure

```
├── app/
│   ├── api/
│   │   └── properties/
│   │       ├── search/route.ts      # Scraping API endpoint
│   │       └── clear-cache/route.ts # Cache management
│   ├── calculators/page.tsx         # BTL/BRR/HMO calculators
│   ├── packaging/page.tsx           # Deal brochure generator
│   ├── pipeline/page.tsx            # Property tracking
│   ├── property/[id]/page.tsx       # Property details
│   ├── search/page.tsx              # Property search
│   └── page.tsx                     # Landing page
│
├── lib/
│   ├── scraper/
│   │   ├── rightmove-scraper.ts     # Puppeteer scraping logic
│   │   ├── rate-limiter.ts          # Request throttling
│   │   └── cache.ts                 # Result caching
│   └── pdf-export.ts                # PDF generation
│
├── components/
│   └── Header.tsx                   # Navigation
│
└── package.json                     # Dependencies
```

---

## 💡 Tips & Tricks

### Finding Good Deals

1. **Use Multiple Searches**: Try different locations
2. **Filter Smart**: "Reduced in Price" often = motivated sellers
3. **Check Regularly**: New properties added daily
4. **Compare Sources**: Rightmove vs Zoopla may have different listings

### Calculator Tips

1. **Be Conservative**: Overestimate costs, underestimate rent
2. **Include Everything**: Don't forget stamp duty, legal fees, surveys
3. **Factor Voids**: Properties won't always be rented (budget 1-2 months)
4. **Maintenance**: Budget 10-15% of monthly rent

### Performance

1. **First Search = Slow**: Expected (scraping takes time)
2. **Repeat Search = Fast**: Cached for 30 minutes
3. **Different Filters = New Search**: Cache is per search criteria
4. **Clear Cache**: If you want fresh data, clear cache

---

## 🆘 Support

**Check Logs:**
```bash
# Terminal where you ran npm run dev
# Look for errors in the output
```

**Browser Console:**
```
F12 → Console tab
Look for error messages
```

**Common Issues:**
- Scraping fails → Check internet, try different site
- PDF not downloading → Check browser popup blocker
- Slow performance → Normal for first search, use cache

---

## 🎉 You're All Set!

Your friend can now:
- ✅ Search real properties from UK portals
- ✅ Analyze deals with professional calculators
- ✅ Export results as PDF
- ✅ Track properties in pipeline
- ✅ Generate investor brochures

**No login, no accounts, just use it!**

Happy property investing! 🏠💰

