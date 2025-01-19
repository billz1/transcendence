first commit
TODO:
*AI opponent ✔
*Chat ✔
*42 login ✔
*remote players 
*leaderboard 

*resolving posgresql auth to passwoord
sudo nano /etc/postgresql/14/main/pg_hba.conf
edit line
local   all             all                                     peer(change to md5)



*notes for resolving migration issues
python3 manage.py migrate account --fake
python3 manage.py migrate

-open postgresql shell
psql -U pong -d pong_db

*delete migrations
rm -rf core/migrations/*
rm -rf account/migrations/*



python3 -m http.server 8001
python3 manage.py runserver

*problem update
this url works http://127.0.0.1:8000/auth/me/ but when i click the button to login with 42 it redirects to http://127.0.0.1:8000/accounts/profile/


*trouble shooting django
Delete and Recreate the pycache Directory--
find . -type d -name "__pycache__" -exec rm -rf {} +
