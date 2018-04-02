var mysql = require('mysql');

var con = mysql.createConnection({
  connectionLimit : 20,
  host: "localhost",
  user: "root",
  password: "",
  database: "KLTN_ExLanguage",
  charset: "utf8_general_ci"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Mysql Connected Postcomment Successful!");
});


//limit comment load to user
var selectMyposts = function(myid, cb){

  var sqlString = "SELECT u.id, u.email,u.name,u.photo, u.score, le.level "+
                  " FROM User u JOIN level le ON le.id = u.level_id "+
                  " WHERE u.id = " + mysql.escape(myid)

  con.query(sqlString, function(err, result){
    if(err) throw err
    else{
     
      var ListMyPost = {}
      ListMyPost.user = {  id: result[0].id,
                           email: result[0].email, 
                           name: result[0].name,
                           photo: result[0].photo,
                           score: result[0].score,
                           level: result[0].level }

      ListMyPost.posts = []
    
      var sqlString1 = "SELECT p.id AS pid, p.content, p.ctime AS ptime, p.turnof_cmt,"+
                  " ti.id AS tid, ti.name AS tiname, li1.id_user as melike, "+
                  " COUNT(p.id) AS total, "+
                  " (SELECT COUNT(*) FROM comment c WHERE p.id = c.post_id) AS totalc" +
                  " FROM post p "+
                  " JOIN post_title ti ON ti.id = p.title_id "+
                  " JOIN exchangelg ex ON ex.user_id = p.user_id "+
                  " LEFT JOIN likes_post li ON li.id_post = p.id "+
                  " LEFT JOIN likes_post li1 "+
                  " ON (li1.id_user = "+ mysql.escape(myid)+" AND li1.id_post = p.id )"+
                  " WHERE p.user_id = " mysql.escape(myid)+
                  " GROUP BY p.id ORDER BY p.ctime DESC, ex.prio DESC"

     // console.log(sqlString1)
      con.query(sqlString1, function(err1, result1){
         if(err1) { 
            throw err1
            cb(ListMyPost)
         }else{
          //  console.log(result1)
            var totalliked = 0
            for(var ind = 0; ind < result1.length; ind++){
               ListMyPost.posts[ind] = {
                  pid: result1[ind].pid,
                  content: result1[ind].content,
                  title: result1[ind].tiname,
                  title_id: result1[ind].tid,
                  turnofcmt: result1[ind].turnof_cmt,
                  time: result1[ind].ptime,
                  meliked: false,
                  totalcomment: result1[ind].totalc
               }

               totalliked = result1[ind].total

               if(result1[ind].melike){
                  ListMyPost.posts[ind].meliked = true
                  ListMyPost.posts[ind].totalliked = totalliked; 
               }else
                 ListMyPost.posts[ind].totalliked = parseInt(totalliked)-1; 
               totalliked = 0;
            }
            
            cb(ListMyPost)
         }
      })
   }

  }) 

}


//load comment from specific post id
var selectCmts = function(myid, postid, cb){
  var sqlString = "SELECT u.id, u.email, u.name, u.photo, u.score, le.level, "+
               " c.id AS cid, c.content, c.ctime FROM User u "+
               " JOIN level le ON u.level_id = le.id "+
               " JOIN comment c ON c.user_id = u.id "+
               " WHERE c.post_id = " + mysql.escape(postid)

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
               time: result[ind].ctime
            }

         }

         cb(ListCmts)
      }
   }) 

}

//select all post from specific exchange language community
var selectNotMyposts = function(myid, cb){
	var sqlString = "SELECT p.id AS pid, p.user_id AS uid, p.content, p.ctime as ptime, "+
                  " p.turnof_cmt, ti.id AS tid, ti.name AS tiname, u.email, u.name AS uname, "+
                  " u.photo, u.score, le.level FROM post p"+
                  " JOIN User u ON p.user_id = u.id "+
                  " JOIN post_title ti ON ti.id = p.title_id " +
                  " JOIN level le ON le.id = u.level_id " +
                  " JOIN exchangelg ex ON ex.user_id = u.id "+
                  " WHERE p.user_id != "+ mysql.escape(myid) +
                  " AND u.id NOT IN(SELECT blockwho FROM blocklist_user "+
                  " WHERE whoblock="+mysql.escape(myid)+")"+
                  " AND ex.id IN (SELECT id FROM exchangelg WHERE user_id = "+mysql.escape(myid)+")"+
                  " ORDER BY p.ctime DESC, ex.prio DESC "

  //chon 
  var sqlString1 = "SELECT tracked FROM follow WHERE followers = " + mysql.escape(myid)

  con.query(sqlString1, function(err, result){
    if(err)  throw err
    else{

      con.query(sqlString, function(err1, result1){
          if(err) {
            throw err;
            cb(null)
          }else{
            console.log(result1)
            cb(result1)
          }
      })
    }

  })
}


var selectPosts_myfollow = function(myid, myex, cb){
	var sqlString = ""

}

var selectUserLikePost = function(myid, myex, postid, cb){
  var sqlString = ""

}

var selectRecentPost = function(myid, cb){
  var sqlString = ""
}


module.exports = {
	selectPosts_myfollow: selectPosts_myfollow,
	selectMyposts: selectMyposts,
	selectNotMyposts: selectNotMyposts,
  selectCmts: selectCmts,
  selectUserLikePost: selectUserLikePost,
  selectRecentPost: selectRecentPost
}