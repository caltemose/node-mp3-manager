#node app.js port, music, playlists, db
PORT=3333
node app.js $PORT ../music ../playlists ./dbs/db.json
#look into using Forever to handle server in bg.
#open -a Google\ Chrome\ Canary  http://localhost:$PORT