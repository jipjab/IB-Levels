# Quick Plan Reference Card

## 📁 Your Planning Documents

1. **`iblevels-current.plan.md`** - Current state of your IBLevels project
2. **`PROJECT_PLAN_TEMPLATE.md`** - Reusable template for new projects
3. **`PLAN_DOCUMENTATION.md`** - Complete guide on using the template
4. **`QUICK_PLAN_REFERENCE.md`** - This quick reference (you are here)

---

## 🚀 Quick Start: New Project in 5 Minutes

```bash
# 1. Copy the template
cp PROJECT_PLAN_TEMPLATE.md /path/to/new-project/PROJECT_PLAN.md

# 2. Open in your editor
code /path/to/new-project/PROJECT_PLAN.md

# 3. Search and replace (Cmd/Ctrl + F):
[PROJECT NAME] → Your Project Name
[CORE FEATURE] → Your Main Feature
[TARGET USERS] → Your Target Audience
[PRIMARY DATA SOURCE] → Your Data Source

# 4. Delete sections you don't need

# 5. Start building!
```

---

## 🔍 Key Placeholders to Replace

### Essential (Replace First)
- `[PROJECT NAME]` - Name of your project
- `[CORE FEATURE]` - Main functionality description
- `[TARGET USERS]` - Who will use this
- `[PRIMARY DATA SOURCE]` - Where data comes from

### Features & Components
- `[FEATURE 1-6]` - Your specific features
- `[Component Name]` - Your component names
- `[endpoint-name]` - Your API endpoints
- `[Main Feature]` - Your primary feature component

### Configuration
- `[API_KEY_NAME]` - Your API key variable name
- `[YOUR_API_KEY]` - Your actual API key
- `[YOUR_ID]` - Your affiliate/service IDs

### Metrics & Timeline
- `[X]` - Numbers (time, money, users, etc.)
- `[X-Y]` - Ranges for estimates
- `[Date]` - Dates for timeline

---

## ✅ Pre-Launch Checklist

Copy this into your project and check off as you go:

### Development
- [ ] Core features implemented
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Production build successful
- [ ] All tests pass (if applicable)

### Performance
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] API responses cached
- [ ] Code splitting implemented
- [ ] Load time < 3 seconds

### Security
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] Environment variables secured
- [ ] Input validation implemented
- [ ] SSL certificate configured

### SEO
- [ ] Meta tags optimized
- [ ] Open Graph tags added
- [ ] robots.txt created
- [ ] sitemap.xml generated
- [ ] Semantic HTML used

### Documentation
- [ ] README.md complete
- [ ] Environment variables documented
- [ ] Deployment guide written
- [ ] API endpoints documented
- [ ] Troubleshooting guide created

### Pre-Deploy
- [ ] All environment variables set
- [ ] API keys obtained
- [ ] Domain purchased (if needed)
- [ ] Analytics configured
- [ ] Error tracking setup

---

## 📊 Standard Project Structure

Use this structure for consistency:

```
your-project/
├── app/
│   ├── api/
│   │   └── [your-endpoint]/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── icon.tsx
│   └── apple-icon.tsx
│
├── components/
│   ├── [MainFeature].tsx
│   ├── [FilterPanel].tsx
│   ├── [DataDisplay].tsx
│   ├── ThemeToggle.tsx
│   └── Logo.tsx
│
├── lib/
│   ├── [dataSource].ts
│   ├── [calculations].ts
│   ├── types.ts
│   ├── cache.ts
│   └── rateLimit.ts
│
├── public/
│   └── [static assets]
│
├── docs/
│   ├── README.md
│   ├── DEPLOYMENT.md
│   └── API.md
│
├── .env.local (not in git)
├── .env.template (in git)
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## 🎯 Development Phases (Standard Timeline)

### Phase 1: MVP (2-4 weeks)
- [ ] Core feature
- [ ] Basic UI
- [ ] Data integration
- [ ] Error handling
- [ ] Mobile responsive

### Phase 2: Enhancement (2-3 weeks)
- [ ] Advanced features
- [ ] Filtering/search
- [ ] Data export
- [ ] Performance optimization

### Phase 3: Polish (1-2 weeks)
- [ ] Dark mode
- [ ] Animations
- [ ] SEO optimization
- [ ] Analytics
- [ ] Monetization (if applicable)

### Phase 4: Growth (Ongoing)
- [ ] Premium features
- [ ] API
- [ ] Mobile app
- [ ] Community features

---

## 💰 Hosting Cost Quick Reference

| Platform | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| **Vercel** | Yes, generous | $20/mo | Next.js apps (recommended) |
| **Netlify** | Yes | $19/mo | Static sites & SSR |
| **Railway** | $5 credit | ~$5/mo | Apps with databases |
| **DigitalOcean** | No | $5-12/mo | Full control, VPS |
| **AWS Amplify** | 12mo free | Variable | AWS ecosystem |

**Typical Total Cost**:
- **Development**: $0
- **MVP Launch**: $0-5/month (free tier + domain)
- **Growing App**: $5-20/month (hosting + domain)
- **Scaling**: $20-100/month (premium hosting + services)

---

## 🔧 Essential Environment Variables

Every project should have:

```bash
# Required
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional but Recommended
CACHE_DURATION=300
API_RATE_LIMIT=60
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Project Specific
[YOUR_API_KEY]=[key]
[YOUR_SERVICE_ID]=[id]
```

**Always**:
- Keep in `.env.local` (not committed)
- Document in `.env.template` (committed)
- Set in deployment platform UI

---

## 📈 Success Metrics Template

Track these for every project:

### Launch Day
- Unique visitors: ___
- Page views: ___
- Bounce rate: ___%
- Avg session: ___ min

### Week 1
- Total users: ___
- Returning users: ___%
- Error rate: ___%
- Performance score: ___/100

### Month 1
- Monthly users: ___
- Growth rate: ___%
- Conversion rate: ___%
- Revenue: $___ (if applicable)

### Month 3
- Monthly users: ___
- MoM growth: ___%
- User retention: ___%
- Revenue: $___ (if applicable)

---

## 🎨 Design System Checklist

For consistent UI across projects:

### Colors
- [ ] Primary color defined
- [ ] Secondary/accent color
- [ ] Dark mode palette
- [ ] Success/error/warning colors
- [ ] Neutral grays (5-7 shades)

### Typography
- [ ] Font family chosen
- [ ] Font sizes defined (6-8 sizes)
- [ ] Line heights set
- [ ] Font weights specified
- [ ] Letter spacing adjusted

### Spacing
- [ ] Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- [ ] Consistent padding
- [ ] Consistent margins
- [ ] Grid system

### Components
- [ ] Button variants
- [ ] Input styles
- [ ] Card styles
- [ ] Navigation components
- [ ] Loading states

---

## 🐛 Common Issues & Quick Fixes

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript Errors
```bash
# Check types without building
npm run type-check

# Common fix: update tsconfig.json
```

### Deployment Issues
```bash
# Test production build locally
npm run build
npm start

# Check environment variables are set
```

### Performance Issues
- Enable caching in API routes
- Use Next.js Image component
- Implement code splitting
- Minimize client-side JavaScript

---

## 📚 Essential Reading

Before starting your project, review:

1. **Next.js Docs**: https://nextjs.org/docs
2. **React Docs**: https://react.dev
3. **TypeScript Handbook**: https://www.typescriptlang.org/docs
4. **TailwindCSS Docs**: https://tailwindcss.com/docs
5. **Web.dev Performance**: https://web.dev/performance

---

## 🆘 When You're Stuck

1. **Check the template** - See if there's guidance
2. **Review IBLevels example** - See how it was done there
3. **Read the full documentation** - `PLAN_DOCUMENTATION.md`
4. **Search the docs** - Framework/library documentation
5. **Ask the community** - Stack Overflow, Discord, Reddit

---

## 💡 Pro Tips

1. **Start with MVP** - Ship early, iterate fast
2. **Document as you go** - Don't wait until the end
3. **Test on real devices** - Desktop + mobile
4. **Monitor from day 1** - Analytics and error tracking
5. **Get feedback early** - Show to users ASAP
6. **Keep dependencies minimal** - Only add what you need
7. **Version everything** - Git commit often
8. **Deploy frequently** - Use preview deployments

---

## ✨ Success Formula

```
Great Product = 
  Clear Plan (this template) +
  Solid Tech Stack (Next.js + TypeScript) +
  User Feedback (early and often) +
  Iterative Development (ship, measure, improve) +
  Good Documentation (help others help you)
```

---

**Keep this file handy!** Bookmark or print for quick reference during development.

**Questions?** Refer to `PLAN_DOCUMENTATION.md` for detailed explanations.

**Ready to start?** Copy `PROJECT_PLAN_TEMPLATE.md` and begin!

