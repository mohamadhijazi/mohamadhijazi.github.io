# Impact360 POC Implementation Instructions

## Overview

Build a complete frontend-only Proof of Concept (POC) for the **Impact360 Context-Aware Ownership Platform**.

### Mandatory Technology Stack

Use only:

- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- jQuery (latest stable CDN)

### Strictly Forbidden

Do NOT use:

- npm
- Node.js
- React
- Next.js
- Vue
- Angular
- TypeScript
- Bootstrap
- Tailwind
- Build tools
- Bundlers
- Backend services

The entire application must run by opening `index.html` in a browser.

---

# Vision

Impact360 is a public-sector performance and ownership platform that combines:

- Employee engagement
- Strategic execution
- Innovation management
- Citizen impact
- External event intelligence
- Risk management
- Executive decision support

The platform measures outcomes instead of activities.

---

# Project Structure

```text
/index.html

/css
  styles.css
  dashboard.css
  components.css
  heatmap.css

/js
  data.js
  app.js
  ui.js
  risk-engine.js
  event-engine.js
  ownership-engine.js

/assets
  icons/
  images/
```

---

# Main Layout

## Left Navigation

Sections:

- Dashboard
- Employees
- Objectives
- Projects
- Innovation
- Events Center
- Risk Center
- Citizen Impact
- Heatmap

## Top Bar

Display:

- Organization Name
- Global Risk Index
- Active Events Count
- Search Box
- Notifications

---

# Executive Dashboard

Display KPI Cards:

```text
Projects
Objectives
Employees
Citizen Satisfaction
Innovation Pipeline
External Risks
Ownership Index
```

Example:

```text
Projects: 30
Objectives: 20
Employees: 50
Citizen Satisfaction: 91%
Innovation Ideas: 25
External Events: 40
Ownership Index: 88
```

---

# Employee Dashboard

Display:

## Personal KPIs

- Ownership Score
- Collaboration Score
- Innovation Score
- Citizen Impact Score

## Badges

- Citizen Champion
- Innovator
- Team Builder
- Change Leader

## Recognition Feed

Timeline of received recognitions.

---

# Objectives Module

Each objective contains:

```javascript
{
  id,
  title,
  owner,
  department,
  progress,
  targetDate,
  status,
  relatedEvents
}
```

Status Colors:

- Green
- Amber
- Red

---

# Projects Module

Each project card should display:

```text
Project Name
Owner
Progress
Risk Score
Planned End Date
Recommended End Date
External Events
```

---

# Innovation Marketplace

Kanban Board Columns:

```text
Submitted
Review
Pilot
Approved
Implemented
```

Idea Fields:

```text
Title
Description
Expected Impact
Cost Saving
Category
Owner
```

---

# Citizen Impact Module

Show relationship:

```text
Internal Improvement
↓
Service Improvement
↓
Citizen Outcome
```

Example:

```text
Permit Automation
↓
25% Faster Processing
↓
12% Satisfaction Increase
```

---

# External Events Center

Display event stream.

Categories:

- Economic
- OPEC
- UN
- WHO
- Market
- Weather
- Cyber
- Transportation
- Geopolitical
- Government Policy

---

# External Event Schema

```javascript
{
 id: 'EV001',
 title: 'OPEC Production Decision',
 category: 'Economic',
 source: 'OPEC',
 severity: 4,
 probability: 0.8,
 status: 'Active',
 tags: ['oil_price','budget']
}
```

---

# MetaModel Tags

## Economic

```text
#oil_price
#budget
#inflation
#interest_rate
#stock_market
#currency
```

## International Organizations

```text
#UN
#WHO
#IMF
#WorldBank
#G20
#GCC
```

## Weather

```text
#rain
#storm
#sandstorm
#flood
#heatwave
#earthquake
```

## Transportation

```text
#airport
#flight_delay
#shipping
#ports
#supply_chain
```

## Cyber

```text
#cyberattack
#outage
#ransomware
#databreach
```

## Geopolitical

```text
#conflict
#war
#sanctions
#trade_restrictions
#security
```

---

# Relationship Model

Projects can reference events.

```javascript
project.relatedEvents = [
 'EV001',
 'EV007'
];
```

Objectives can reference events.

```javascript
objective.relatedEvents = [
 'EV001'
];
```

---

# Risk Engine

File:

```text
risk-engine.js
```

Function:

```javascript
calculateProjectRisk(project)
```

Formula:

```text
Risk Score =
Internal Risk +
External Risk +
Dependency Risk
```

Maximum:

```text
100
```

---

# Event Engine

File:

```text
event-engine.js
```

Functions:

```javascript
getAffectedProjects(event)
assessImpact(event, project)
calculateDelay(event)
```

Example:

```text
Flood Severity 5
Estimated Delay = 14 Days
```

---

# Smart Schedule Recommendation

Function:

```javascript
recommendNewDate(project)
```

Example:

```text
Current End Date
31-Dec-2027

Predicted Delay
15 Days

Recommended Date
15-Jan-2028
```

---

# Ownership Engine

File:

```text
ownership-engine.js
```

Formula:

```text
Ownership Score =
Achievement × Difficulty Factor
```

Difficulty Factors:

- Active risks
- Budget pressure
- Supply chain impact
- Weather disruptions
- Cyber incidents

---

# AI Insights Panel

Use mock generated insights.

Examples:

```text
Three initiatives may slip due to supply-chain disruption.
```

```text
Citizen satisfaction increased by 7% after service digitization.
```

```text
Budget-related risks rose by 12% this month.
```

---

# Strategic Heatmap

Regions:

- Central
- Eastern
- Western
- Northern
- Southern

Display:

- Risk
- Project Count
- Satisfaction
- Event Exposure

Color Legend:

```text
Green = Healthy
Amber = Attention
Red = Critical
```

---

# Gamification

Levels:

```text
Contributor
Owner
Leader
Champion
Government Innovator
```

Badges:

```text
Citizen Champion
Innovation Leader
Execution Expert
Collaboration Hero
```

---

# Mock Data Requirements

Generate:

```text
50 Employees
20 Objectives
30 Projects
40 External Events
25 Innovations
100 Recognitions
```

---

# UX Requirements

Design Style:

Modern Government Command Center.

Color Palette:

```css
#0F4C81
#2E7D32
#F9A825
#C62828
#F5F7FA
#1E293B
```

Components:

- KPI Cards
- Project Cards
- Event Cards
- Risk Cards
- Timeline
- Kanban Board
- Charts using HTML/CSS/jQuery only
- Heatmap Grid
- Progress Bars
- Modal Windows
- Alert Banners

---

# Success Criteria

The POC must demonstrate:

1. Ownership scoring
2. Dynamic risk calculation
3. Event-driven project impact
4. Recommended schedule changes
5. Innovation lifecycle
6. Citizen impact visualization
7. Executive insights
8. Strategic heatmap
9. Employee recognition
10. Fully frontend implementation using only HTML, CSS, JavaScript and jQuery
