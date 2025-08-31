# 🚂 AfterLight Backend Railway Deployment Guide

Complete guide to deploy your AfterLight FastAPI backend to Railway with all the bells and whistles!

## 🎯 **What We've Built**

Your backend is now **Railway-ready** with:
- ✅ **Railway-specific configuration** (`railway.json`)
- ✅ **Smart startup script** (`railway_start.py`)
- ✅ **Production environment** handling
- ✅ **Automatic port detection** from Railway
- ✅ **Health checks** and monitoring
- ✅ **Deployment automation** scripts

## 🚀 **Quick Start (3 Steps)**

### **Step 1: Install Railway CLI**
```bash
# Option A: NPM
npm install -g @railway/cli

# Option B: Direct install
curl -fsSL https://railway.app/install.sh | sh
```

### **Step 2: Login to Railway**
```bash
railway login
```

### **Step 3: Deploy with One Command**
```bash
./deploy_to_railway.sh
```

## 🔧 **Manual Deployment Steps**

### **1. Create New Railway Project**
```bash
cd backend
railway init --name "afterlight-backend"
```

### **2. Add PostgreSQL Database**
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click on your project
3. Click "New Service" → "Database" → "PostgreSQL"
4. Railway will automatically set `DATABASE_URL`

### **3. Set Environment Variables**
Copy these to your Railway service environment variables:

```bash
# Required
JWT_SECRET=your-super-secret-production-key
OPENAI_API_KEY=your-openai-api-key

# Optional (for advanced features)
REDIS_URL=redis://your-redis-service
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

### **4. Deploy Your Service**
```bash
railway up
```

### **5. Get Your API URL**
```bash
railway domain
```

## 🌍 **Environment Configuration**

### **Development (Local)**
```bash
# Uses .env.example
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=DEBUG
```

### **Staging (Railway)**
```bash
# Uses railway.json staging config
ENVIRONMENT=staging
DEBUG=false
LOG_LEVEL=INFO
```

### **Production (Railway)**
```bash
# Uses railway.json production config
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO
```

## 🗄️ **Database Setup**

### **Automatic (Recommended)**
Railway automatically:
- ✅ Creates PostgreSQL database
- ✅ Sets `DATABASE_URL` environment variable
- ✅ Handles backups and scaling
- ✅ Provides connection details

### **Manual (Advanced)**
If you prefer external database:
1. Use existing Supabase/PostgreSQL
2. Set `DATABASE_URL` manually in Railway
3. Ensure external database is accessible

## 🔐 **Security Configuration**

### **Required Variables**
```bash
JWT_SECRET=your-32+ character random string
DATABASE_URL=postgresql://user:pass@host:port/db
```

### **Generate Secure JWT Secret**
```bash
# Option A: Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Option B: OpenSSL
openssl rand -base64 32

# Option C: Online generator
# https://generate-secret.vercel.app/32
```

## 📊 **Monitoring & Health Checks**

### **Health Check Endpoint**
```
GET /health
```
Returns:
- ✅ Service status
- ✅ Request count
- ✅ Uptime
- ✅ Version info

### **Railway Dashboard**
- 📈 **Real-time metrics**
- 📊 **Request logs**
- 🔍 **Error tracking**
- 📱 **Performance monitoring**

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. "Missing DATABASE_URL"**
```bash
# Solution: Add PostgreSQL service
railway service add postgresql
```

#### **2. "Port already in use"**
```bash
# Solution: Railway handles this automatically
# The PORT environment variable is set by Railway
```

#### **3. "JWT Secret not set"**
```bash
# Solution: Set in Railway dashboard
JWT_SECRET=your-secret-key
```

#### **4. "CORS errors"**
```bash
# Solution: Update ALLOWED_ORIGINS
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### **Debug Commands**
```bash
# Check service status
railway status

# View logs
railway logs

# Check environment variables
railway variables

# Restart service
railway service restart
```

## 🔄 **Continuous Deployment**

### **Automatic Deploys**
Railway automatically deploys when you:
- ✅ Push to GitHub
- ✅ Update environment variables
- ✅ Modify railway.json

### **Manual Deploys**
```bash
# Deploy latest changes
railway up

# Deploy specific branch
railway up --branch feature-branch

# Rollback to previous version
railway rollback
```

## 💰 **Cost Optimization**

### **Free Tier**
- ✅ **$5 credit** monthly
- ✅ **512MB RAM** per service
- ✅ **Shared CPU** resources
- ✅ **Perfect for MVP**

### **Production Scaling**
- 🚀 **$5-20/month** for backend
- 🗄️ **$5-15/month** for database
- 📊 **$5-10/month** for monitoring
- 💰 **Total: $15-45/month**

## 🎯 **Next Steps After Deployment**

### **1. Test Your API**
```bash
# Health check
curl https://your-api.railway.app/health

# API docs
open https://your-api.railway.app/docs
```

### **2. Update Frontend**
```bash
# Set environment variable
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

### **3. Monitor Performance**
- 📊 Check Railway dashboard
- 📈 Monitor response times
- 🔍 Review error logs
- 📱 Test from different locations

## 🆘 **Need Help?**

### **Railway Support**
- 📚 [Documentation](https://docs.railway.app/)
- 💬 [Discord Community](https://discord.gg/railway)
- 🐛 [GitHub Issues](https://github.com/railwayapp/cli)

### **AfterLight Support**
- 📧 Contact development team
- 🐛 Report issues in repository
- 💡 Suggest new features

## 🎉 **Congratulations!**

Your **AfterLight** backend is now **production-ready** on Railway with:
- 🚀 **Automatic scaling**
- 🔒 **Enterprise security**
- 📊 **Real-time monitoring**
- 💰 **Cost optimization**
- 🔄 **Continuous deployment**

**Ready to serve families with premium memorial planning!** 🕊️✨
