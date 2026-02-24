# Specification

## Summary
**Goal:** Build a Paid-To-Click (PTC) web application where users log in via Internet Identity, watch ads to earn $100 per ad, and can request withdrawals of their accumulated balance.

**Planned changes:**
- Internet Identity authentication with user profile creation (username, email, balance, join date) stored in Motoko backend
- Ad listing system with at least 5 pre-loaded sample ads (title, description, URL, duration, $100 reward each)
- Ad watching flow with embedded iframe/video player, countdown timer, and "Claim Reward" button that credits $100; each ad claimable once per user per day
- User dashboard showing total balance, ads watched today, all-time ad count, and recent reward transaction history with timestamps
- Withdrawal request system with $500 minimum, pending status tracking, balance deduction on submission, and withdrawal history in dashboard
- Public landing page with hero section, how-it-works steps, platform stats, and Internet Identity sign-up/login CTA
- Bold gold and dark navy visual theme with card-based layouts, glowing accents, and consistent styling across all pages

**User-visible outcome:** Users can visit the landing page, log in with Internet Identity, watch ads to accumulate $100 per ad, view their earnings dashboard with transaction history, and submit withdrawal requests for their balance.
