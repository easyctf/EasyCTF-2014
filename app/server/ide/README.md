# Adding an Algorithm Problem

1. Make a new branch for the problem.
2. Create a title/id for your problem, like `just-sum-numbers` for "Just Sum Numbers."
2. Write the problem statement like any other problem.
3. In your problem statement, include the structure of the `args` array. This array will always be named `args`.
4. Create a JS file with the ID you created in step 1, and put it in this folder.
5. Inside the JS file, include the 3 functions:
  - `exports.data` returns the `args` array exactly.
  - `exports.check` returns a boolean given the `data` (args) array and the `output`, the user-generated output.
  - `exports.flag` returns a string.
6. Go to `router.js` and add your problem ID to the variable `existing` (it's somewhere in the middle; look for it).
7. Make a pull request to commit to the `master` branch.
