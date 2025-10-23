# Deployment Instructions

## 🚀 Quick Deployment to Vercel

### Prerequisites
- Node.js installed
- Vercel CLI installed (`npm i -g vercel`)
- GitHub account (optional, for automatic deployments)

### Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Build the Project**
```bash
npm run build
```

3. **Deploy to Vercel**
```bash
vercel --prod
```

4. **Set Environment Variables** (Optional - for OpenAI integration)
```bash
vercel env add OPENAI_API_KEY
```

## 🔧 Manual Deployment Options

### Option 1: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect it's a Vite project
4. Deploy with default settings

### Option 2: Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure redirects for SPA routing

### Option 3: GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add deploy script to package.json
3. Run: `npm run deploy`

## 🌐 Environment Configuration

### Local Development
- Uses simulated translation (no API keys needed)
- HTTPS required for speech recognition
- Use `https://localhost:5173` for testing

### Production
- Set `OPENAI_API_KEY` for real translation
- Configure CORS headers
- Enable HTTPS (automatic with Vercel)

## 📱 Mobile Testing

### Local Mobile Testing
1. Start dev server: `npm run dev --host`
2. Find your local IP address
3. Access from mobile: `https://YOUR_IP:5173`
4. Accept security warning (self-signed certificate)

### Production Mobile Testing
1. Deploy to Vercel
2. Test on mobile devices
3. Verify HTTPS is working
4. Test speech recognition

## 🔒 Security Considerations

### HTTPS Requirements
- Speech recognition requires HTTPS
- Vercel provides automatic HTTPS
- For local development, use `https://localhost:5173`

### Privacy Features
- No persistent storage of PHI
- Local-only voice processing
- Clear privacy notices
- No data transmission to external servers (except translation)

## 🐛 Troubleshooting Deployment

### Common Issues

1. **Build Fails**
   - Check Node.js version (16+ required)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

2. **Speech Recognition Not Working**
   - Ensure HTTPS is enabled
   - Check browser permissions
   - Verify microphone access

3. **Translation Not Working**
   - Check internet connection
   - Verify API endpoints
   - Check browser console for errors

### Debug Commands
```bash
# Check build
npm run build

# Test locally
npm run preview

# Check Vercel status
vercel --version

# View logs
vercel logs
```

## 📊 Performance Optimization

### Build Optimization
- Vite automatically optimizes builds
- Tailwind CSS purges unused styles
- Lucide React icons are tree-shaken

### Runtime Optimization
- Lazy loading for speech recognition
- Debounced translation requests
- Efficient state management

## 🔄 Continuous Deployment

### GitHub Integration
1. Connect GitHub repository to Vercel
2. Enable automatic deployments
3. Set up preview deployments for PRs

### Manual Deployment
```bash
# Deploy specific branch
vercel --prod --target production

# Deploy with custom domain
vercel --prod --domain your-domain.com
```

---

**Ready to deploy! Follow these instructions to get your MediTranslate app live in minutes.**
