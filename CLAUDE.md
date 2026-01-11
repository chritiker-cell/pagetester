# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains static websites for multiple school subdomains (schule1-5.itcoach-wehofer.de). Changes are automatically deployed to an FTP server via GitHub Actions.

## Deployment

**Automatic deployment on push to main:**
- GitHub Actions workflow (`.github/workflows/main.yml`) syncs all files to `public_html/` on the FTP server
- FTP credentials: username `schulprojekt`, password stored in GitHub Secrets as `ftp_password`
- Server: `195.242.102.132`

**Deploy workflow:**
```bash
git add .
git commit -m "Description"
git push
```

## Project Structure

```
├── schule1.itcoach-wehofer.de/   # Subdomain websites
├── schule2.itcoach-wehofer.de/
├── schule3.itcoach-wehofer.de/
├── schule4.itcoach-wehofer.de/
├── schule5.itcoach-wehofer.de/
├── httpdocs/                      # Main domain content
├── error_docs/                    # Custom error pages
├── private/                       # Private files (not web-accessible)
└── logs/                          # Server logs (per subdomain)
```

Each subdomain folder contains its own `index.html` and assets.

## Local Development

Use VS Code with Live Server extension to preview HTML files locally before deploying.
