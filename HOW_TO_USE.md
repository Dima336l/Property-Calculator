# How to Use PropertyPro

A simple guide for using the property sourcing platform.

## 🚀 Getting Started

1. Open your terminal/command prompt
2. Navigate to the project folder
3. Run:
```bash
npm install
npm run dev
```
4. Open your browser to: http://localhost:3000

**That's it! No login required.**

## 📱 Main Features

### 1. Search for Properties (`/search`)

**How to use:**
1. Click "Search Properties" in the navigation
2. Enter a location (e.g., "Manchester", "M1 4AA")
3. Use filters to narrow down:
   - **Price Range**: Set min/max price
   - **Bedrooms**: Select number of bedrooms
   - **Property Type**: House, flat, bungalow
   - **Sourcing Filters**: Special flags like:
     - ✅ Needs Modernisation
     - ✅ Back on Market
     - ✅ Reduced in Price
     - ✅ Repossessed
     - ✅ Negative Equity

4. Browse results and click any property to see details

### 2. Analyze Deals (`/calculators`)

**Three calculators available:**

#### BTL (Buy-to-Let) Calculator
Use for standard rental properties:
1. Enter purchase price
2. Add deposit amount
3. Enter expected monthly rent
4. See instant calculations:
   - Monthly cash flow
   - Annual return
   - ROI percentage
   - Gross & net yield

#### BRR (Buy, Refurb, Refinance) Calculator
For renovation projects:
1. Enter purchase price
2. Add refurbishment costs
3. Enter after-repair value (ARV)
4. See capital extraction calculations

#### HMO (House in Multiple Occupation) Calculator
For multi-room rentals:
1. Enter number of rooms
2. Set rent per room
3. Add all costs
4. See total monthly income and ROI

### 3. Track Properties (`/pipeline`)

**Organize your deals:**
1. Click "Pipeline" in navigation
2. View all saved properties
3. Properties are grouped by status:
   - 👀 Watching
   - 📞 Contacted
   - 🏠 Viewing Arranged
   - 💷 Offer Made
   - ✅ Under Offer
   - ✔️ Completed

4. Each property shows:
   - Address and price
   - Estimated yield
   - Your notes
   - Custom labels

5. Quick actions:
   - View full details
   - Run calculations
   - Edit information
   - Delete from pipeline

### 4. Create Deal Packages (`/packaging`)

**Generate professional brochures:**
1. Click "Deal Packaging" in navigation
2. Customize what to include:
   - ✅ Property photos
   - ✅ Financial analysis
   - ✅ Area demographics
   - ✅ Sales comparables

3. Add your contact details:
   - Your name
   - Company name
   - Email
   - Phone number

4. Preview the brochure
5. Download as PDF or email to investors

## 🎯 Tips & Tricks

### Finding Good Deals
1. Use the "Reduced in Price" filter - properties that have dropped in price
2. Look for "Needs Modernisation" - potential for added value
3. Check "Back on Market" - may indicate motivated seller
4. Sort by "Highest Yield" to find best returns

### Using Calculators
1. **Always account for all costs**: Don't forget stamp duty, legal fees, surveys
2. **Be conservative with rent estimates**: Better to underestimate
3. **Factor in void periods**: Properties won't always be rented
4. **Include maintenance**: Budget 10-15% of rent for repairs

### Organizing Your Pipeline
1. **Add notes immediately**: Record first impressions while fresh
2. **Use labels**: Tag properties by strategy (BTL, BRR, HMO)
3. **Update status regularly**: Keep pipeline current
4. **Review weekly**: Don't let good deals slip away

### Creating Brochures
1. **Always include financials**: Investors want to see numbers
2. **Add comparables**: Shows you've done research
3. **Keep it professional**: Use your full contact details
4. **Proofread**: Check all information before sending

## ⚡ Keyboard Shortcuts

- **Ctrl/Cmd + K**: Quick search (coming soon)
- **Back button**: Return to previous page
- All forms save automatically as you type

## 💾 Data Storage

**Currently:**
- All data is shown as examples (mock data)
- Pipeline data is reset when you refresh the page
- Calculations are performed in real-time

**To add persistence:**
- Data can be saved in browser localStorage (no backend needed)
- Or connect to a database for permanent storage

## 🔄 Regular Workflow

**Recommended daily routine:**

1. **Morning**: 
   - Check /search for new properties
   - Run filters for your target criteria
   - Add interesting properties to pipeline

2. **Midday**:
   - Review pipeline properties
   - Run calculator analysis on top picks
   - Update property status

3. **Evening**:
   - Generate brochures for best deals
   - Contact agents or investors
   - Clean up pipeline (remove dead leads)

## 🆘 Common Questions

**Q: Why can't I save properties?**
A: Currently uses mock data. Pipeline properties reset on page refresh. Can add localStorage to persist data.

**Q: Where does property data come from?**
A: Currently showing example data. Connect to Rightmove/Zoopla APIs for real listings.

**Q: Can I export data?**
A: Deal brochures can be downloaded as PDF. Excel export can be added if needed.

**Q: Can multiple people use this?**
A: Yes, but data won't sync between users. Each browser/computer has its own data.

**Q: How accurate are the calculations?**
A: Very accurate! All calculators use real formulas used by property investors.

## 📞 Need Help?

If something isn't working:
1. Try refreshing the page
2. Check browser console (F12) for errors
3. Make sure you ran `npm install` first
4. Restart the dev server (`npm run dev`)

---

**Remember:** This is a tool to help you analyze deals faster. Always do your own due diligence before investing!

