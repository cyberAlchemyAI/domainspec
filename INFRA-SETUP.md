# Infrastructure Setup Guide

> Get your tokens and environment ready for DomainSpec infrastructure deployment.
> Time: ~15 minutes. Result: 3 tokens configured, ready to deploy.

---

## Do I Need All of This?

**No.** DomainSpec infrastructure has graduated presets — start with zero tokens and add them only when you need remote deployment.

| Preset         | Tokens needed | What you get                                     |
| -------------- | ------------- | ------------------------------------------------ |
| **Dev**        | **0**         | `docker compose up` — runs everything locally    |
| **Single VPS** | 3             | VPS + DNS + TLS + monitoring + CI/CD auto-deploy |
| **Split VPS**  | 3             | Separate DB + app servers, staging environment   |
| **HA**         | 3             | Managed DB, load balancer, replicas, canary      |

**Start with Dev.** No accounts, no tokens, no cost:

```bash
docker compose up
```

When you're ready to deploy to a VPS, continue below.

---

## What You Need (VPS Deployment)

Remote deployment requires **3 tokens**. Everything else is automated.

| Token                  | Provider     | Purpose                                       | Free Tier |
| ---------------------- | ------------ | --------------------------------------------- | --------- |
| `VPS_PROVIDER_TOKEN`   | DigitalOcean | Provision and manage VPS droplets             | No        |
| `CLOUDFLARE_API_TOKEN` | Cloudflare   | Manage DNS records and proxy traffic          | Yes       |
| `PULUMI_ACCESS_TOKEN`  | Pulumi       | Store infrastructure state and manage deploys | Yes       |

---

## Step 1 — DigitalOcean API Token

DigitalOcean provisions the VPS where your app runs.

### Create account

1. Go to [digitalocean.com](https://www.digitalocean.com/) and sign up
2. Add a payment method (credit card or PayPal)
3. New accounts get **$200 free credit for 60 days**

### Generate token

1. Go to **API** → [Applications & API](https://cloud.digitalocean.com/account/api/tokens)
2. Click **Generate New Token**
3. Name it: `domainspec-infra` (or your project name)
4. Select **Custom scopes** and enable only what your preset needs:

| Resource         | Permission | Needed for              | Preset          |
| ---------------- | ---------- | ----------------------- | --------------- |
| **Droplet**      | Read+Write | Provision/manage VPS    | All VPS presets |
| **SSH Key**      | Read+Write | Add deploy key to VPS   | All VPS presets |
| **Firewall**     | Read+Write | Manage port rules       | All VPS presets |
| **VPC**          | Read       | Place droplet in a VPC  | All VPS presets |
| **Project**      | Read       | Organize resources      | All VPS presets |
| **Load Balancer** | Read+Write | Traffic distribution   | HA only         |
| **Database**     | Read+Write | Managed PostgreSQL      | HA only         |

**For Single VPS** — enable the first 5 rows. Skip Load Balancer and Database.

5. Click **Generate Token**
6. **Copy the token immediately** — it is shown only once

### Verify

```bash
curl -s -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.digitalocean.com/v2/account" | jq .account.status
```

Expected output: `"active"`

> **Alternative providers:** Hetzner and Vultr are also supported. The token setup is similar — create an API token with full permissions from their respective dashboards.

---

## Step 2 — Cloudflare API Token

Cloudflare manages DNS records and provides free CDN + DDoS protection.

### Create account and add domain

1. Go to [cloudflare.com](https://www.cloudflare.com/) and sign up (free plan works)
2. Click **Add a site** → enter your domain
3. Select the **Free** plan
4. Cloudflare gives you two nameservers (e.g. `ada.ns.cloudflare.com`, `bob.ns.cloudflare.com`)
5. Go to your domain registrar and **replace the nameservers** with the ones Cloudflare provided
6. Wait for propagation (usually 5–30 minutes, can take up to 24h)

### Generate token

1. Go to **My Profile** → [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use the **Edit zone DNS** template:
   - Permissions: `Zone` → `DNS` → `Edit`
   - Zone Resources: `Include` → `Specific zone` → select your domain
4. Click **Continue to summary** → **Create Token**
5. **Copy the token immediately**

### Verify

```bash
curl -s -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.cloudflare.com/client/v4/user/tokens/verify" | jq .result.status
```

Expected output: `"active"`

> **Important:** Use a scoped API **Token** (not the Global API Key). Tokens follow least-privilege — they only access the zones you specify.

---

## Step 3 — Pulumi Access Token

Pulumi manages infrastructure state and executes IaC deployments.

### Create account

1. Go to [app.pulumi.com](https://app.pulumi.com/) and sign up (GitHub SSO works)
2. The **Individual** (free) plan supports unlimited stacks and resources
3. No payment method needed

### Generate token

1. Go to **Settings** → [Access Tokens](https://app.pulumi.com/account/tokens)
2. Click **Create token**
3. Name it: `domainspec-infra`
4. **Copy the token immediately**

### Verify

```bash
export PULUMI_ACCESS_TOKEN=YOUR_TOKEN
pulumi whoami
```

Expected output: your Pulumi username.

> **Don't have Pulumi CLI?** Install it:
>
> ```bash
> curl -fsSL https://get.pulumi.com | sh
> ```

---

## Step 4 — Store Tokens

Tokens must **never** be committed to git. Choose where to store them based on your deployment target.

### Option A — GitHub Actions Secrets (recommended for CI/CD)

For automated deploys on `git push main`:

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** for each:

| Secret Name            | Value                     |
| ---------------------- | ------------------------- |
| `VPS_PROVIDER_TOKEN`   | Your DigitalOcean token   |
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API token |
| `PULUMI_ACCESS_TOKEN`  | Your Pulumi access token  |

### Option B — Local environment (for dev/testing)

For running `pulumi up` from your machine:

```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export DIGITALOCEAN_TOKEN="dop_v1_..."
export CLOUDFLARE_API_TOKEN="..."
export PULUMI_ACCESS_TOKEN="pul-..."
```

Then reload:

```bash
source ~/.zshrc  # or ~/.bashrc
```

### Option C — `.env` file (local only, never commit)

Create a `.env` file in the `infra/` directory:

```bash
# infra/.env — NEVER commit this file
DIGITALOCEAN_TOKEN=dop_v1_...
CLOUDFLARE_API_TOKEN=...
PULUMI_ACCESS_TOKEN=pul-...
```

Verify `.env` is in your `.gitignore`:

```bash
echo "infra/.env" >> .gitignore
```

---

## Step 5 — Verify Everything

Run this checklist before starting infrastructure deployment:

```bash
# 1. DigitalOcean — should return "active"
curl -s -H "Authorization: Bearer $DIGITALOCEAN_TOKEN" \
  "https://api.digitalocean.com/v2/account" | jq .account.status

# 2. Cloudflare — should return "active"
curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/user/tokens/verify" | jq .result.status

# 3. Pulumi — should return your username
PULUMI_ACCESS_TOKEN=$PULUMI_ACCESS_TOKEN pulumi whoami

# 4. Domain nameservers — should show Cloudflare NS records
dig NS yourdomain.com +short
```

All green? You're ready to deploy.

---

## Next Steps

### First deployment

```
@domainspec-infra-architect domainspec-infra-architecture
```

The agent will detect your project, recommend a preset, and generate all infrastructure files. Then:

```bash
git push main  # CI/CD deploys automatically
```

### Preset progression

| You're here | Ready for        | Command                                             |
| ----------- | ---------------- | --------------------------------------------------- |
| Nothing yet | Local dev        | `docker compose up` — no tokens needed              |
| Local dev   | First deploy     | `domainspec-infra-architecture --preset single-vps` |
| Single VPS  | Staging          | `domainspec-infra-architecture --preset split-vps`  |
| Split VPS   | Production-grade | `domainspec-infra-architecture --preset ha`         |

> **Dev preset needs no tokens.** Start with `docker compose up` for local development. Tokens are only required when deploying to a VPS.

---

## Troubleshooting

| Problem                                | Cause                           | Fix                                                            |
| -------------------------------------- | ------------------------------- | -------------------------------------------------------------- |
| `401 Unauthorized` on DigitalOcean     | Token expired or revoked        | Generate a new token in the DO dashboard                       |
| `403 Forbidden` on Cloudflare          | Token missing DNS edit scope    | Create a new token with `Zone > DNS > Edit` permission         |
| `pulumi whoami` fails                  | Token not set or expired        | Re-export `PULUMI_ACCESS_TOKEN` or generate a new one          |
| DNS not resolving after nameserver set | Propagation delay               | Wait up to 24h; check with `dig NS yourdomain.com`             |
| `pulumi up` fails with state conflict  | Multiple people deploying       | Run `pulumi cancel` then retry                                 |
| GitHub Actions deploy fails            | Secrets not set or typo in name | Verify exact secret names in repo Settings → Secrets → Actions |

---

## Security Checklist

- [ ] Tokens are **not** committed to git (check with `git log -p --all -S 'dop_v1'`)
- [ ] Cloudflare token is **scoped** to specific zone (not Global API Key)
- [ ] DigitalOcean token has only the permissions you need
- [ ] `.env` files are listed in `.gitignore`
- [ ] GitHub Actions secrets are set at repository level (not organization, unless shared)
- [ ] VPS SSH access is key-only (no password auth) — handled by cloud-init template
