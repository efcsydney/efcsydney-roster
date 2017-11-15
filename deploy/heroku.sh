#/bin/sh
current_branch=`git branch | grep \* | cut -d ' ' -f2`

#Deploy Everything to heroku master branch 
git add .
git commit -m "deploy to heroku for test"
heroku git:remote -a efcsydney-roster
git push -f heroku $current_branch:master

Yellow='\033[0;33m'
White='\033[0;0m'
echo 
echo "Check your latest code on$Yellow https://efcsydney-roster.herokuapp.com/ $White"