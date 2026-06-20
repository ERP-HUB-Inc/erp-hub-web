# Good AI Request Example

```txt
Fix the Service Form start datetime validation.

Current bug:
If today is 15 Jun 2026 at 2:07 PM, user can select 15 Jun 2026 at 1:00 PM and submit. Date picker blocks past date, but time still allows past datetime.

Expected:
On final submit, start datetime must be greater than or equal to current datetime. Show validation error and prevent submit.

Important:
- Draft save should keep current draft behavior unless the existing business rule says otherwise.
- Follow existing React Hook Form pattern.
- Do not change unrelated fields.

After fixing, explain root cause and manual test steps.
```
