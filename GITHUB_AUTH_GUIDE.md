# GitHub Authentication Solutions

## Current Issue
```
remote: Permission to wahemmings/scrubai.git denied to CXR0514_thdgit.
fatal: unable to access 'https://github.com/wahemmings/scrubai.git/': The requested URL returned error: 403
```

## Solution Options

### Option 1: Use Personal Access Token (Recommended)
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Create new token with `repo` permissions
3. Use the token as password when pushing:
   ```bash
   git push https://wahemmings:<YOUR_TOKEN>@github.com/wahemmings/scrubai.git main
   ```

### Option 2: Configure Git Credentials
```bash
# Set the correct username
git config user.name "Wendy Hemmings"
git config user.email "wahemmings@gmail.com"

# Update remote URL with username
git remote set-url origin https://wahemmings@github.com/wahemmings/scrubai.git

# Try pushing again
git push origin main
```

### Option 3: Use SSH (if SSH key is configured)
```bash
# Change to SSH URL
git remote set-url origin git@github.com:wahemmings/scrubai.git

# Push
git push origin main
```

### Option 4: Manually Upload Changes
If Git push continues to fail, you can:
1. Create a ZIP of the changed files
2. Upload manually to GitHub via web interface
3. Or use GitHub CLI if available

## Quick Commands to Try Now
```bash
cd /Users/CXR0514/Downloads/scrubai-main

# Try option 2 first
git config user.name "Wendy Hemmings"
git config user.email "wahemmings@gmail.com"
git remote set-url origin https://wahemmings@github.com/wahemmings/scrubai.git
git push origin main
```

## Current Commit Ready to Push
All signature fix changes are committed locally:
- Commit: `d2d9ee8` - "Fix Cloudinary signature validation: parameter name mismatch"
- Files: 4 files changed, 253 insertions(+), 3 deletions(-)
- Status: Ready to push once authentication is resolved
