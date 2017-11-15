# Heroku
```
yarn deploy:heroku
```

Install brew libray on Mac
```
brew install heroku
```

**Register you account on heroku**
https://dashboard.heroku.com/

Had already register your gmail into this production, if you didn't see efcsydney-roster at your dash borad, please check with joseph.

**0. Create the Heroku app** (Run Very First Time)

(Already did by joseph)
```
heroku apps:create efcsydney-roster
```

**1. Track remote application**

```
heroku git:remote -a efcsydney-roster
```

**2. Push to Heroku**

```
git push heroku master
```

Heroku will give you a link at which to view your live app.
https://efcsydney-roster.herokuapp.com/ 