# How to Post a Problem

## Normal, Text-based Problems

1. Log into compose.
2. Find any existing problem in the problems collection.
3. Copy the problem.
4. Click "Add Document"
5. Paste the contents of the previous problem in, not replacing the `ObjectID`
6. Remove the `ObjectID` of the old problem
7. Replace the `pid` field with the `ObjectID` that was generated.
8. Fill out other fields as necessary.
9. Create `/api/graders/grader-name.js` in the folder. **It must be the same name as what you put into the database, but DON'T PUT .js IN THE DATABASE**
10. Push the grader to GitHub.

## IDE-based Problems

1. Go into `/api/api.js` and add your problem ID string to the `problems` array.
2. Go into `/web/exec.html`, and add that same problem ID string in the text box.
3. Create `/api/ide/your-problem-id.js`, but **don't include the .js part in step 1 or 2.**
