# mongoimport --host kahana.mongohq.com --port 10071 --db app29067833 -u github_user -p __temporarypassword__ --verbose --file backup/accounts.json -c accounts --type json
mongo --host kahana.mongohq.com --port 10071 -u github_user -p __temporarypassword__ --verbose --eval "db.problems.remove({})" app29067833 && mongoimport --host kahana.mongohq.com --port 10071 --db app29067833 -u github_user -p __temporarypassword__ --verbose --file scripts/backup/problems.json -c problems --type json --jsonArray && mongo --host kahana.mongohq.com --port 10071 -u github_user -p __temporarypassword__ --verbose --eval 'var k = db.problems.find({}).toArray(); for(var i=0; i<k.length; i++) { db.problems.update({ "_id": k[i]._id }, { "$set": { "pid": k[i]._id.valueOf() } }); }' app29067833