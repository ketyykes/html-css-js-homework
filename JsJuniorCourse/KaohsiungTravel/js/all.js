(function(){
let url =
  "https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c";
let district = [
  "全部地區",
  "鹽埕區",
  "鼓山區",
  "左營區",
  "楠梓區",
  "三民區",
  "新興區",
  "前金區",
  "苓雅區",
  "前鎮區",
  "旗津區",
  "小港區",
  "鳳山區",
  "林園區",
  "大寮區",
  "大樹區",
  "大社區",
  "仁武區",
  "鳥松區",
  "岡山區",
  "橋頭區",
  "燕巢區",
  "田寮區",
  "阿蓮區",
  "路竹區",
  "湖內區",
  "茄萣區",
  "永安區",
  "彌陀區",
  "梓官區",
  "旗山區",
  "美濃區",
  "六龜區",
  "甲仙區",
  "杉林區",
  "內門區",
  "茂林區",
  "桃源區",
  "那瑪夏區",
];

//add district in  getSelectDistrict
const getSelectDistrict = document.getElementById("selectDistrict");
district.forEach((element) => {
  getSelectDistrict.innerHTML += `<option value="${element}">${element}</option>`;
});
const getRenderData = document.querySelector(".renderData");
const getWrapPageNum = document.querySelector(".wrapPageNum");
const getWrapHotDistrict = document.querySelector(".wrapHotDistrict");
let dataView = []; 
let dataTem = [];
let districtTem = ""; //districtTemporarySave
let currentPageNum = 1;
let lastPageNum = 0;
let pageNum = 30;

// get remote data to dataView and render all district 
function getRemoteData() {
  fetch(url, {
    method: "GET",
    mode: "cors",
    header: new Headers({
      "Content-Type": "text/json",
    }),
  })
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error(response.status);
        console.log("網路有連線問題");
      }
      console.log(response);
      return response.json();
    })
    .then((result) => {
      dataView = bulidData(result);
      getRenderData.innerHTML='';
      getRenderData.previousElementSibling.textContent = "全部地區";
      dataView.forEach((item) => {
        dataTem.push(item);
      });
      makePageNum();
    })
    .catch((error) => {
      console.log("錯誤代碼為" + error);
      getRenderData.innerHTML="錯誤代碼為"+ error+"請聯絡伺服器管理人員";
    });
}
getRemoteData(); 



// pick view information from remote data and return arrary
function bulidData(remoteData) {
  let array = [];
  remoteData.data.XML_Head.Infos.Info.forEach((item) => {
    array.push(item);
  });
  return array;
}
getWrapHotDistrict.addEventListener("click",showDataInfo);
getWrapPageNum.addEventListener("click", pageNumClick);
getSelectDistrict.addEventListener("change", showDataInfo);

// render district title and process data which user selected

function buildDataTem(district) {
  getRenderData.previousElementSibling.textContent = district;
  if(district=="全部地區"){
    pageNum =30;
    dataView.forEach((item) => {
      dataTem.push(item);
    });
  }else{
    /*
      if item.Add's name contains the  selected district 
      ,put it in dataTem array 
    */
    pageNum=10;
    dataView.forEach((item) => {
      if (item.Add.indexOf(district) != -1) { 
        dataTem.push(item);
      }
    });
  }
}
//render user selected data
function renderDataView(view, district) {
  if(district=="全部地區"){
    district="";
  }
  let template = ` <li>
    <div class="wrapLocation" style='background-image: url(${view.Picture1})'>
      <h4>${view.Name}</h4>
      <h5>${district}</h5>
    </div>
    <p class="businessHours">
      <img src="images/icons_clock.png" alt="clock" />
      ${view.Opentime}
    </p>
    <p class="viewAddress">
      <img src="images/icons_pin.png" alt="pin" />
      ${view.Add}
    </p>
    <div class="wrapPhoneVisit">
      <p class="viewPhone">
        <img src="images/icons_phone.png" alt="phone" />
        <a href="tel:+${view.Tel}"> ${view.Tel}</a>
      </p>
      <p class="viewVisit">
        <img src="images/icons_tag.png" alt="tag" />
        ${view.Ticketinfo}
      </p>
    </div>
  </li>`;
  getRenderData.innerHTML += template;
}

// render page numbers and render 10 datas
function makePageNum(){
  lastPageNum = Math.ceil(dataTem.length / pageNum);
  if (dataTem.length > pageNum) {
    getWrapPageNum.innerHTML = `<button>&#060;prev</button>`;
    for (let i = 0; i < lastPageNum; i++) {
      getWrapPageNum.innerHTML += `<button>${i + 1}</button>`;
    }
    getWrapPageNum.innerHTML += `<button>next&#062;</button>`;
    getWrapPageNum.children[currentPageNum].style.color = "#559AC8";
  }
  render10Data(currentPageNum);
}

//render 10 datas
function render10Data(curPage) {
  let renderNum=0;
  if(lastPageNum==currentPageNum){
    renderNum = dataTem.length;
  }else{
    renderNum = curPage*pageNum;
  }
  for (let i = (curPage - 1) * pageNum; i<renderNum;  i++) {
    renderDataView(dataTem[i], districtTem);
  }
}




//addEventListener user clicks page number 
function pageNumClick(e) {
  if (e.target.nodeName != "BUTTON") {
    return;
  }
  getWrapPageNum.children[currentPageNum].style.color = "#000";
  if (isNaN(parseInt(e.target.textContent)) === false) {
    getRenderData.innerHTML = "";
    currentPageNum = e.target.textContent;
    console.log("last" + lastPageNum);
    console.log("curr" + currentPageNum);
    render10Data(currentPageNum);
  }
  if (e.target.textContent == "<prev" && currentPageNum != 1) {
    currentPageNum--;
    getRenderData.innerHTML = "";
    render10Data(currentPageNum);
  }

  if (e.target.textContent == "next>" && currentPageNum != lastPageNum) {
    currentPageNum++;
    getRenderData.innerHTML = "";
    render10Data(currentPageNum);
  }
  getWrapPageNum.children[currentPageNum].style.color = "#559AC8";
}
  
//addEventListener user selected district
function showDataInfo(e) {
  if(e.currentTarget.id=="selectDistrict"){
    districtTem = e.target.value;
    if (districtTem === "請選擇行政區") {
      return;
    }
  }
  if(e.currentTarget.className=="wrapHotDistrict"){
    if(e.target.nodeName=="BUTTON"){
      districtTem=e.target.textContent;
      selectDistrict.value = e.target.textContent;
    }
  }
  dataTem = [];
  currentPageNum = 1;
  getWrapPageNum.innerHTML = "";
  getRenderData.innerHTML = "";
  buildDataTem(districtTem);
  makePageNum();
}

})();
