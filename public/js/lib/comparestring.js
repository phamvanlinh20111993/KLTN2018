		
    /**
      *
      * @description: chuan hoa chuoi
      * @param s1: String s1
      *
     **/
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
     *
     * @description tao lai chuoi phan biet them sua xoa
     * @param splitstring  la chuỗi đã bị cắt bởi dấu  " ", sẽ chứa 1 mảng các từ
     * @param vitri là mảng chứa các từ trùng nhau giữa s1 và s2
     * @param status, 0 to mau la do khi xoa, 1 to mau la xanh khi them
     *
    **/
    function rewriteString(splitstring, vitri){

    	var ptagdelete = "<span style='color:red;'>", endtag = "</span>"
    	if(status = 1)
			ptagadd = "<span style='color:blue;'>"

		//chay kiem tra chuoi
		var strOld = "", position = 0
		for(var ind = 0; ind < vitri.length; ind++){
			for(var pos = position; pos < splitstring.length; pos++){
				if(splitstring[pos] == vitri[ind]){
					strOld += splitstring[pos]+ " ";
					position = pos+1;
					break;
				}else{
					strOld += ptagdelete +  splitstring[pos] + endtag + " ";
				}
			}
		}
		
		for(var pos = position; pos < splitstring.length; pos++){
			strOld += ptagdelete +  splitstring[pos] + endtag + " ";
		}

		return strOld.trim();
    }

    /**
      * @description: khoi phuc chuoi ve dang ban dau
      * @param origin chuoi ban dau chua chuan hoa
      * @param newstring - object chuoi da chuan hoa, vi tri tu trung nhau
      *
    **/
    function recoverString(origin, newstring) {
    	// body...
    	var arrorigin = origin.split(" "), ind = 0, index = 0, 
    		pos = 0, recoverstr = {}, mark = true, position = 0;
    	while(true){
    		if(ind == arrorigin.length)
    			break;
    		//bo ki tu trang
    		if(arrorigin[ind] == ""){
    			arrorigin.splice(ind, 1)
    			ind--
    		}
    		ind++;
    	}

    	recoverstr.str = [], recoverstr.pos = []
    	//khoi phuc chuoi
    	for(ind = 0; ind < newstring.str.length; ind++){
    		if(arrorigin[ind].toLowerCase() == newstring.str[ind].toLowerCase()){
			    recoverstr.str[ind] = arrorigin[ind]
    		}else{
    			mark = false;
    			break;
    		}
    	}

    	//khoi phuc vi tri trung nhau
    	for(ind = 0; ind < newstring.pos.length; ind++){
    		for(index = pos; index < arrorigin.length; index++){
    			if(newstring.pos[ind].toLowerCase() == arrorigin[index].toLowerCase()){
    				recoverstr.pos[position] = arrorigin[index]
    				position++;
    				pos = index + 1;
    				break;
    			}
    		}
    	}

    	if(!mark)
    		return newstring
    	else 
    		return recoverstr
    }

    /**
      *
      * @description: kiem tra so sanh 2 chuoi tim vị tri trung nhau, vi tri da xoa va them vao 
      * @param s1: String s1
      * @param s2: String s2
      *
     **/
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
				//mang vi tri luu tru cac tu trung nhau o ca 2 mang
				for(var index = 0; index < lonnhat; index++)
					vitri[index] = tamvitri[index]
			}
			if(chutrungnhau.length == lonnhat) break;
		}
		
		//document.getElementById("kq1").innerHTML = strOld.trim()
	//	document.getElementById("kq2").innerHTML = strNew.trim()
		var oldrecover = recoverString(origin, {
			str: splitostring,
			pos: vitri
		})

		var newrecover = recoverString(newstring, {
			str: splitnstring,
			pos: vitri
		})

		return  {
			add: rewriteString(oldrecover.str, oldrecover.pos, 0),
            del: rewriteString(newrecover.str, newrecover.pos, 1)
		}
	}

	//thuc hien nhiem vu
	var origin = "", newstring = ""

    /**
      *
      * @description: tra ve chuoi da chuan hoa va kiem tra trung nhau
      * @param s1: String s1
      * @param s2: String s2
      *
     **/
	function doTask(s1, s2){

		origin = s1
		newstring = s2
		var contentcopy = standardizeString(s1);
		var contentupdatecopy = standardizeString(s2);

		return doCheck(contentcopy, contentupdatecopy)
	}