#/bin/sh
current_branch=`git branch | grep \* | cut -d ' ' -f2`

#Check install heroku 
which herokua || brew install heroku 

git add .
git commit -m "deploy to heroku for test"
heroku git:remote -a efcsydney-roster
git push -f heroku $current_branch:master
