"# KLTN2018" 
"# KLTN2018_AFTER" 

##, create a new repository on the command line

echo "# KLTN2018_AFTER" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/phamvanlinh20111993/KLTN2018_AFTER.git
git push -u origin master


##,push an existing repository from the command line

git remote add origin https://github.com/phamvanlinh20111993/KLTN2018_AFTER.git
git push -u origin master


##, Changing a remote's URL
git remote set-url --add name https://github.com/phamvanlinh20111993/KLTN2018_AFTER.git
- name: origin or upstream

##, push to specigfix remote repository
git push -u https://github.com/phamvanlinh20111993/KLTN2018_AFTER.git master


##, Call video choose one in three total
simple-peer
peerjs
socket.io p2p


##, select my posts in database
 SELECT p.id AS pid, p.content, p.ctime AS ptime, p.turnof_cmt, ti.id AS tid, ti.name AS tiname,
 li1.id_user as melike,  COUNT(p.id) AS total, (select count(*) from comment c WHERE p.id = c.post_id) 
 as totalc FROM post p  JOIN post_title ti ON ti.id = p.title_id  JOIN exchangelg ex 
 ON ex.user_id = p.user_id  LEFT JOIN likes_post li ON li.id_post = p.id  
 LEFT JOIN likes_post li1 ON (li1.id_user = 804260829616815200 AND li1.id_post = p.id ) 
 WHERE p.user_id = 804260829616815200 GROUP BY p.id ORDER BY p.ctime DESC, ex.prio DESC
 
##, select community post in database
 SELECT p.id AS pid, p.user_id AS uid, p.content, p.ctime as ptime,  p.turnof_cmt, 
 ti.name AS tiname, u.email, u.name AS uname,  u.photo, u.score, le.level, 
(SELECT COUNT(*) FROM comment c WHERE p.id = c.post_id) AS totalc, fo.tracked as istracked,
 li1.id_user AS melike, COUNT(p.id) AS totallike FROM post p 
 JOIN User u ON p.user_id = u.id 
 JOIN post_title ti ON ti.id = p.title_id  
 JOIN level le ON le.id = u.level_id 
 JOIN exchangelg ex ON ex.user_id = u.id 
 JOIN language la ON la.id = ex.language_id 
 LEFT JOIN follow fo ON (p.user_id = fo.tracked AND fo.followers = 804260829616815200) 
 LEFT JOIN likes_post li ON li.id_post = p.id  
 LEFT JOIN likes_post li1 ON (li1.id_user = 804260829616815200 AND li1.id_post = p.id) 
 WHERE p.user_id != 804260829616815200 
 AND u.id NOT IN(SELECT blockwho FROM blocklist_user 
 WHERE whoblock=804260829616815200) AND la.id IN (SELECT language_id 
 FROM exchangelg WHERE user_id = 804260829616815200) 
 GROUP BY p.id 
 ORDER BY p.ctime DESC, ex.prio DESC
