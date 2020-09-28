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

function yuriusCalc(year, month, day){//先発グレゴリオ暦を想定。
	if(month<=2){
		month=month+12;
		year=year-1;
	}
	var yurius_result=Math.floor(365.25*year)+Math.floor(year/400)-Math.floor(year/100)+Math.floor(30.59*(month-2))+day-678911+2400000;
	return(yurius_result)
}

function getDates(){//日付もらうやつ
	var now = new Date();
	result={
		year:now.getFullYear(),
		month:now.getMonth()+1,//そのままでは0~11で出てしまうので、1~12に変換するため+1。
		day:now.getDate(),
		hor:now.getHours(),
		min:now.getMinutes(),
		sec:now.getSeconds(),
	}
	return (result);
}

function celloop(x){
	var celYear=1;
	var celMonth=1;
	var celDay=1;//すべての始まりはCel1 1月1日。

	while(x>0){//主に年末のifがやばいんだな。理解。
		x=x-1;
		if(celMonth==14){//14月に達してる？
			if(celDay==1){//14月一日？
				if(celYear%4==0){//うるう年？
					if(celYear%100==0){//うるう年？
						if(celYear%400==0){//うるう年？
							celDay=celDay+1;//うるう年だ！14月2日をつくろう。
						}else{//うるう年ではないらしい…。新年を迎えよう。
							celDay=1;
							celMonth=1;
							celYear=celYear+1;
						}
					}else{//うるう年だ！14月2日をつくろう。
						celDay=celDay+1;
					}
				}else{//うるう年ではないらしい…。新年を迎えよう。
					celDay=1;
					celMonth=1;
					celYear=celYear+1;
				}
			}else{//うるう年ではないらしい…。新年を迎えよう。
				celDay=1;
				celMonth=1;
				celYear=celYear+1;
			}
		}else{//１4月以外とな？
			if(celDay==28){//月末？なら新月を迎えよう！
				celDay=1;
				celMonth=celMonth+1;
			}else{//月末ではない。なら普通に日付を増やそう。
				celDay=celDay+1;
			}
		}
	}

	var results={
		year:celYear,
		month:celMonth,
		day:celDay
	};

	return(results);
}

function CelKrCykk(){

	var Dates = getDates();//今日の日付など
	var yurius = yuriusCalc(Dates.year, Dates.month, Dates.day); //今日のユリウス通日

	//var input = yurius-1526862;	//繰り返し回数。あとの減算はユリウス通日での暦の創始日
	var input = yurius-yuriusCalc(-532,4,12);//開始はCel歴の先発グレゴリオ暦でのもの。

	var dec=input-931376; //dec数計算。20180430を起点にする。
	
	console.log(yuriusCalc(Dates.year,Dates.month,Dates.day));
	var values=celloop(input);
	console.log(values)
	
	var time=(Dates.hor*60+Dates.min)*60+Dates.sec;//分数出して六十倍して秒足して現在の秒数
	var celtime=time-20000;//秒差
	var flag=1;//なにこれ
	if(celtime<0){
		celtime=86400+celtime;
		values.celDay=values.celDay-1;
		flag=2;
		if(values.celDay==0){
			values.celDay=28
			values.celMonth=values.celMonth-1
	
			if(values.celMonth==0){
				values.celMonth=14;
				values.celYear=values.celYear-1;
				if((values.year%4==0 && values.year%100!=0) || (values.year%400==0)){
					values.celDay=2;
				}else{
					values.celDay=1;
				}
			}
		}
	}
	
	var celhor =celtime/3600|0;
	var celmin =celtime%3600/60|0;
	var celsec =celtime%60;
	
	
	//改元処理
	if(Dates.year<=2019){
		if(Dates.month<=4){
			era='H';Dates.year=Dates.year-1988;
		}else{if(Dates.month>4)
			era="R";Dates.year=Dates.year-2018;
		}
	}else{
		if(Dates.year>2019){era="R";Dates.year=Dates.year-2018;}
	}
	
	
	
	
	//ひとけた対応
	if(Dates.year<10){Dates.year='0'+Dates.year;}
	if(Dates.day<10){Dates.day='0'+Dates.day;}
	if(Dates.month<10){Dates.month='0'+Dates.month;}
	if(values.celYear<10){
		values.celYear='000'+values.celYear;
	}else{
		if(values.celYear<100){
			values.celYear='00'+values.celYear;
		}else{
			if(values.celYear<1000){
				values.celYea='0'+values.celYear;
			}
		}
	}
	if(values.celMonth<10){values.celMonth='0'+values.celMonth;}
	if(values.celDay<10){values.celDay='0'+values.celDay;}
	if(Dates.hor<10){Dates.hor='0'+Dates.hor;}
	if(Dates.min<10){Dates.min='0'+Dates.min;}
	if(Dates.sec<10){Dates.sec='0'+Dates.sec;}
	if(celhor<10){celhor='0'+celhor;}
	if(celmin<10){celmin='0'+celmin;}
	if(celsec<10){celsec='0'+celsec;}
	console.log(values)
	if(flag==2){dec=dec-1;}
	
	return (era+Dates.year+Dates.month+Dates.day+'<br>'+Dates.hor+'-'+Dates.min+'-'+Dates.sec+'<br>C'+values.celYear+'-'+values.celMonth+values.celDay+'<br>'+celhor+'-'+celmin+'-'+celsec+'<br>dec '+dec);
}
	
function akcino(){//無限ループ始めるやつ

var result = document.getElementById("result");
result.innerHTML = CelKrCykk();
setTimeout(akcino, 100);

}


function JuliusCalc(year, month, day){
	if(month <= 2){
		month += 12;
		year -= 1;
	}
	return Math.floor(365.25 * year) + Math.floor(year / 400) - Math.floor(year / 100) + Math.floor(30.59 * (month - 2)) + day -678912 + 2400000;
}	
function TransYinDate(yearI, monthI, dayI){
	var elapse = JuliusCalc(yearI, monthI, dayI) - JuliusCalc(-712, 9, 22);
	var tempYear = Math.floor(elapse / 365.2425);
	var elapseInYear = Math.floor(elapse - tempYear * 365.2425);
	var tempMonth = Math.floor(elapseInYear / 28) + 1;
	var tempDay = Math.floor(elapseInYear - (tempMonth - 1) * 28) + 1;

	if(tempMonth < 1){
		tempYear -= 1;
		elapseInYear = elapse - Math.floor(tempYear * 365.2425);
		tempMonth = Math.floor(elapseInYear / 28) + 1;
		tempDay = Math.floor(elapseInYear - (tempMonth - 1) * 28) + 1;
	}
	if(tempMonth > 14){
		tempYear += 1;
		elapseInYear = elapse - Math.floor(tempYear * 365.2425);
		tempMonth = Math.floor(elapseInYear / 28) + 1;
		tempDay = Math.floor(elapseInYear - (tempMonth - 1) * 28) + 1;
	}

	if(tempMonth == 14){
		tempYear += 1;
		tempMonth = 0;
	}
	return tempYear + "/" + tempMonth + "/" + tempDay;
}

function YinSwitch(){
	var result = document.getElementById("result");
	var Dates = getDates();//今日の日付など
	result.innerHTML = TransYinDate(Dates.year,Dates.month,Dates.day);
	console.log(yuriusCalc(1,1,1));
	console.log(JuliusCalc(1,1,1));
}
