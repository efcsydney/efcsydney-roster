#/bin/sh
current_branch=`git branch | grep \* | cut -d ' ' -f2`

#Check install heroku 
which heroku || brew install heroku 

#Deploy Everything to heroku master branch 
git add .
git commit -m "deploy to heroku for test"
heroku git:remote -a efcsydney-roster
git push -f heroku $current_branch:master

echo "Check your latest code on https://efcsydney-roster.herokuapp.com/"
