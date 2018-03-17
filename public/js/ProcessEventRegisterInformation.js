/* # # # # # # # # # # # # # # # date event  # # # # # # # # # # # # # # # # # */

   function isLeapYear(year)
   {
      if(parseInt(year) % 400 == 0 || (parseInt(year) % 100 != 0 && parseInt(year) % 4 == 0))
         return true;
      return false
   }

   function takeDay(month, year){

      if(month == "" && year == "")
         return 31;

      var dayLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if(isLeapYear(year))
         dayLength[1] = 29;

      if(month != "")
         return parseInt(dayLength[parseInt(month-1)]);

      return 31;
   }

   function takeMonth(day, year)
   {
      if(parseInt(day) == 29){
         if(isLeapYear(year))
            return [];
         else 
            return [2];
      }

      if(parseInt(day) == 30)//tra ve cac thang khong co 30 ngay 
         return [2, 4, 6, 7, 8, 9, 11];

      if(parseInt(day) == 31)//tra ve cac thang khong co 31 ngay 
         return [1, 2, 3, 5, 7, 8, 10, 12];

      return []
   }

   function createOptionSelect(select_dom, optionvalue, optionshow)
   {
      var x = document.createElement("OPTION");
      x.setAttribute("value", optionvalue);
      var t = document.createTextNode(optionshow);
      x.appendChild(t);
      select_dom.appendChild(x);
   }

    var Dateofbirth = document.getElementById("dateofbirth")
    var Choosedate_div = Dateofbirth.getElementsByClassName("form-group")[0]
    var Choosedate_select = Choosedate_div.getElementsByTagName("select")[0]

    var Choosemonth_div = Dateofbirth.getElementsByClassName("form-group")[1]
    var Choosemonth_select = Choosemonth_div.getElementsByTagName("select")[0]

    var Chooseyear_div = Dateofbirth.getElementsByClassName("form-group")[2]
    var Chooseyear_select = Chooseyear_div.getElementsByTagName("select")[0]
    var select_year = true;

    var old_day1 = 0;
    Choosedate_select.onclick = function(){//lien quan den thang hoac nam
      var month = Choosemonth_select.options[Choosemonth_select.selectedIndex].value;
      var year = Chooseyear_select.options[Chooseyear_select.selectedIndex].value;
      var day = takeDay(month, year)

      if(old_day1 != day){
         for(var ind = Choosedate_select.length; ind > 0; ind--)
            Choosedate_select.remove(ind);

         for(var ind = 1; ind <= day; ind++)
            createOptionSelect(Choosedate_select, ind, ind);
         old_day1 = day
      }
    }

    var old_day = 0;
    Choosemonth_select.onclick = function(){//lien quan den ngay
      var day = Choosedate_select.options[Choosedate_select.selectedIndex].value;
      var month = []
      var year = Chooseyear_select.options[Chooseyear_select.selectedIndex].value;
      month = takeMonth(day, year)
      var Choosemonth_select_option = Choosemonth_select.getElementsByTagName("option")
    
      if(old_day != day){
         for(var ind = 0; ind <= 12; ind++)
            Choosemonth_select_option[ind].style.display = "block"

         for(var ind = 0; ind < month.length; ind++)
            Choosemonth_select_option[month[ind]].style.display = "none"
         old_day = day;
      }
    }

    Chooseyear_select.onclick = function(){ //lien quan den ngay
      if(select_year){
         yearnow = new Date().getFullYear();
         for(var ind = (yearnow - 80); ind <= (yearnow - 6); ind++)//tam muoi tuoi va lon hon 6 tuoi
            createOptionSelect(Chooseyear_select, ind, ind);
      }
      select_year = false;
    }