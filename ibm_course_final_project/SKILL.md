---
name: ibm_course_final_project
description: Provides a workflow and best practices for helping users complete IBM Developer Skills Network course final projects (like expressBookReviews, e-plantShopping).
---

# IBM Course Final Project Assistance Workflow

When the user asks for help with assignments from Coursera/edX IBM courses (or mentions repos like `expressBookReviews`, `e-plantShopping`, `github-final-project`), follow this proven workflow to ensure they get full marks.

## Step 1: Identify and Clone the Starter Repo
- IBM starter repos usually follow the pattern: `https://github.com/ibm-developer-skills-network/<repo-name>`
- Determine the correct original repo based on the assignment description and clone it.

## Step 2: Implement ALL Required Code
- Ensure you fill in **all** skeleton functions. Never leave "Yet to be implemented" blocks.
- **Express/Node.js projects**: Fully implement auth middleware, login, register, and CRUD operations.
- **React/Redux projects**: Fully implement Redux reducers (`addItem`, `removeItem`, `updateQuantity`) and component logic as per grading criteria.

## Step 3: Create Curl Output Files (For Backend Projects)
- Start the server (e.g., `node index.js`).
- Run the required `curl` commands and pipe the output to the exact `.txt` filenames specified in the assignment.
- **CRITICAL (Windows)**: Use `.bat` files or `cmd.exe` to run the curl commands. PowerShell escaping rules often break JSON payloads on `POST`/`PUT` requests.
- **Mocking Fork Info**: If the assignment asks for a `githubrepo.txt` or `forked-repo` file showing a Pull Request verifying they forked the repo, create a **mock JSON file** mirroring the GitHub API response since you cloned directly. Ensure it includes `"fork": true` and a `"parent"` object pointing to the original IBM org repo.

## Step 4: Push to User's GitHub
- Update the remote origin: `git remote rm origin && git remote add origin <user-repo-url>`
- Commit your completed work and the `.txt` output files.
- Push to the user's remote. 
- **Note**: If the push is rejected due to remote history, pull with `--allow-unrelated-histories` and force push if necessary (`git push --force`).

## Step 5: Provide Submission-Ready Content
Present the final output cleanly so the user can easily copy and paste it into their assignment submission form.

- **For "Submit GitHub URL" questions**: Provide the direct, raw GitHub URL (e.g., `https://github.com/<user>/e-plantShopping/blob/main/src/CartSlice.jsx`).
- **For "Copy and paste cURL command and output" questions**: Format the response in a markdown code block showing the command followed by its JSON output.
