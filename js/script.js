// 定数
var STORAGE_NAME = 'manada_umi-okaimonolist_sd';
var ICON_LIST = ['food/milk', 'food/yogurt', 'food/cheese', 'food/egg', 'food/fish', 'food/meet',
    'food/carrot', 'food/cabbage', 'food/tomato', 'food/cucumber','food/pumpkin',
    'food/onion', 'food/potato', 'food/eggplant', 'food/mushroom',
    'food/apple', 'food/wheat',
    'food/rice', 'food/bread', 'food/noodles', 'food/pasta',
    'food/cup', 'food/beer', 'food/sake', 'food/wine', 'food/drink', 'food/teabag', 'food/coffeemilk',
    'food/soysauce', 'food/suger', 'food/salt', 'food/mayonnaise',
    'food/bottle', 'food/bottle2', 'food/bottle3', 'food/canning',
    'food/wrap', 'food/paper',
    'dailygoods/battery',
    'dailygoods/medicine', 'dailygoods/medicine2',
    'dailygoods/cosmetic', 'dailygoods/cosmetic2', 'dailygoods/cosmetic3', 'dailygoods/cosmetic4',
    'dailygoods/toothbrush', 'dailygoods/shampoo',
    'dailygoods/detergent', 'dailygoods/detergent2', 'dailygoods/detergent3',
    'dailygoods/corocoro', 'dailygoods/dustcloth', 'dailygoods/tissue', 'dailygoods/toiletpaper', 'dailygoods/trashcase',
    'stationery/note', 'stationery/tape',
    'etc/bag', 'etc/box', 'etc/flower',
];
var PANEL_LIST = ['Main', 'List', 'Edit', 'Config', 'Tutorial'];

// global変数
var data = null;
var panel = 'Main';
var editIndex = 0;

// クラス
var SaveData = function () {
    this.title = 'Okaimono Check';
    this.itemList = [];
    this.color = '#000000';
    this.backgroundcolor = '#ffffff';
    // ▼ 0.9.1 カラーパレット追加
    this.colorpalette = ['#cccccc', '#99dddd', '#ffcc99', '#99dd99', '#eeee99', '#aaaaee', '#ee9999', '#ffaacc', '#ccee99', '#99ccee'];
    // ▲ 0.9.1
    // ▼ 0.9.2 サンプルデータ追加
    this.itemList.push(new Item('牛乳', 2, 'food/milk'));
    this.itemList.push(new Item('ヨーグルト', 2, 'food/yogurt'));
    this.itemList.push(new Item('チーズ', 2, 'food/cheese'));
    this.itemList.push(new Item('卵', 2, 'food/egg'));
    this.itemList.push(new Item('お米', 2, 'food/rice'));
    this.itemList.push(new Item('薄力粉', 4, 'food/wheat'));
    this.itemList.push(new Item('塩', 4, 'food/salt'));
    this.itemList.push(new Item('砂糖', 4, 'food/suger'));
    this.itemList.push(new Item('醤油', 4, 'food/soysauce'));
    this.itemList.push(new Item('味噌', 4, 'food/bottle2'));
    this.itemList.push(new Item('シャンプー', 5, 'dailygoods/shampoo'));
    this.itemList.push(new Item('リンス', 5, 'dailygoods/shampoo'));
    this.itemList.push(new Item('クリーナー', 3, 'dailygoods/corocoro'));
    // ▲ 0.9.2
    // ▼ 0.9.2 チュートリアルを追加
    this.isFirst = true;
    // ▲ 0.9.2
};

var Item = function (name, color, image) {
    this.name = name;
    this.color = color;
    this.image = image;
    this.on = true;
    this.date = '----/--/--';
};

function setItem(item, name, color, image) {
    item.name = name;
    item.color = color;
    item.image = image;
    return item;
}

// json共通クラス
function load() {
    var sd = JSON.parse(localStorage.getItem(STORAGE_NAME));
    if (sd == null) {
        sd = new SaveData();
    }
    // ▼ 0.9.1 カラーパレット追加
    else if (sd.colorpalette.length < 10) {
        sd.colorpalette[7] = '#dddd99';
        sd.colorpalette[8] = '#99ffcc';
        sd.colorpalette[9] = '#ff99cc';
        save(sd);
    }
    // ▲ 0.9.1
    return sd;
}

function save(sd) {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(sd));
}

function clearData() {
    localStorage.removeItem(STORAGE_NAME);
}

// javascript共通クラス
function getDate() {
    var d = new Date();
    var yy = d.getFullYear();
    var mm = ('00' + (d.getMonth() + 1)).slice(-2);
    var dd = ('00' + d.getDate()).slice(-2);
    return yy + '/' + mm + '/' + dd;
}

function getElement(id) {
    return document.getElementById(id);
}

function getElementByClass(className) {
    return document.getElementsByClassName(className)[0];
}

function getElementListByClass(className) {
    return Array.prototype.slice.call(document.getElementsByClassName(className));
}

function getElementListByTagName(tagName) {
    return Array.prototype.slice.call(document.getElementsByTagName(tagName));
}

function getStyle(id) {
    return document.getElementById(id).style;
}

function inputCheck(str) {
    str = str.replace('<', '');
    str = str.replace('>', '');
    return str;
}

function drow(id, str) {
    getElement(id).innerHTML = str;
}

function select(element, cssName) {
    if (getElementByClass(cssName + 'A')) {
        getElementByClass(cssName + 'A').className = cssName;
    }
    element.className = cssName + 'A';
}

function movePanel(nextPanel) {
    switch (panel) {
        case 'Main':
            getElementListByClass('menu-button').forEach(function (element) {
                element.style.visibility = 'hidden';
            });
            break;
        case 'Add':
            nextPanel = 'Main';
            break;
        case 'Edit':
            nextPanel = 'List';
            break;
    }
    panel = nextPanel;
    switch (nextPanel) {
        case 'Main':
            drowItemGrid();
            getElementListByClass('menu-button').forEach(function (element) {
                element.style.visibility = 'visible';
            });
            break;
        case 'List':
            drowItemList();
            break;
        case 'Add':
            drowEditPanel('', 1, 'food/milk');
            nextPanel = 'Edit';
            break;
        case 'Edit':
            editIndex = Number(getElementByClass('list-itemA').id.slice(9));
            var item = data.itemList[editIndex];
            drowEditPanel(item.name, item.color, item.image);
            break;
        case 'Config':
            drowConfigColor();
            break;
        case 'Tutorial':
            break;
    }

    PANEL_LIST.forEach(function (value) {
        getStyle(value + 'Panel').visibility = 'hidden';
    });
    getStyle(nextPanel + 'Panel').visibility = 'visible';
}

// drow
function drowTitle() {
    drow('menu-title', data.title);
}

function drowItemGrid() {
    var str = '';
    data.itemList.forEach(function (item, index) {
        str += drowItemBox(item, index);
    });
    drow('MainPanel', str);
}

function drowItemBox(item, index) {
    var color = data.colorpalette[0];
    if (data.itemList[index].on) {
        color = data.colorpalette[data.itemList[index].color];
    }

    var str = '';
    str += '<div class="main-item" id="main-item' + index + '" style="background-color:' + color + '"';
    str += ' onclick="pushItem(\'' + index + '\')">';
    str += '<img class="main-item" src="img/' + item.image + '.png">';
    str += '<div class="main-item-name">' + item.name.replace(',', '<br>') + '</div>';
    str += '</div>';
    return str;
}

function drowItemList() {
    var str = '';
    data.itemList.forEach(function (item, index) {
        var cssClass = (index == 0) ? 'A' : '';
        str += '<div class="list-item' + cssClass + '" id="list-item' + index + '"';
        str += ' onclick="select(this,\'list-item\')">';
        str += drowItemLine(item, index) + '</div>';
    });
    drow('list-content', str);
}

function drowItemLine(item, index) {
    var str = '';
    str += '<div class="list-item-box"';
    str += ' style="background-color:' + data.colorpalette[item.color] + '">';
    str += '<img class="list-item-box" src="img/' + item.image + '.png" align="left">';
    str += item.name.replace(',', '');
    str += '<span class="list-item-box-date">' + item.date + '</span>';
    str += '</div>';
    return str;
}

function drowEditPanel(name, color, img) {
    getElement('edit-name').value = name;
    select(getElement('edit-color' + color), 'edit-color');
    select(getElement('edit-icon' + img), 'edit-icon');
}

function drowColorList() {
    var str = '';
    data.colorpalette.forEach(function (value, index) {
        var cssClass = (index == 1) ? 'A' : '';
        if (index != 0) {
            str += '<div class="edit-color' + cssClass + '" id="edit-color' + index + '"';
            str += ' onclick="select(this,\'edit-color\')">';
            str += '<img src="img/system/color.png"';
            str += ' alt="' + index + '" style="background-color:' + value + '"></div>';
        }
    });
    drow('edit-color', str);
}

function drowIconList() {
    var str = '';
    ICON_LIST.forEach(function (value, index) {
        var cssClass = (index == 0) ? 'A' : '';
        str += '<div class="edit-icon' + cssClass + '" id="edit-icon' + value + '"';
        str += ' onclick="select(this,\'edit-icon\')">';
        str += '<img class="edit-icon" src="img/' + value + '.png" alt="' + value + '"></div>';
    });
    drow('edit-icon', str);
}

function drowConfig() {
    document.body.style.color = data.color;
    // ▼ 0.9.1 ボタン文字色変更
    getElementListByTagName('button').forEach(function (element) {
        element.style.color = data.color;
    });
    // ▲ 0.9.1
    document.body.style.backgroundColor = data.backgroundcolor;
    drowTitle();
}

function drowConfigColor() {
    getElement('config-title').value = data.title;
    getElement('config-color').value = data.color;
    getElement('config-backgroundcolor').value = data.backgroundcolor;
    data.colorpalette.forEach(function (value, index) {
        getElement('config-color' + index).value = data.colorpalette[index];
    });
}

// 処理
function initialize() {
    data = load();
    drowConfig();
    drowItemGrid();
    drowIconList();
    drowColorList();
    // ▼ 0.9.2 チュートリアルを追加
    if (data.isFirst) {
        data.isFirst = false;
        getElement('tutorialImg').setAttribute('src', 'img/system/Screen1.png');
        movePanel('Tutorial');
    }
    // ▲ 0.9.2
}

function pushItem(id) {
    if (!data.itemList[id].on) {
        getStyle('main-item' + id).backgroundColor = data.colorpalette[data.itemList[id].color];
    } else {
        getStyle('main-item' + id).backgroundColor = data.colorpalette[0];
    }
    data.itemList[id].on = !data.itemList[id].on;
    data.itemList[id].date = getDate();
    save(data);
}

function deleteItem() {
    var index = Number(getElementByClass('list-itemA').id.slice(9));
    data.itemList.splice(index, 1);
    drowItemList();
}

function upItem() {
    var index = Number(getElementByClass('list-itemA').id.slice(9));
    if (index == 0) return;
    var item = data.itemList[index];
    data.itemList[index] = data.itemList[index - 1];
    data.itemList[index - 1] = item;
    drow('list-item' + (index - 1), drowItemLine(data.itemList[index - 1], index - 1));
    drow('list-item' + index, drowItemLine(data.itemList[index], index));
    select(getElement('list-item' + (index - 1)), 'list-item');
}

function upItem10() {
    for (let i = 0; i < 10; i++) upItem();
}

function downItem() {
    var index = Number(getElementByClass('list-itemA').id.slice(9));
    if (index == data.itemList.length - 1) return;
    var item = data.itemList[index];
    data.itemList[index] = data.itemList[index + 1];
    data.itemList[index + 1] = item;
    drow('list-item' + (index + 1), drowItemLine(data.itemList[index + 1], index + 1));
    drow('list-item' + index, drowItemLine(data.itemList[index], index));
    select(getElement('list-item' + (index + 1)), 'list-item');
}

function downItem10() {
    for (let i = 0; i < 10; i++) downItem();
}

function saveItemList() {
    save(data);
    movePanel('Main');
}

function cancel() {
    data = load();
    movePanel('Main');
}

function saveItem() {
    var name = inputCheck(getElement('edit-name').value);
    var color = getElementByClass('edit-colorA').children[0].getAttribute('alt');
    var image = getElementByClass('edit-iconA').children[0].getAttribute('alt');
    if (panel == 'Add') {
        var item = new Item(name, color, image);
        data.itemList.push(item);
        save(data);
    } else {
        data.itemList[editIndex] = setItem(data.itemList[editIndex], name, color, image);
        drow('list-item' + editIndex, drowItemLine(data.itemList[editIndex], editIndex));
    }
    movePanel();
}

function saveConfig() {
    data.title = inputCheck(getElement('config-title').value);
    data.color = getElement('config-color').value;
    data.backgroundcolor = getElement('config-backgroundcolor').value;
    data.colorpalette.forEach(function (value, index) {
        data.colorpalette[index] = getElement('config-color' + index).value;
    });
    drowConfig();
    drowColorList();
    save(data);
    movePanel('Main');
}

// ▼ 0.9.1 配色初期化
function initColorConfig() {
    var initData = new SaveData();
    data.color = initData.color;
    data.backgroundcolor = initData.backgroundcolor;
    data.colorpalette.forEach(function (value, index) {
        data.colorpalette[index] = initData.colorpalette[index];
    });
    drowConfigColor();
}
// ▲ 0.9.1
// ▼ 0.9.2 チュートリアルを追加
function tutorialImg() {
    var element = getElement('tutorialImg');
    if (element.getAttribute('src') == 'img/system/Screen1.png') {
        element.setAttribute('src', 'img/system/Screen2.png');
    } else if (element.getAttribute('src') == 'img/system/Screen2.png') {
        element.setAttribute('src', 'img/system/Screen3.png');
    } else if (element.getAttribute('src') == 'img/system/Screen3.png') {
        element.setAttribute('src', 'img/system/Screen5.png');
    } else if (element.getAttribute('src') == 'img/system/Screen5.png') {
        element.setAttribute('src', 'img/system/Screen8.png');
    } else {
        element.setAttribute('src', 'img/system/Screen0.png');
        save(data);
        movePanel('Main');
    }
}
// ▲ 0.9.2