EPATrac v1.0 — EPA Emission Compliance Tracking Tool
Pilot Systems International LLC
40 CFR Parts 86 | 1036 | 1037 | 1065 | 1066

WHAT IT DOES
  Tracks certification, testing, emission-limit and credit obligations for
  heavy-duty highway engines and vehicles: 195 regulatory sections, 635 atomic
  acceptance criteria, 28 EPA forms and 12 filing deadlines. Applicability is
  gated by an 8-question classification wizard (the PISC question is skipped
  automatically for battery-electric vehicles).

QUICK START (Windows)
  1. Double-click GET-NODE.bat once to download a portable node.exe (needs internet).
  2. Double-click EPATrac.bat to start. Your browser opens at http://127.0.0.1:49152
  3. Answer the 8 classification questions.
  4. Use the Tracker to record Pass / Fail / In Progress / N/A on each criterion.
  5. Data saves automatically to epatrac-data.json in this folder.

RUN ON MAC / LINUX
  Install Node.js, then in this folder run:  node server.js

FEATURES
  - 8-question classification wizard with automatic BEV skip logic
  - Applicability + supersession gating (legacy Part 86 vs Parts 1036/1037)
  - Atomic acceptance criteria: LIMIT / TEST / CERT / ABT with Pass/Fail/In Progress/N/A
  - Auto red-yellow-green roll-up from criteria, with disagreement suggestions
  - 28 EPA forms (3520-1 .. 3520-28) filtered by classification
  - 12 filing deadlines with urgency ranking
  - Users directory with assignee autocomplete
  - Owner Workload: list and Gantt chart (by owner or part; day/week/month)
  - Compliance report: Markdown / HTML / Print with per-part pass-rate tiles
  - CSV export (one row per criterion) and JSON backup / import

DATA & SECURITY
  All data stays on this machine in epatrac-data.json. The server binds to
  127.0.0.1 (localhost) only. Never run EPATrac on a public-facing network.
