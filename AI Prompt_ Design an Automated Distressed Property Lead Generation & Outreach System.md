# ***AI Prompt: Design an Automated Distressed Property Lead Generation & Outreach System***

You are an expert AI automation architect specializing in real estate lead generation, web scraping, workflow automation, CRM integration, and outbound communications.

Your objective is to design a production-ready automated workflow that identifies motivated property sellers, enriches the data using lawful sources, organizes the information, and launches user-approved marketing campaigns.

## **Primary Objective**

Build a system that allows a user to press a single **Launch** button and automatically perform the following sequence:

1. Collect distressed property data from government and public sources.  
2. Organize and categorize every property.  
3. Enrich missing ownership and contact information using legally available data providers.  
4. Generate clean lead lists.  
5. Launch automated outreach through one or more communication channels selected by the user.

---

# **Step 1 – Data Collection**

The system should scrape or retrieve data from:

* County Tax Assessor websites  
* County Recorder websites  
* Tax Collector websites  
* Sheriff Sale websites  
* Foreclosure auction websites  
* Probate court records  
* Bankruptcy filings (where publicly available)  
* Code enforcement databases  
* Vacant property lists  
* Tax lien databases  
* Tax deed listings  
* Government open-data portals  
* HUD listings  
* FHA distressed property lists  
* Public notice websites  
* Municipal foreclosure notices  
* Court foreclosure filings  
* Notice of Default (NOD)  
* Notice of Trustee Sale (NTS)  
* Lis Pendens filings  
* Eviction filings (where legally available)

The workflow should support adding new sources over time.

---

# **Step 2 – Property Classification**

Automatically categorize every property into one or more of the following:

* Tax Delinquent  
* Tax Lien  
* Tax Deed  
* Foreclosure  
* Pre-Foreclosure  
* Sheriff Sale  
* Probate  
* Bankruptcy  
* Code Violations  
* Vacant Property  
* Absentee Owner  
* High Equity  
* Inherited Property  
* Estate Sale  
* Water Utility Delinquent (if available)  
* HOA Lien  
* Other Motivated Seller Indicators

Properties may belong to multiple categories.

---

# **Step 3 – Data Cleaning**

Normalize and standardize:

* Owner name  
* Property address  
* Mailing address  
* County  
* State  
* ZIP code  
* Parcel/APN number  
* Property type  
* Assessed value  
* Market value (if available)  
* Equity estimate  
* Lien amount  
* Delinquent taxes  
* Auction date  
* Filing date  
* Last sale date

Remove duplicates automatically.

---

# **Step 4 – Contact Enrichment**

If ownership or contact information is incomplete, enrich the records using legally obtained data providers or licensed APIs.

Potential enrichment may include:

* Mailing address  
* Email address  
* Phone number(s)  
* LLC ownership lookup  
* Corporate ownership lookup  
* Skip tracing providers  
* Public business records

The workflow should:

* Score confidence for each match.  
* Reject low-confidence matches.  
* Keep an audit log of enrichment sources.  
* Respect privacy laws and provider terms of service.

---

# **Step 5 – Lead Scoring**

Assign each property a motivation score (0–100) based on factors such as:

* Equity  
* Delinquent taxes  
* Foreclosure stage  
* Vacancy  
* Probate  
* Multiple liens  
* Bankruptcy  
* Length of ownership  
* Absentee ownership  
* Property condition indicators

Display the highest-priority leads first.

---

# **Step 6 – CRM Database**

Store all records in a searchable CRM.

Each record should include:

* Owner  
* Property  
* Contact information  
* Lead category  
* Motivation score  
* Communication history  
* Notes  
* Status  
* Tags  
* Follow-up reminders

Prevent duplicate imports.

---

# **Step 7 – Outreach Campaign Builder**

Allow the user to select one or more communication methods, such as:

* Email  
* SMS (where consent or another lawful basis exists)  
* Ringless voicemail (where permitted)  
* Direct mail integration  
* Task creation for manual phone calls

The user should be able to:

* Choose a template.  
* Edit templates.  
* Personalize messages using variables.

Examples:

* Owner Name  
* Property Address  
* City  
* County  
* Estimated Equity  
* Foreclosure Date

---

# **Step 8 – Campaign Automation**

Once the user clicks **Launch**, the workflow should:

1. Gather new property records.  
2. Categorize properties.  
3. Enrich available contact information.  
4. Remove duplicates.  
5. Score leads.  
6. Build campaign lists.  
7. Send outreach using the user-selected channels.  
8. Log every action.  
9. Track delivery status.  
10. Schedule follow-ups.

---

# **Step 9 – Dashboard**

Create a dashboard displaying:

* New leads today  
* Total distressed properties  
* Foreclosures  
* Tax liens  
* Probates  
* Vacant properties  
* Outreach sent  
* Replies received  
* Interested sellers  
* Appointments scheduled  
* Conversion rate  
* Cost per lead

---

# **Step 10 – Search & Filters**

Allow filtering by:

* State  
* County  
* ZIP code  
* City  
* Property type  
* Equity  
* Lien amount  
* Foreclosure stage  
* Motivation score  
* Owner type  
* Vacancy  
* Last contact  
* Campaign  
* Status

---

# **Step 11 – Integrations**

Design the workflow to integrate with platforms such as:

* Airtable  
* Google Sheets  
* Notion  
* HubSpot  
* GoHighLevel  
* Salesforce  
* Twilio  
* SendGrid  
* Mailgun  
* Zapier  
* Make  
* n8n  
* OpenAI  
* Anthropic  
* PostgreSQL  
* Supabase

---

# **Step 12 – AI Features**

Use AI to:

* Summarize each property.  
* Estimate seller motivation.  
* Recommend the best outreach channel.  
* Draft personalized outreach messages.  
* Suggest follow-up timing.  
* Flag duplicate owners.  
* Detect likely investors versus owner-occupants.  
* Generate call scripts and email variations.

---

# **Step 13 – User Experience**

The interface should require minimal technical knowledge.

The primary workflow should be:

Launch → Select Counties → Select Lead Types → Select Outreach Channels → Review → Start Automation

The system should then execute the entire workflow with minimal user intervention while providing progress updates, logs, error handling, and retry mechanisms.

---

# **Technical Requirements**

Design the solution using modern automation and AI tools such as:

* n8n (preferred)  
* Make.com  
* Python  
* Playwright  
* Selenium  
* Puppeteer  
* OCR for scanned PDFs  
* AI-assisted data extraction  
* PostgreSQL or Supabase  
* REST APIs  
* Webhooks  
* Queue-based processing  
* Parallel execution where appropriate

The architecture should be modular, scalable, fault tolerant, and easy to extend with new counties, new government data sources, and additional enrichment providers.

