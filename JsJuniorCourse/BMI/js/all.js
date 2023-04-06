(function(){
const getHeight = document.getElementById('enter_height');
const getWeight = document.getElementById('enter_weight')
const getResult = document.querySelector('.result');
const getWrapReset = document.querySelector('.wrap_reset');
const getReset = document.querySelector('.reset');
const getBMIText = getWrapReset.children[1];
const getResetImgDiv = getReset.children[2];
let colorName =["_lightblue","_lightgreen","_orange1","_orange2","_red"];
let calculateColor  ="";
const getPromptText = document.querySelector('.promptText');
const getContent = document.querySelector(".list");
const getDelBtn = document.getElementById('allDel');

getDelBtn.addEventListener('click',deleteLocal);
let recordAry = [];
function printLocalStorageBMI(){
    getContent.innerHTML ='';
    if(localStorage.getItem('item')===null) {
        console.log('沒有資料');
        return
    };

    recordAry=JSON.parse(localStorage.getItem('item'));  
    for (let i = 0; i <recordAry.length; i++){
        printTemplate(recordAry[i].weight,recordAry[i].height,recordAry[i].BMIText,recordAry[i].BMI,recordAry[i].color,recordAry[i].year,recordAry[i].month,recordAry[i].date,recordAry[i].getTime);
    }
}
printLocalStorageBMI();

getResult.addEventListener('click',lookResult);
getResetImgDiv.addEventListener('click',goBack);
function isItInput(){
    let promptStr = "您沒有輸入";
    if(getHeight.value===""||getWeight.value===""){
        if(getHeight.value===""){
            promptStr +="身高";
        }
        if (getWeight.value===""){
            promptStr +="體重";
        }
        getPromptText.classList.remove("vh");
        getPromptText.textContent = promptStr;
        return true;
    }
    if(getHeight.value <=0 ||getWeight.value<=0){
        getPromptText.textContent = "身高或體重格式錯誤";
        getPromptText.classList.remove("vh");
        return true;
    }
    getPromptText.classList.add("vh");
    return false;
}
function lookResult() {
    if (isItInput()) {
        return;
    }
    let BMIValue =0;
    let BMIText = "";
    let todayAry =[];
    BMIValue=calculateUserBMI(getHeight.value,getWeight.value);
    console.log(BMIValue);
    BMIText=BMIRange(BMIValue);
    printResetOrResult(BMIValue,BMIText);
    todayAry = yearMonthDate(); //日期轉換成01-10-2020
    recordAry.push(buildBMIObj(todayAry[2],todayAry[1],todayAry[0],BMIValue,BMIText,getWeight.value,getHeight.value,todayAry[3],calculateColor));
    localStorage.setItem('item', JSON.stringify(recordAry));
    printLocalStorageBMI();
    getDelBtn.classList.remove('dn');

}

function calculateUserBMI(height,weight){
    height=height/100;
    let result= Math.round((weight/Math.pow(height,2))*100)/100;
    return result;
}
function BMIRange(BMIValue){
    switch (true) {
        case (0<BMIValue &&BMIValue<18.5):
            calculateColor = colorName[0];
            console.log("過輕");
            return "過輕";
        case (18.5<=BMIValue && BMIValue<24):
            calculateColor = colorName[1];
            console.log("標準");
            return "標準";
        case (24<=BMIValue && BMIValue<27):
            calculateColor = colorName[2];
            console.log("過重");
            return "過重";
        case(27<=BMIValue && BMIValue<30):
            calculateColor = colorName[3];
            console.log("輕度肥胖");
            return "輕度肥胖";
        case(30<=BMIValue && BMIValue<35):
            calculateColor = colorName[3];
            console.log("中度肥胖");
            return "中度肥胖";
        case(BMIValue>=35):
            calculateColor = colorName[4];
            console.log("重度肥胖");
            return "重度肥胖";
    }
}
function toggleResetResult(){
    getResult.classList.toggle('dn');
    getWrapReset.classList.toggle('dn');
    getWrapReset.classList.toggle('db');
}
function toggleColor(color){
    getWrapReset.classList.toggle("font_color"+color);
    getResetImgDiv.classList.toggle("background_color"+color);
    getReset.classList.toggle("border_color"+color);
}
function yearMonthDate(){
    let dateObj = new Date();
    let thisMonth = (dateObj.getMonth()+1);
    thisMonth = thisMonth<10 ? ("0"+thisMonth):thisMonth;
    let thisYear = dateObj.getFullYear();
    let thisDate = dateObj.getDate();
    thisDate = thisDate<10 ? ("0"+thisDate):thisDate;
    let array = [thisDate, thisMonth, thisYear,dateObj.getTime()];
    return array;
}
function buildBMIObj(y,m,d,bmi,bmitext,w,h,time,c){
    let BMIObj = {
        year:y,
        month:m,
        date:d,
        BMI:bmi,
        BMIText:bmitext,
        weight:w,
        height:h,
        getTime:time,
        color:c
    }
    return BMIObj;
}
function printResetOrResult(value,text){
    getReset.children[0].textContent = value;
    getBMIText.textContent=text;
    toggleResetResult();
    toggleColor(calculateColor);
    
}
function printTemplate(weight,height,BMIText,BMI,color,thisYear,thisMonth,thisDate,getTime){
    let recorderTemplate = `
  <ul class="pl-1 pr-1 border_left_color${color}">
  <li>${BMIText}</li>
  <li><span>BMI</span> ${BMI}</li>
  <li><span>weight</span>${weight}kg</li>
  <li><span>height</span>${height}cm</li><li><span>${thisMonth}-${thisDate}-${thisYear}</span></li>
  <button data-item="${getTime}">刪除</button>
  </ul>
  `;
  getContent.innerHTML += recorderTemplate;
}
function goBack(){
    printResetOrResult();
    calculateColor  ="";
    getHeight.value ='';
    getWeight.value ='';
}
function deleteLocal(){
    if(localStorage.getItem('item')){
        recordAry = [];
        localStorage.removeItem('item');
    }
    else{
        return;
    }
printLocalStorageBMI();
    getDelBtn.classList.toggle('dn');
}

getContent.addEventListener('click', function(e){
    if(e.target.dataset.item){
        let itemIndex;
        recordAry.forEach(function(item,index){
            if(item.getTime==e.target.dataset.item){
                itemIndex = index;
            }
        });
        recordAry.splice(itemIndex,1);
        localStorage.setItem('item',JSON.stringify(recordAry));
        if(JSON.parse(localStorage.getItem('item')).length==0){
            getDelBtn.classList.add('dn');
        }
        printLocalStorageBMI();
    }
})

})();