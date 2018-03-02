function makeuserid()
{
    var text = "";
    var possible = "0123456789";

    for( var i = 0; i < 26; i++ )//ma xac thuc co ngau nhien 45 ki tu
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function makeemailid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i = 0; i < 45; i++ )//ma xac thuc co ngau nhien 45 ki tu
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}


 function validateEmail(email)
 {

    if(typeof email == 'undefined')
        return false;

    if(email.length == "")
        return false; 
      
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!re.test(String(email).toLowerCase())) 
        return false;

    return true;
}

function is_Strange_characters(list){
   var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
   if(format.test(list))
      return true;

   return false;
}

function validatePassword(pass)
{
   if(typeof pass == 'undefined')
      return false;

   if(pass.length < 5 || pass.length > 25)
      return false;

   if(is_Strange_characters(pass))
      return false;

   var ind = 0, contain_num = false, contain_alphabet = false;
   for(ind = 0; ind < pass.length; ind++){//is tring contain any number??
      if(pass.charCodeAt(ind) > 47 && pass.charCodeAt(ind) < 58){
         contain_num = true;//contain number
      }

      if((pass.charCodeAt(ind) > 64 && pass.charCodeAt(ind) < 91) || 
         (pass.charCodeAt(ind) > 96 && pass.charCodeAt(ind) < 123)){
            contain_alphabet = true;//contain number
      }

      if(contain_num && contain_alphabet)  break;

   }

   if(!contain_num || !contain_alphabet) 
      return false;
   
   return true;
}   


function validateName(name)
{
   if(typeof name == 'undefined')
      return false;

   if(name.length < 5)
      return false;
      
   if(is_Strange_characters(name))
      return false;
      
   return true;
}

function validateDadeofBirth(day, month, year)
{
   if(typeof day == 'undefined' || typeof month == 'undefined' 
         || typeof year == 'undefined')
      return false;

   if(is_Strange_characters(day) || is_Strange_characters(month) 
      || is_Strange_characters(year))
       return false;

   var dayLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

   if(parseInt(year) % 400 == 0 || (parseInt(year) % 100 != 0 && parseInt(year) % 4 == 0))
      dayLength[1] = 29;

   var yearnow = new Date().getFullYear();

   if( parseInt(year) > (yearnow - 5) || (yearnow - parseInt(year)) > 80)
      return false;

   if(parseInt(day) > 32 || parseInt(day) < 0)
      return false;

   if(parseInt(month) > 12 || parseInt(month) < 0)
      return false;

   if(parseInt(day) > dayLength[parseInt(month)])
      return false;

   return true;
}

function validatePhotoFile(file)
{
   if(typeof file == 'undefined')
      return false;

   if(file.length < 5)
      return false

   var type = val.slice((Math.max(0, val.lastIndexOf(".")) || Infinity) + 1);//cach 1
   switch(type.toString().toLowerCase())
   {
      case "jpg":
      case "gif": 
      case "bmp": 
      case "png": 
      case "jpeg":
      case "gif":
      case "bpg": 
      case "bat":
      return true;
   }
                      
   return false;
}

function validateEmailId(code)
{
   if(typeof code == 'undefined')
      return false
   if(is_Strange_characters(code))
      return false
   if(code.length != 44)
      return false;

   return true;
}


module.exports = {
    makeUserid: makeuserid,
    makeEmailid: makeemailid,
    validateEmail: validateEmail,
    validatePassword: validatePassword,
    validateName: validateName,
    validateDadeofBirth: validateDadeofBirth,
    validatePhotoFile: validatePhotoFile,
    validateEmailId: validateEmailId
}