#/bin/sh
current_branch=`git branch | grep \* | cut -d ' ' -f2`

#Deploy Everything to heroku master branch 
heroku git:remote -a efcsydney-roster
git push heroku $current_branch:master

Yellow='\033[0;33m'
White='\033[0;0m'
echo 
echo "Check your latest code on$Yellow https://efcsydney-roster.herokuapp.com/ $White"
