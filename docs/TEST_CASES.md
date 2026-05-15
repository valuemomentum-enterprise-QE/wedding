# Wedding Planner – Test Cases

## Functional tests (automated)

| ID | Area | Scenario | Expected |
|----|------|----------|----------|
| F-01 | Date utils | Parse `2026-08-16` | Local Aug 16 (no UTC −1 day) |
| F-02 | Date utils | Days until wedding from reference date | Correct `differenceInDays` |
| F-03 | Dashboard | Hero countdown + formatted date | Matches `weddingPlannerData` |
| F-04 | Dashboard | Task stats from `localStorage.tasks` | e.g. 3/39, 8% badge |
| F-05 | Dashboard | Guest RSVP stats | Confirmed / total |
| F-06 | Dashboard | CTA links | `/tasks`, `/decorations` |
| F-07 | Navigation | Sidebar date | Same as settings (not hardcoded) |
| F-08 | Navigation | All routes present | Dashboard … Settings |
| F-09 | App | Default data bootstrap | `weddingPlannerData` in localStorage |
| F-10 | Utils | INR → USD budget sum | Uses exchange rate |
| F-11 | Utils | Corrupt localStorage | Falls back to `[]` |
| F-12 | Routing | `/decorations` route | Decor page loads (no redirect home) |

## Non-functional tests (automated + manual)

| ID | Category | Scenario | Expected |
|----|----------|----------|----------|
| NF-01 | Performance | Stats for 500 tasks | &lt; 50ms |
| NF-02 | Performance | Dashboard mount | &lt; 3s in test env |
| NF-03 | Consistency | Short vs long date formats | Same calendar day |
| NF-04 | Reliability | Repeated format calls | Identical output |
| NF-05 | Accessibility | Nav links | Each has accessible name |
| NF-06 | Accessibility | Single H1 on dashboard | One primary heading |
| NF-07 | Security | PII to backend | Manual: local-first only |
| NF-08 | Usability | Touch targets / contrast | Manual: WCAG review |

## Run tests

```bash
cd frontend
npm run test:ci
```
