var con = require('./mysqlconn')
var mysql = require('mysql');


/**
  lay danh sach block list cua nguoi dung
**/
var selectMyFollowList = function(id, cb){
	var sqlString = "SELECT u.id, u.email, u.name, u.photo, le.level, fo.ctime, bl.id AS bluid "+
					" FROM user u "+
					" JOIN level le ON le.id = u.level_id "+
					" JOIN follow fo ON fo.tracked = u.id "+
               " LEFT JOIN blocklist_user bl ON (bl.whoblock="+mysql.escape(id)+ 
               " AND bl.blockwho = u.id)"+
					" WHERE fo.followers = "+mysql.escape(id)

	con.query(sqlString, function(err, result){
      if(err){
         throw err
         cb(null)
      }else{
         var blockList = []
         for(var ind = 0; ind < result.length; ind++){
         	blockList[ind] = {
         		 id: result[ind].id,
         		 email: result[ind].email,
         		 name: result[ind].name,
         		 photo: result[ind].photo,
         		 level: result[ind].level,
                isfollow: false,
         		 time: result[ind].ctime
         	}

            if(result[ind].bluid) 
               blockList[ind].isfollow = true
         }

         cb(blockList)
      }
   })
}

/**
  lay danh sach follow list cua nguoi dung
**/
var selectMyBlockList = function(id, cb){
	var sqlString = "SELECT u.id, u.email, u.name, u.photo, bl.timeblock, bl.ctime "+
					" FROM user u "+
					" JOIN blocklist_user bl ON bl.blockwho = u.id "+
					" WHERE bl.whoblock = "+mysql.escape(id)

	con.query(sqlString, function(err, result){
      if(err){
         throw err
         cb(null)
      }else{
      	 var followList = []
      	 for(var ind = 0; ind < result.length; ind++){
      	 	followList[ind] = {
      	 		id: result[ind].id,
      	 		email: result[ind].email,
      	 		photo: result[ind].photo,
      	 		name: result[ind].name,
      	 		timeblock: result[ind].timeblock,
      	 		time: result[ind].ctime
      	 	}
      	 }

         cb(followList)
      }
   })
}

/**   
   add more my exchange language
**/
var selectMyExAndLanguage = function(myid, cb){
   var sqlString = "SELECT de.id AS deid, de.name AS dename, ex.language_id AS exid, "+
                    " ex.time, ex.prio, lg.name AS lgname, lg.symbol, lg.id AS lgid" +
                    " FROM exchangelg ex "+
                    " JOIN degree de ON de.id = ex.degree_id "+
                    " JOIN language lg ON lg.id = ex.language_id "+
                    " WHERE ex.user_id = "+ mysql.escape(myid)
   
   con.query(sqlString, function(err, result, fields){
      if(err){
         throw err
         cb(null)
      }else{
         var myex  = {}
         myex.ex = []
         for(var ind = 0; ind < result.length; ind++){
            myex.ex[ind] = {
               exid: result[ind].exid,
               exname: result[ind].lgname,
               dename: result[ind].dename,
               symbol: result[ind].symbol,
               lgid: result[ind].lgid,
               deid: result[ind].deid,
               prio: result[ind].prio,
               time: result[ind].time
            }
         }

         var sqlString2 = "SELECT id, name, symbol FROM language "

         con.query(sqlString2, function(err1, result1, fields1){
            if(err1){
               throw err1
               cb(myex)
            }else{
               myex.language = []
               for(var ind = 0; ind < result1.length; ind++){
                  myex.language[ind] = {
                     id: result1[ind].id,
                     name: result1[ind].name,
                     symbol: result1[ind].symbol
                  }
               }

               cb(myex)
            }

         })

      }  
   }) 
}

/**   
   add more my native language
**/
var selectMyNatAndLanguage = function(myid, cb){
    var sqlString = "SELECT nat.language_id AS natid, nat.time, nat.prio, "+
                    " lg.name AS lgname, lg.symbol, lg.id AS lgid" +
                    " FROM nativelg nat "+
                    " JOIN language lg ON lg.id = nat.language_id "+
                     " WHERE nat.user_id = "+ mysql.escape(myid)
   
   con.query(sqlString, function(err, result, fields){
      if(err){
         throw err
         cb(null)
      }else{
         var mynat  = {}
         mynat.nat = []
         for(var ind = 0; ind < result.length; ind++){
            mynat.nat[ind] = {
               natid: result[ind].natid,
               natname: result[ind].lgname,
               dename: result[ind].dename,
               symbol: result[ind].symbol,
               lgid: result[ind].lgid,
               natid: result[ind].deid,
               prio: result[ind].prio,
               time: result[ind].time
            }
         }

         var sqlString2 = "SELECT id, name, symbol FROM language "

         con.query(sqlString2, function(err1, result1, fields1){
            if(err1){
               throw err1
               cb(mynat)
            }else{
               mynat.language = []
               for(var ind = 0; ind < result1.length; ind++){
                  mynat.language[ind] = {
                     id: result1[ind].id,
                     name: result1[ind].name,
                     symbol: result1[ind].symbol
                  }
               }

               cb(mynat)
            }

         })
      }  
   }) 
}


module.exports = {
	selectMyBlockList: selectMyBlockList,
	selectMyFollowList: selectMyFollowList,
   selectMyExAndLanguage: selectMyExAndLanguage,
   selectMyNatAndLanguage: selectMyNatAndLanguage
}