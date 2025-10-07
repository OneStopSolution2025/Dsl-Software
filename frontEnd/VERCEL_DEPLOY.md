# Vercel Deployment Guide (Easiest Option)

## 🚀 Quick Vercel Deployment

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**
```bash
vercel login
```

### **Step 3: Deploy**
```bash
# From your project directory
cd /Users/fi-user/Documents/tutorial/Dsl-Software/frontEnd

# Deploy to production
vercel --prod
```

### **Step 4: Configure Settings**
When prompted:
- **Directory:** `./` (current directory)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### **Step 5: Set Environment Variables**
In Vercel dashboard or via CLI:
```bash
vercel env add VITE_GOOGLE_MAPS_API_KEY
vercel env add VITE_API_BASE_URL
```

---

## 🌐 **Access Your App**
After deployment, you'll get a URL like:
- `https://your-project.vercel.app`

---

## ✅ **Vercel Benefits:**
- ✅ **Free for personal projects**
- ✅ **Automatic deployments** on git push
- ✅ **Global CDN** for fast loading
- ✅ **SSL certificate** included
- ✅ **Custom domains** supported

---

## 🔧 **Need Help?**
Just run `vercel --help` for more options or let me know if you need assistance with any step!

**This is the quickest way to get your app online!** ⚡
