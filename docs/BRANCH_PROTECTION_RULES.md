# Branch Protection Rules for `kdadks/aihow`

This document describes the enforced branch protection and workflow conventions for this repository.

---

## Protected Branches

**Branches with protection rules:**
- `main`
- `Pre-Prod`

---

## Protection Rules

For both `main` and `Pre-Prod` branches, the following rules apply:

1. **Require a Pull Request Before Merging**
   - Direct pushes to these branches are not allowed.
   - All changes must be made via a pull request.

2. **Require Pull Request Reviews**
   - At least **1 approving review** is required before merging a pull request.

3. **Require Status Checks to Pass**
   - All configured required status checks (e.g., CI, tests) must pass before merging.
   - If no CI is configured yet, this rule can be enabled once checks are available.

4. **Require Branch to be Up to Date**
   - (Recommended) Pull requests must be up to date with the base branch before merging.

5. **(Optional) Restrict Who Can Push**
   - Only authorized users or teams can push to these branches (typically admins or release managers).

---

## Branch Naming Conventions

For ongoing development, follow these branch naming patterns:

- **Feature branches:**  
  `feature/your-feature-name`
- **Hotfix branches:**  
  `hotfix/your-hotfix-name`

---

## Standard Workflow

1. **Create a Feature or Hotfix Branch**
   - From `main` (or the appropriate base), run:
     ```sh
     git checkout main
     git pull origin main
     git checkout -b feature/your-feature-name
     # or for a hotfix:
     git checkout -b hotfix/your-hotfix-name
     ```

2. **Push Your Branch**
   ```sh
   git push -u origin feature/your-feature-name
   # or
   git push -u origin hotfix/your-hotfix-name
   ```

3. **Open a Pull Request**
   - Go to GitHub and open a pull request targeting `main` or `Pre-Prod` as appropriate.

4. **Ensure:**
   - All status checks pass.
   - At least one team member approves the PR.

5. **Merge via PR**
   - Only after the above conditions are met.

---

## Notes

- These rules help maintain code quality and prevent accidental changes to critical branches.
- If you need to update the protection rules, please contact a repository admin.

---