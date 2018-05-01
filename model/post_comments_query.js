var con = require('./mysqlconn')
var mysql = require('mysql');

//limit comment load to user
var selectMyposts = function(myid, cb){

  var sqlString = "SELECT u.id, u.email,u.name, u.photo, u.score, le.level "+
                  " FROM user u JOIN level le ON le.id = u.level_id "+
                  " WHERE u.id = " + mysql.escape(myid)

  con.query(sqlString, function(err, result){
    if(err) throw err
    else{
     
      var ListMyPost = {}
      ListMyPost.user = {  
         id: result[0].id,
         email: result[0].email, 
         name: result[0].name,
         photo: result[0].photo,
         score: result[0].score,
         level: result[0].level 
      }

      ListMyPost.posts = []
    
      var sqlString1 = "SELECT p.id AS pid, p.content, p.ctime AS ptime, p.turnof_cmt,"+
                  " ti.id AS tid, ti.name AS tiname, li1.id_user AS melike, p.isedit, "+
                  " COUNT(p.id) AS total, "+
                  " (SELECT COUNT(*) FROM comment c WHERE p.id = c.post_id) AS totalc" +
                  " FROM post p "+
                  " JOIN post_title ti ON ti.id = p.title_id "+
                  " JOIN exchangelg ex ON ex.user_id = p.user_id AND ex.prio = 1"+
                  " JOIN language la ON ex.language_id = la.id "+
                  " LEFT JOIN likes_post li ON li.id_post = p.id "+
                  " LEFT JOIN likes_post li1 "+
                  " ON (li1.id_user = "+ mysql.escape(myid)+" AND li1.id_post = p.id )"+
                  " WHERE p.user_id = " + mysql.escape(myid)+
                  " AND p.language_id = ex.language_id "+
                  " GROUP BY p.id ORDER BY p.ctime DESC"//, ex.prio DESC"

      console.log(sqlString1)
      con.query(sqlString1, function(err1, result1){
         if(err1) { 
            throw err1
            cb(ListMyPost)
         }else{
          //  console.log(result1)
            for(var ind = 0; ind < result1.length; ind++){
               ListMyPost.posts[ind] = {
                  pid: result1[ind].pid,
                  content: result1[ind].content,
                  title: result1[ind].tiname,
                  title_id: result1[ind].tid,
                  isedit: result1[ind].isedit,
                  turnofcmt: result1[ind].turnof_cmt,
                  time: result1[ind].ptime,
                  meliked: false,
                  totalcomment: result1[ind].totalc,
                  totalliked: result1[ind].total
               }

               if(result1[ind].melike)
                  ListMyPost.posts[ind].meliked = true  
            }
            
            cb(ListMyPost)
         }
      })
   }

  }) 

}


//load comment from specific post id
var selectCmts = function(myid, postid, limit, cb){
  var sqlString = "SELECT u.id, u.email, u.name, u.photo, u.score, le.level, "+
               " c.id AS cid, c.isedit, c.content, c.ctime FROM user u "+
               " JOIN level le ON u.level_id = le.id "+
               " JOIN comment c ON c.user_id = u.id "+
               " WHERE c.post_id = " + mysql.escape(postid)+
               " ORDER BY c.ctime ASC LIMIT "+limit.from+", "+limit.total

   con.query(sqlString, function(err, result){
      if(err){
         throw err
         cb(null)
      }else{
         var ListCmts = []
     
         for(var ind = 0; ind < result.length; ind++)
         {
            ListCmts[ind] = {}

            ListCmts[ind].user = {
               id: result[ind].id,
               email: result[ind].email,
               name: result[ind].name,
               photo: result[ind].photo,
               score: result[ind].score,
               level: result[ind].level
            }

            ListCmts[ind].comment = {
               id: result[ind].cid,
               content:result[ind].content,
               isedit: result[ind].isedit,
               time: result[ind].ctime
            }

         }

         cb(ListCmts)
      }
   }) 

}

//select all post from specific exchange language community
var selectNotMyposts = function(myid, searchcondi, filtercondi, cb)
{

   var sqlStr = "SELECT user.id, exchangelg.language_id AS exid FROM user "+
           " JOIN exchangelg ON exchangelg.user_id = user.id WHERE user.id = "+ parseInt(myid)+
           " AND exchangelg.prio = 1"

   con.query(sqlStr, function(error, res){     

      if(error) {
         throw error
         cb(null)
      }else
      {
         var likesearchcondi = ""
         var likefilter = ""
         if(searchcondi)
            likesearchcondi = " AND(u.name LIKE'%"+searchcondi+"%' OR u.email LIKE '%"+searchcondi+"%')"
         if(filtercondi){//search by title id
            if(parseInt(filtercondi) > 0 && parseInt(filtercondi) < 20)
               likefilter = " AND ti.id = "+parseInt(filtercondi)
         }

      	var sqlString = "SELECT p.id AS pid, p.user_id AS uid, p.content, p.ctime AS ptime, ti.name AS tiname,"+
               " p.turnof_cmt, ti.id AS tid, u.email, u.name AS uname, u.photo, u.score, p.isedit, "+
               " le.level, (SELECT COUNT(*) FROM comment c WHERE p.id=c.post_id) AS totalc,"+
               " fo.tracked AS istracked, li1.id_user AS melike, COUNT(p.id) AS totallike, "+
               " (SELECT ctime FROM post where post.id = p.id"+
               " AND (p.user_id = fo.tracked AND fo.followers="+mysql.escape(myid)+"))"+
               " AS timepostfl FROM post p"+
               " JOIN user u ON p.user_id = u.id"+
               " JOIN post_title ti ON ti.id = p.title_id"+
               " JOIN level le ON le.id = u.level_id"+
               " JOIN exchangelg ex ON ex.user_id = u.id"+
               " JOIN language la ON la.id = ex.language_id "+
           //    " JOIN language la ON la.id = "+parseInt(res[0].exid)+//add 3:40pm
               " LEFT JOIN follow fo ON (p.user_id = fo.tracked AND fo.followers="+mysql.escape(myid)+")"+
               " LEFT JOIN likes_post li ON li.id_post = p.id "+
               " LEFT JOIN likes_post li1 ON (li1.id_user = "+ mysql.escape(myid)+" AND li1.id_post = p.id )"+
               " WHERE p.user_id != "+mysql.escape(myid)+
               likesearchcondi+
               likefilter +
               " AND u.id NOT IN(SELECT blockwho FROM blocklist_user WHERE whoblock="+mysql.escape(myid)+")"+
               " AND la.id IN (SELECT language_id FROM exchangelg WHERE user_id="+mysql.escape(myid)+")"+
               " AND p.language_id = " + parseInt(res[0].exid) +
               " GROUP BY p.id"+
               " ORDER BY timepostfl DESC, p.ctime DESC"

         console.log(sqlString)

         con.query(sqlString, function(err, result){
            if(err) {
                throw err
                cb(null)
            }
            else{
               var ListPosts = []
              
               for(var ind = 0; ind < result.length; ind++)
               {
                  ListPosts[ind] = {}
                  ListPosts[ind].user = {
                     id: result[ind].uid,
                     email: result[ind].email, 
                     name: result[ind].uname,
                     photo: result[ind].photo,
                     score: result[ind].score,
                     level: result[ind].level
                  }

                  ListPosts[ind].posts = {
                     pid: result[ind].pid,
                     content: result[ind].content,
                     title: result[ind].tiname,
                     title_id: result[ind].tid,
                     turnofcmt: result[ind].turnof_cmt,
                     time: result[ind].ptime,
                     meliked: false,
                     totalcomment: result[ind].totalc, 
                     isedit: result[ind].isedit,
                     istracked: result[ind].istracked,
                     totalliked : result[ind].totallike
                  } 

                  if(result[ind].melike)
                     ListPosts[ind].posts.meliked = true    
               }

               cb(ListPosts)
            }
         })
      }
   })
}

//tìm kiếm bài đăng theo post id khi nhận thông báo
var selectPostById = function(myid, pid, cb)
{
   var sqlStr = "SELECT user.id, exchangelg.language_id AS exid FROM user "+
           " JOIN exchangelg ON exchangelg.user_id = user.id WHERE user.id = "+ parseInt(myid)+
           " AND exchangelg.prio = 1"

   con.query(sqlStr, function(error, res){     

      if(error) {
         throw error
         cb(null)
      }else
      {
         var sqlString = "SELECT p.id AS pid, p.user_id AS uid, p.content, p.ctime AS ptime, ti.name AS tiname,"+
               " p.turnof_cmt, ti.id AS tid, u.email, u.name AS uname, u.photo, u.score, p.isedit, "+
               " le.level, (SELECT COUNT(*) FROM comment c WHERE p.id=c.post_id) AS totalc,"+
               " fo.tracked AS istracked, li1.id_user AS melike, COUNT(p.id) AS totallike "+
               " FROM post p"+
               " JOIN user u ON p.user_id = u.id"+
               " JOIN post_title ti ON ti.id = p.title_id"+
               " JOIN level le ON le.id = u.level_id"+
               " JOIN exchangelg ex ON ex.user_id = u.id"+
               " JOIN language la ON la.id = ex.language_id "+
               " LEFT JOIN follow fo ON (p.user_id = fo.tracked AND fo.followers="+mysql.escape(myid)+")"+
               " LEFT JOIN likes_post li1 ON (li1.id_user = "+ mysql.escape(myid)+" AND li1.id_post = p.id )"+
               " WHERE p.id = "+mysql.escape(pid)+
               " AND u.id NOT IN(SELECT blockwho FROM blocklist_user WHERE whoblock="+mysql.escape(myid)+")"+
               " AND la.id IN (SELECT language_id FROM exchangelg WHERE user_id="+mysql.escape(myid)+")"+
               " AND p.language_id = " + parseInt(res[0].exid) +
               " GROUP BY p.id"

         console.log(sqlString)

         con.query(sqlString, function(err, result){
            if(err) {
                throw err
                cb(null)
            }
            else{
               var ListPosts = []
              
               for(var ind = 0; ind < result.length; ind++)
               {
                  ListPosts[ind] = {}
                  ListPosts[ind].user = {
                     id: result[ind].uid,
                     email: result[ind].email, 
                     name: result[ind].uname,
                     photo: result[ind].photo,
                     score: result[ind].score,
                     level: result[ind].level
                  }

                  ListPosts[ind].posts = {
                     pid: result[ind].pid,
                     content: result[ind].content,
                     title: result[ind].tiname,
                     title_id: result[ind].tid,
                     turnofcmt: result[ind].turnof_cmt,
                     time: result[ind].ptime,
                     meliked: false,
                     totalcomment: result[ind].totalc, 
                     isedit: result[ind].isedit,
                     istracked: result[ind].istracked,
                     totalliked : result[ind].totallike
                  } 

                  if(result[ind].melike)
                     ListPosts[ind].posts.meliked = true    
               }

               cb(ListPosts)
            }
         })
      }
   })
}


var selectPosts_myfollow = function(myid, myex, cb){
	var sqlString = ""

}

//select max id comment in database to response to user edit or delete comment
var selectMaxIdTable = function(tbname, cb){
   var sqlString = "SELECT MAX(id) AS maxid FROM " + tbname

   con.query(sqlString, function(err, result){
      if(err){
         throw err
         cb(null)
      }else
         cb(result[0].maxid)
   })
}

//lay thong tin nguoi dung like bai dang
var selectUserLikePost = function(myid, postid, cb){
   var sqlString = "SELECT u.id, u.email, u.name, u.photo, u.score, li.ctime "+
                   " FROM user u JOIN likes_post li "+
                   " ON li.id_user = u.id "+
                   " WHERE li.id_post = " + mysql.escape(postid)+
                   " AND li.id_user != " + mysql.escape(myid)

   con.query(sqlString, function(err, result){
      if(err) {
         throw err
         cb(null)
       }
      else{
         var lisuserlikes = []
         for(var ind = 0; ind < result.length; ind++){
            lisuserlikes[ind] = {
               id: result[ind].id,
               email: result[ind].email,
               name: result[ind].name,
               photo: result[ind].photo,
               score: result[ind].score,
               liketime: result[ind].ctime
            }
         }

         cb(lisuserlikes)

      }

   })

}

//lay ra nhung bai dang gan day nhat
var selectRecentPost = function(myid, limit, cb)
{
   var sqlStr = "SELECT user.id, exchangelg.language_id AS exid FROM user "+
           " JOIN exchangelg ON exchangelg.user_id = user.id WHERE user.id = "+ parseInt(myid)+
           " AND exchangelg.prio = 1"

   con.query(sqlStr, function(error, res){     

      if(error) {
         throw error
         cb(null)
      }else
      {
         var sqlString = "SELECT p.id AS pid, p.user_id AS uid, p.content, p.ctime as ptime, p.turnof_cmt,"+
               " ti.name AS tiname, u.email, u.name AS uname, u.photo, u.score, le.level, ti.id AS tid,"+
               " (SELECT COUNT(*) FROM comment c WHERE p.id = c.post_id) AS totalc, p.isedit, "+
               " fo.tracked AS istracked, li1.id_user AS melike, COUNT(p.id) AS totallike FROM post p"+
               " JOIN user u ON p.user_id = u.id"+
               " JOIN post_title ti ON ti.id = p.title_id"+
               " JOIN level le ON le.id = u.level_id"+
               " JOIN exchangelg ex ON ex.user_id = u.id"+
               " JOIN language la ON la.id = ex.language_id"+
             //  " JOIN language la ON la.id = "+parseInt(res[0].exid)+
               " LEFT JOIN follow fo ON (p.user_id = fo.tracked AND fo.followers="+mysql.escape(myid)+")"+
               " LEFT JOIN likes_post li ON li.id_post = p.id "+
               " LEFT JOIN likes_post li1 ON (li1.id_user = "+ mysql.escape(myid)+" AND li1.id_post = p.id )"+
               " WHERE p.user_id != "+mysql.escape(myid)+
               " AND u.id NOT IN(SELECT blockwho FROM blocklist_user WHERE whoblock="+mysql.escape(myid)+")"+
               " AND la.id IN (SELECT language_id FROM exchangelg WHERE user_id="+mysql.escape(myid)+")"+
               " AND p.language_id = " + parseInt(res[0].exid) +
               " GROUP BY p.id"+
               " ORDER BY p.ctime DESC LIMIT "+mysql.escape(limit)

         console.log(sqlString)

         con.query(sqlString, function(err, result){
            if(err) {
                throw err
                cb(null)
            }
            else{
               var ListPosts = []

               for(var ind = 0; ind < result.length; ind++)
               {
                  ListPosts[ind] = {}
                  ListPosts[ind].user = {
                     id: result[ind].uid,
                     email: result[ind].email, 
                     name: result[ind].uname,
                     photo: result[ind].photo,
                     score: result[ind].score,
                     level: result[ind].level
                  }

                  var totalliked = 0
                  ListPosts[ind].posts = {
                     pid: result[ind].pid,
                     content: result[ind].content,
                     title: result[ind].tiname,
                     title_id: result[ind].tid,
                     turnofcmt: result[ind].turnof_cmt,
                     time: result[ind].ptime,
                     meliked: false,
                     totalcomment: result[ind].totalc, 
                     isedit: result[ind].isedit,
                     istracked: result[ind].istracked,
                     totalliked :result[ind].totallike
                  }

                  if(result[ind].melike)
                     ListPosts[ind].posts.meliked = true
               }

               cb(ListPosts)
            }
         })
      }
   })

}


module.exports = {
	selectPosts_myfollow: selectPosts_myfollow,
	selectMyposts: selectMyposts,
	selectNotMyposts: selectNotMyposts,
   selectCmts: selectCmts,
   selectUserLikePost: selectUserLikePost,
   selectRecentPost: selectRecentPost,
   selectMaxIdTable: selectMaxIdTable,
   selectPostById: selectPostById
}