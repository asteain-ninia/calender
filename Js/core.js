const electron = require('electron');
const {ipcRenderer} = electron;

function TransCalender(){
	
}

function JulianDay(year, month, day){
  if(month < 3) {
   month += 12;
   year -= 1;
  }
  
  var a, b, c, d, e;
  
  a = Math.floor(year / 100);
  b = 2 - a + Math.floor(a / 4);
  c = Math.floor(365.25 * (year + 4716));
  d = Math.floor(30.6001 * (month + 1));
  e = Math.floor(day + b - 1524.5) + 1;
	//R020314追記　この関数、どっかから拾ってきた奴のはずなんだけど出典を忘れちゃった。テヘ
  return (c + d + e);
}

{
	var CelKrCykk = function(){
	
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth()+1;
	var day = today.getDate();
	var hor = today.getHours();
	var min = today.getMinutes();
	var sec = today.getSeconds();
	
	var yurius;
	yurius = JulianDay(year, month, day);
	
	var x;
	x = yurius-1526862;
	
	var dec=x-931376;
	var celYear=1;
	var celMonth=1;
	var celDay=1;
	
	while(x>0){
		x=x-1;
		if(celMonth==14){
			if(celDay==1){
				if(celYear%4==0){
					if(celYear%100==0){
						if(celYear%400==0){
							celDay=celDay+1;
						}else{
							celDay=1;
							celMonth=1;
							celYear=celYear+1;
						}
					}else{
						celDay=celDay+1;
					}
				}else{
					celDay=1;
					celMonth=1;
					celYear=celYear+1;
				}
			}else{
				celDay=1;
				celMonth=1;
				celYear=celYear+1;
			}
		}else{
			if(celDay==28){
				celDay=1;
				celMonth=celMonth+1;
			}else{
				celDay=celDay+1;
			}
		}
	}
	
	var time=(hor*60+min)*60+sec;
	var celtime=time-20000;
	var flag=1;
	if(celtime<0){
		celtime=86400+celtime;
		celDay=celDay-1;
		flag=2;
		if(celDay==0){
			celDay=28
			celMonth=celMonth-1
	
			if(celMonth==0){
				celMonth=14;
				celYear=celYear-1;
				if((year%4==0 && year%100!=0) || (year%400==0)){
					celDay=2;
				}else{
					celDay=1;
				}
			}
		}
	}
	
	var celhor =celtime/3600|0;
	var celmin =celtime%3600/60|0;
	var celsec =celtime%60;
	
	
	//改元処理
	if(year<=2019){
		if(month<=4){
			era='H';year=year-1988;
		}else{if(month>4)
			era="R";year=year-2018;
		}
	}else{
		if(year>2019){era="R";year=year-2018;}
	}
	
	
	
	
	//ひとけた対応
	if(year<10){year='0'+year;}
	if(day<10){day='0'+day;}
	if(month<10){month='0'+month;}
	if(celYear<10){
			celYear='000'+celYear;
	}else{
		if(celYear<100){
			celYear='00'+celYear;
		}else{
			if(celYear<1000){
				celYea='0'+celYear;
			}
		}
	}
	if(celMonth<10){celMonth='0'+celMonth;}
	if(celDay<10){celDay='0'+celDay;}
	if(hor<10){hor='0'+hor;}
	if(min<10){min='0'+min;}
	if(sec<10){sec='0'+sec;}
	if(celhor<10){celhor='0'+celhor;}
	if(celmin<10){celmin='0'+celmin;}
	if(celsec<10){celsec='0'+celsec;}
	
	if(flag==2){dec=dec-1;}
	
	return (era+year+month+day+'<br>'+hor+'-'+min+'-'+sec+'<br>C'+celYear+'-'+celMonth+celDay+'<br>'+celhor+'-'+celmin+'-'+celsec+'<br>dec '+dec);
	}
	
	var akcino = function(){
	 
	var result = document.getElementById("result");
	result.innerHTML = CelKrCykk();
	setTimeout(akcino, 100);
	
	}}