		
	//chuan hoa chuoi
	function standardizeString(s) {
        // change string to lowercase
        var lower = s.toLowerCase();
		lower = lower.trim()//loai bo ki tu trống o dau va cuoi xau
        // abandoned the space character
        var index;
        for (index = 0; index < lower.length;) {
            if (lower[index] == ' ') {
                var pos = index + 1;
                if (pos < lower.length) {
                    while (lower[pos] == ' ') {
                        pos++;
                        if (pos == lower.length)
                            break;
                    }
                }
                if (pos > index + 1) {
                    var end = lower.substring(pos, lower.length);
                    lower = lower.substring(0, index + 1);
                    lower = lower + end;
                }
            }
            index++;
        }
        return lower;
    }

    /**
     * @description khoi phuc lai chuoi tro ve ban dau
	 * @origin la chuoi ban dau chua chuan hoa
	 * @replace la mot mang cac tu da chuan hoa cac ki tu
	 *	
    **/
    function recoverString(origin, replace){

    	//doi chuoi tu mang thanh chuoi string
    	var ostring = ""
    	for(var ind = 0; ind < replace.length; ind++)
    		ostring += replace[ind] + " "

    	origin = origin.trim()
    	replace = replace.trim()
    	// for(var ind = 0; ind < origin.length; ind++){
    	// 	if(origin[ind] == " ") continue
    	// 	else{
    	// 		ostring[ind] = ""
    	// 	}
    	// }
    }

    //kiem tra so sanh 2 chuoi
    function doCheck(s1, s2){

		var ostring = s1
		var nstring = s2
	
		splitostring =  ostring.split(" ")
		splitnstring = nstring.split(" ")

		var chutrungnhau = [], pos = 0, mark = []
		
		for(var ind = 0; ind < splitostring.length; ind++){
			for(var index = 0; index < splitnstring.length; index++){
				if(splitostring[ind] == splitnstring[index]){
					chutrungnhau[pos] = splitostring[ind]
					pos++
					break;
				}
			}
		}
		
		//tim do tang dai nhat
		var trungnhaulonnhat = [], vitri = [], pos = 0, max = 0
		for(var ind = 0; ind < chutrungnhau.length; ind++){
			var lonnhat = 0, tamvitri = [], position = 0
			for(var ind1 = ind; ind1 < chutrungnhau.length; ind1++){
				for(var index = position; index < splitnstring.length; index++){
					if(chutrungnhau[ind1] == splitnstring[index]){
						tamvitri[lonnhat] = chutrungnhau[ind1]
						lonnhat++;
						position = index+1;
						break;
					}
				}
			}
			
			if(max < lonnhat){
				max = lonnhat
				for(var index = 0; index < lonnhat; index++)
					vitri[index] = tamvitri[index]
			}
			if(chutrungnhau.length == lonnhat) break;
		}
		
		var ptagdelete = "<span style='color:red;'>", endtag = "</span>",
			ptagadd = "<span style='color:blue;'>"
		//chay kiem tra chuoi
		var strOld = "",strNew = "", position = 0
		for(var ind = 0; ind < vitri.length; ind++){
			for(var pos = position; pos < splitostring.length; pos++){
				if(splitostring[pos] == vitri[ind]){
					strOld += splitostring[pos]+ " ";
					position = pos+1;
					break;
				}else{
					strOld += ptagdelete +  splitostring[pos] + endtag + " ";
				}
			}
		}
		
		for(var pos = position; pos < splitostring.length; pos++){
			strOld += ptagdelete +  splitostring[pos] + endtag + " ";
		}
		
		position = 0
		for(var ind = 0; ind < vitri.length; ind++){
			for(var pos = position; pos < splitnstring.length; pos++){
				if(splitnstring[pos] == vitri[ind]){
					strNew += splitnstring[pos] + " "
					position = pos+1;
					break;
				}else{
					strNew += ptagadd +  splitnstring[pos] + endtag + " ";
				}
			}
		}
		
		for(var pos = position; pos < splitnstring.length; pos++){
			strNew += ptagadd +  splitnstring[pos] + endtag + " ";
		}
		
		//document.getElementById("kq1").innerHTML = strOld.trim()
	//	document.getElementById("kq2").innerHTML = strNew.trim()

		var stringReturn = {
			add: strOld.trim(),
            del: strNew.trim()
		}

		return stringReturn
	}

	//thuc hien nhiem vu
	function doTask(s1, s2){
		var contentcopy = standardizeString(s1);
		var contentupdatecopy = standardizeString(s2);
		return doCheck(contentcopy, contentupdatecopy)
	}