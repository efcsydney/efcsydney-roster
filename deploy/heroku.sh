git add .
git commit -m "deploy to heroku for test"
heroku git:remote -a efcsydney-roster
git push -f heroku master
