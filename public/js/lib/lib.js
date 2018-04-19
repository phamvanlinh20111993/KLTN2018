
	/**
	* Toa do o day la vi tri bat dau va ket thuc trung nhau khi so sanh giua 2
	* string toa do nay co dac diem la x,x1 luon tang
	*/

	var CoordinateSpecial = function(start, end){
		this.start = start;
		this.end = end;
	}
	
	CoordinateSpecial.prototype.getStart = function() {
        return this.start;
	}

    CoordinateSpecial.prototype.getEnd = function() {
        return this.end;
    }

    CoordinateSpecial.prototype.setStart = function(start) {
        this.start = start;
    }

    CoordinateSpecial.prototype.setEnd = function(end) {
        this.end = end;
    }

    /**
     * 
     * @param A
     * @return so sanh khoang cach giua 2 vi tri
     */
    CoordinateSpecial.prototype.distance= function() {
        return this.end - this.start;
    }

    CoordinateSpecial.prototype.show = function() {
        console.log(this.start + "   " + this.end);
    }
	
	/* tham khao tren: https://ide.geeksforgeeks.org/index.php */
	
	/**
	 * 
     * @param ObjArray is a array CoordinateSpecial ojects
     *         
	 * @param left is first position of array start with 0
	 *
     * @param mid is middle position of array 
	 *
	 * @param right is last position of array start with ObjArray.length -1
	 *
     * 
	*/
	
	function merge(ObjArray, left, mid, right){
		var i, j, k;
		var n1 = mid - left + 1;
		var n2 = right - mid;
		/* create temple arrays */
		var L = [], R = [];
		
		/* copy data */
		for(i = 0; i < n1; i++)
			L[i] = ObjArray[left + i];
		for(j = 0; j < n2; j++)
			R[j] = ObjArray[mid + 1 + j];
		
		i = 0;
		j = 0;
		k = left;
		while(i < n1 && j < n2){
			if(L[i].getStart() <= R[j].getStart()){
				ObjArray[k] = L[i]
				i++;
			}else{
				ObjArray[k] = R[j];
				j++;
			}
			k++;
		}
		
		while(i < n1){
			ObjArray[k] = L[i]
			i++;
			k++;
		}
		
		while(j < n2){
			ObjArray[k] = R[j];
			j++;
			k++
		}
		
	}
	
	/**
	 * 
     * @param ObjArray is a array CoordinateSpecial ojects
     *         
	 * @param left is first position of array start with 0
     *           
	 *@param right is last position of array start with ObjArray.length -1
	 *
     * @return oject was sorted	
	*/
	function mergeSort(ObjArray, left, right){
		if(left < right){
			var mid = parseInt(left + (right - left)/2)
			mergeSort(ObjArray, left, mid)
			mergeSort(ObjArray, mid+1, right)
			merge(ObjArray, left, mid, right)
		}
		
	}
	

    /**
     * 
     * @param A
     *            is a CoordinateSpecial
     * @param B
     *            is a CoordinateSpecial
     * @return check collision between CoordinateSpecial A and B
     */
    function intersectCoordinateSpecials(A, B) {
        // toa do A bao toa do B hoac nguoc lai
        if ((A.getStart() >= B.getStart() && A.getEnd() <= B.getEnd())
                || (B.getStart() >= A.getStart() && B.getEnd() <= A.getEnd()))
            return true;
        // toa do A va B giao nhau nhung khong bao lay nhau
        if ((A.getStart() < B.getEnd() && A.getEnd() > B.getStart())
                || (A.getEnd() > B.getStart() && B.getEnd() > A.getStart()))
            return true;

        return false;
    }

    /**
     * xoa cac va cham giua 2 arraylist tu
     * 
     * @param Mark_pos_new
     * @param Mark_pos_origin
     */
    function handleCollision(Mark_pos_new, Mark_pos_origin) {
        var index = 0, index1;
		
	//	var ind = 0;
	//	while(ind < Mark_pos_new.length){
	/////		console.log(Mark_pos_new[ind])
	////		ind++;
	//	}
		
        /**
         * hai chuoi co it nhat 1 vi tri trung nhau, luc nay can kiem chung cac vi tri
         * trung nhau co thuc su go^/i len nhau khong so sanh cac toa do xem co bi trung
         * nhau khong
         */

        while (index < Mark_pos_new.length) {
            index1 = index + 1;
            while (index1 < Mark_pos_new.length) {
                // xay ra va cham
                if(intersectCoordinateSpecials(Mark_pos_new[index], Mark_pos_new[index1])) {
                    console.log("co xu li diem trung nhau");
                    // ta chon do trung nhau lon nhat
                    if (Mark_pos_new[index].distance() > Mark_pos_new[index1].distance()) {
                        Mark_pos_new.splice(index1, 1);
                        Mark_pos_origin.splice(index1, 1);
                        index1--;
                    } else {
                        Mark_pos_new.splice(index, 1);
                        Mark_pos_origin.splice(index, 1);
                        index--;
                        break;
                    }
                }
                index1++;
            }
            index++;
        }
    }
    /**
     * 
     * @param A
     * @param start
     * @param end
     * @return
     */
    function rehabilitateString( A, start, end) {
        var s = "";
        var i = 0;
        for (i = start; i < end; i++) {
            s += A[i].toString();
            if (i < end - 1)
                s += " ";
        }
        return s;
    }
	
	//return a string 
	function innerHTMLString(words1, AddArray, color){
		var index = 0;
		var Str = "";

		for(var ind = 0; ind < words1.length;){
			if(index < AddArray.length && ind > AddArray[index].getStart()){
				while(ind > AddArray[index].getStart()){
					index++;
					if(index > AddArray.length-1) break;
				}
			}
			
			if( index < AddArray.length && ind == AddArray[index].getStart()){
				Str += '<span style="color:'+color+';">';
				while(ind < AddArray[index].getEnd()){
					Str += words1[ind] + " ";
					ind++
				}
				Str += '</span>';
			}else{
				Str += words1[ind] + " ";
				ind++;
			}
		}
		
		return Str;
	}

    /**
     * check content of two string
     * 
     * @param A
     *            old content
     * @param B
     *            new content--may be different A
     * @param change
     * @return
     */
	 
    function check(A, B) {

        // cut string by ' ' in String A
        var words = [], start = 0;
        while (start < A.split(" ").length) {
            words[start] = A.split(" ")[start];
            start++;
        }

        // cut string by ' ' in String B
       var words1 = [];
        start = 0;
        while (start < B.split(" ").length) {
            words1[start] = B.split(" ")[start];
            start++;
        }
        /**
         * Now compare two list
         */
        // index i, j, pos, length and max cua the mark string max
        var i, j, length, pos, pos1 = 0, max = 0, maxposOriginNew = 0, LengthO, LengthN;
        /**
         * mark position string origin
         */
        var Mark_pos_origin = [];
        /**
         * mark position string new
         */
        var Mark_pos_new = [];
        var tempOrigin = "";
        var tempNew = "";

        /* .....Start ........ */
        LengthO = words.length;// origin
        LengthN = words1.length;// new
        /*
         * danh dau cac diem trung nhau lon nhat de them vao arraylist
         */
        var i_max = 0, j_max = 0, pos_max = 0, pos1_max = 0;
        var has_max = false;
        for (i = 0; i < LengthN; i = maxposOriginNew) {
            max = 0;
            maxposOriginNew = i + 1;
            for (j = 0; j < LengthO; j++) {
                if (words1[i].toString() == words[j].toString()) {
                    length = 1;
                    pos = j + 1;
                    pos1 = i + 1;
                    while (pos < LengthO && pos1 < LengthN
                            && words1[pos1].toString() == words[pos].toString()) {
                        pos++;
                        pos1++;
                        length++;
                    }
                    if (max < length) {
                        max = length;
                        has_max = true;
                        i_max = i;
                        j_max = j;
                        pos_max = pos;
                        pos1_max = pos1;
                        maxposOriginNew = pos1;// luu vi tri trung nhau lon nhat vong lap sau se nhay cach
                    }
                }
            }
            // co ton tai diem trung nhau lon nhat
            if (has_max) {
                Mark_pos_new.push(new CoordinateSpecial(i_max, pos1_max));
			//	console.log("pos:  "+ i_max +"  "+ pos1_max)
                Mark_pos_origin.push(new CoordinateSpecial(j_max, pos_max));
			//	console.log("pos1:  "+ j_max +"  "+ pos_max)
                has_max = false;
            }
        }

        // hai chuoi hoan toan khac nhau
        if (Mark_pos_new.length != 0) {
            j = 0;
            /**
             * xoa bo cac toa do bi goi len nhau handleCollision(Mark_pos_new,
             * Mark_pos_origin); do vong lap day Mark_pos_new la vong lap chinh nen va cham
             * se xuat hien o Mark_pos_origin
             */
			 
			var AddArray = []
			var DelArray = []
			
            handleCollision(Mark_pos_origin, Mark_pos_new);
            //sap xep lai cac gia tri tu mang chinh va mang phu
            mergeSort(Mark_pos_origin, 0, Mark_pos_origin.length-1)
            j = 0;
            var replace_start = 0, replace_start1 = 0;
            var temp = "", temp1 = "";
			
            while (true) {
                if (j > 0) {
                    replace_start = Mark_pos_origin[j - 1].getEnd();
                    replace_start1 = Mark_pos_new[j - 1].getEnd();
                }
                
				if(replace_start != Mark_pos_origin[j].getStart())
					DelArray.push(new CoordinateSpecial(replace_start, Mark_pos_origin[j].getStart()))
	
				if(replace_start1 != Mark_pos_new[j].getStart())
					AddArray.push(new CoordinateSpecial(replace_start1, Mark_pos_new[j].getStart()))
   
                if (j == Mark_pos_new.length - 1) {// them 1 gia tri khi no la ket thuc file
					if(Mark_pos_origin[j].getEnd() != LengthO)
						DelArray.push(new CoordinateSpecial(Mark_pos_origin[j].getEnd(), LengthO))
					if(Mark_pos_new[j].getEnd() != LengthN)
						AddArray.push(new CoordinateSpecial(Mark_pos_new[j].getEnd(), LengthN))
                    break;
                }

                j++;
            }
        }
		
		console.log(AddArray)
		console.log(DelArray)
		
		return {
			add: innerHTMLString(words1, AddArray, "red"),
			del: innerHTMLString(words, DelArray, "blue")
		}
		
    }

    /**
     * 
     * @param s
     * @return
     */
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

	//var contentcopy = standardizeString("member something only thing")
//	var contentupdatecopy = standardizeString("something member thing only");
 //   var contentcopy = standardizeString("t mac ke m biet hay k thi t cung eo quan tam dau")
//	var contentupdatecopy = standardizeString("t cung dau dinh cho m biet gi dau ma doi hoi lam hu the thoi");
	
	function doTask(s1, s2){
		var contentcopy = standardizeString(s1)
		var contentupdatecopy = standardizeString(s2);
		return check(contentcopy, contentupdatecopy)
	}
	