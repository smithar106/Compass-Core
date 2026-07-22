# Research Examples

This document demonstrates research agent outputs for three fictional B2B SaaS companies.

---

## Example 1: "NovaPay" — Payments API Platform

### Identity Agent
```yaml
companyName: "NovaPay Inc."
websiteUrl: "https://novapay.com"
industry: "Financial Technology"
subIndustry: "Payments Infrastructure"
businessModel: "Usage-based"
customerSegments: ["Mid-Market", "Enterprise"]
yearFounded: 2018
headquarters: "San Francisco, CA"
remoteFirst: false
confidence: "High"
sources: ["Website", "Crunchbase", "LinkedIn"]
```

### Financial Research Agent
```yaml
totalRaised: "$120M"
lastRound: "Series C"
lastRoundDate: "2025-06"
lastRoundAmount: "$60M"
investors: ["Accel", "Andreessen Horowitz", "Sequoia"]
confidence: "Confirmed"
revenueStage: "Series C"
estimatedARR: "$30-50M"  # Inferred
```

### Technology Research Agent
```yaml
detectedTools:
  - name: "Salesforce"       category: "CRM"           confidence: "High"
  - name: "Zendesk"          category: "Support"        confidence: "High"
  - name: "NetSuite"         category: "Finance"        confidence: "Medium"
  - name: "Stripe"           category: "Finance"        confidence: "High"
  - name: "GitHub"           category: "Engineering"    confidence: "High"
  - name: "Slack"            category: "Communication"  confidence: "High"
  - name: "AWS"             category: "Cloud"           confidence: "High"
cloudProvider: "AWS"
dataWarehouse: "Snowflake"  # Inferred from job postings
aiTools: []  # No public AI tool signals
```

### Leadership Intelligence Agent
```yaml
priorities:
  - priority: "Operational excellence at scale"
    source: "Q3 2025 earnings blog post"
    quote: "Our next phase is about operational excellence — building the infrastructure to scale without proportional headcount growth."
    confidence: "High"
  - priority: "Enterprise market expansion"
    source: "CEO interview on FinTech Futures"
    quote: "We're seeing strong demand from enterprises and we're investing in the compliance and security capabilities they need."
    confidence: "High"
  - priority: "Developer experience"
    source: "Engineering blog"
    confidence: "Medium"
aiStance: "Cautiously optimistic — mentions AI in product context but no major AI investments announced"
```

### Organizational Structure Agent
```yaml
departments:
  - name: "Engineering"          estimatedSize: 120   confidence: "Medium"
  - name: "Sales"                estimatedSize: 60    confidence: "Medium"
  - name: "Marketing"            estimatedSize: 25    confidence: "Medium"
  - name: "Customer Success"     estimatedSize: 40    confidence: "Low"
  - name: "Support"              estimatedSize: 50    confidence: "Medium"
  - name: "Finance"              estimatedSize: 15    confidence: "Low"
  - name: "People/HR"           estimatedSize: 10    confidence: "Low"
  - name: "Legal"                estimatedSize: 8     confidence: "Low"
  - name: "Operations"           estimatedSize: 12    confidence: "Low"
orgComplexity: "Hierarchical"
```

### Job Posting Agent
```yaml
totalOpenRoles: 35
byDepartment:
  engineering: 12
  sales: 8
  support: 6
  customer_success: 4
  marketing: 3
  legal: 2
keyHiringVelocity: "High — 15 new postings in last 14 days"
techStackSignals: ["Python", "Go", "Kubernetes", "Snowflake", "Terraform"]
```

### Research Limitations
```yaml
limitations:
  - "Private company — no financial disclosure beyond funding rounds"
  - "Customer reviews limited (20 reviews on G2)"
  - "No engineering blog activity in 3 months"
  - "Department sizes are estimates with ±20% margin"
```

---

## Example 2: "FlowLabs" — Workflow Automation (Seed Stage)

### Identity Agent
```yaml
companyName: "FlowLabs, Inc."
websiteUrl: "https://flowlabs.io"
industry: "Software"
subIndustry: "Workflow Automation / Low-Code"
businessModel: "SaaS (per-seat + usage)"
customerSegments: ["SMB", "Mid-Market"]
yearFounded: 2022
headquarters: "Austin, TX"
remoteFirst: true
```

### Financial Research Agent
```yaml
totalRaised: "$8M"
lastRound: "Seed"
lastRoundDate: "2024-11"
lastRoundAmount: "$8M"
investors: ["Y Combinator", "LocalGlobe"]
confidence: "Confirmed"
```

### Technology Research Agent
```yaml
detectedTools:
  - name: "HubSpot"             category: "CRM"           confidence: "High"
  - name: "Intercom"            category: "Support"        confidence: "High"
  - name: "Linear"              category: "Engineering"    confidence: "High"
  - name: "Notion"              category: "Documentation"  confidence: "High"
  - name: "GitHub"              category: "Engineering"    confidence: "High"
  - name: "Slack"               category: "Communication"  confidence: "High"
  - name: "Vercel"              category: "Engineering"    confidence: "High"
cloudProvider: "GCP"
dataWarehouse: "Not detected"
```

### Leadership Intelligence Agent
```yaml
priorities:
  - priority: "Rapid product-market fit iteration"
    source: "YC interview"
    confidence: "High"
  - priority: "AI-first product strategy"
    source: "CEO blog"
    quote: "AI is the biggest shift since cloud computing — we're building FlowLabs with AI at the core, not as an add-on."
    confidence: "High"
aiStance: "Enthusiastic — AI is core to product strategy"
```

### Research Limitations
```yaml
limitations:
  - "Very limited public signals (seed-stage company)"
  - "No customer reviews on major platforms"
  - "Department structure largely inferred from small team size"
  - "No financial data beyond seed round"
```

---

## Example 3: "DataBridge" — Enterprise Data Integration

### Identity Agent
```yaml
companyName: "DataBridge Technologies, Inc."
websiteUrl: "https://databridge.com"
industry: "Enterprise Software"
subIndustry: "Data Integration / ETL"
businessModel: "SaaS (usage-based, enterprise tiers)"
customerSegments: ["Enterprise"]
yearFounded: 2012
headquarters: "Boston, MA"
remoteFirst: false
```

### Financial Research Agent
```yaml
totalRaised: "$350M"
lastRound: "Series D"
lastRoundDate: "2024-03"
lastRoundAmount: "$150M"
investors: ["Bessemer", "Battery Ventures", "Insight Partners"]
confidence: "Confirmed"
estimatedARR: "$150M+"  # Inferred
```

### Technology Research Agent
```yaml
detectedTools:
  - name: "Salesforce"          category: "CRM"           confidence: "High"
  - name: "HubSpot"             category: "Marketing"     confidence: "High"
  - name: "Zendesk"             category: "Support"        confidence: "High"
  - name: "Workday"             category: "HRIS"           confidence: "High"
  - name: "NetSuite"            category: "Finance"        confidence: "High"
  - name: "Jira"               category: "Engineering"    confidence: "High"
  - name: "Confluence"          category: "Documentation"  confidence: "High"
  - name: "GitHub"              category: "Engineering"    confidence: "High"
  - name: "Slack"               category: "Communication"  confidence: "High"
  - name: "AWS"                category: "Cloud"           confidence: "High"
  - name: "Snowflake"           category: "Data"           confidence: "High"
  - name: "Tableau"             category: "Analytics"      confidence: "Medium"
```

### Leadership Intelligence Agent
```yaml
priorities:
  - priority: "Profitable growth"
    source: "Investor letter Q2 2025"
    quote: "We're committed to reaching profitability while maintaining our market leadership in data integration."
    confidence: "High"
  - priority: "AI-native data integration"
    source: "Product launch press release"
    quote: "DataBridge is reimagining data integration for the AI era — making enterprise data AI-ready."
    confidence: "High"
  - priority: "Enterprise compliance"
    source: "Trust page"
    confidence: "High"
aiStance: "Enthusiastic — major AI product investments announced"
```

### Compliance Research Agent
```yaml
certifications: ["SOC2 Type II", "HIPAA", "GDPR", "ISO 27001"]
regulatedIndustry: true
dataPrivacyRequirements: ["GDPR", "CCPA", "HIPAA Privacy Rule"]
```

### Customer Sentiment Agent
```yaml
averageRating: 4.2  # G2
commonPraises: ["Reliable data pipelines", "Good connector library", "Strong security"]
commonComplaints: ["Complex pricing", "Setup takes too long", "Documentation gaps"]
sources: ["G2 (150 reviews)", "Capterra (80 reviews)"]
```
