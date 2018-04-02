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
