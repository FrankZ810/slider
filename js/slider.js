var wrap = document.getElementById("wrap"),
    imgList = document.getElementById("img-list"),
    navList = document.getElementById("nav-list").getElementsByTagName("li"),
    prev = document.getElementById("prev"),
    next = document.getElementById("next"),
    animated = false; // 初始化动画状态为关闭

// *****位移动画*****
function animate(offset) {
    animated = true; // 开启动画状态
    var newLeft = parseInt(imgList.style.left) + offset;
    // 新的left值是当前值（转换整数）加上传入的参数offset的值

    // *****动画函数*****
    var time = 300; // 位移总时间
    var interval = 10; // 位移间隔时间
    var speed = offset / (time / interval); // 每次的位移量等于总位移量除以位移次数

    // 位移的判断（是否位移）的函数封装
    function go() {
        if ((speed < 0 && parseInt(imgList.style.left) > newLeft) || (speed > 0 && parseInt(imgList.style.left) < newLeft)) {
            imgList.style.left = parseInt(imgList.style.left) + speed + "px";
            setTimeout(go, interval); // 10毫秒后运行go函数
            // 如果达到目标值则不会继续调用自身函数，而是进行执行以下步骤：
        } else {
            animated = false; // 关闭动画状态
            imgList.style.left = newLeft + "px";
            // 当前left值就等于新的值加上单位px
            if (newLeft < -4904) {
                imgList.style.left = -1226 + "px";
            }
            // 当新的left值小于-4904，也就是最后一张图往下一张切换时，需要把当前的left值重新设为第一张图片的left值
            if (newLeft > -1226) {
                imgList.style.left = -4904 + "px";
            }
            // 当新的left值大于-1226，也就是第一张图往上一张切换时，需要把当前的left值设为最后一张图片的left值
        }
    }

    go();
}


// *****列表高亮*****
var onIndex = 0; // 初始化高亮的索引值
function showLi() {
    for (var i = 0; i < navList.length; i++) {
        navList[i].className = "";
    } // 遍历列表清空高亮样式
    navList[onIndex].className = "on";
    // 根据索引值添加高亮样式
}


// *****右箭头事件*****
next.onclick = function () {
    if (!animated) {
        if (onIndex == 3) {
            onIndex = 0;
        } else {
            onIndex += 1;
        }
        // 如果索引值等于3（列表最后一项）时，恢复到初始值（列表第一项）
        showLi();
        animate(-1226);
        // 1226是图片宽度，向下一张切换时left值应该减去一张图片的宽度
    }
}
// *****左箭头事件*****
prev.onclick = function () {
    if (!animated) {
        if (onIndex == 0) {
            onIndex = 3;
        } else {
            onIndex -= 1;
        }
        // 如果索引值等于0（列表第一项）时，切换到最大值（列表最后一项）
        showLi();
        animate(1226);
        // 1226是图片宽度，向上一张切换时left值应该加上一张图片的宽度
    }
}


// *****列表点击切换*****
for (var i = 0; i < navList.length; i++) {
    navList[i].newIndex = i; // 取得点击列表的索引值
    navList[i].onclick = function () {
        if (this.className == "on") {
            return;
            // 如果当前列表已经高亮则停止执行此函数
        }
        var offset = -1226 * (this.newIndex - onIndex);
        // 此时位移量等于-1226乘以点击的新索引值减去处于高亮状态的索引值
        onIndex = this.newIndex;
        // 将点击的新索引值赋给高亮状态的索引
        showLi(); // 执行列表高亮
        if (!animated) {
            animate(offset); // 执行位移动画
        }
    }
}


// *****自动播放*****
var timer = null;
function play() {
    timer = setInterval(function () {
        next.onclick();
    }, 3000);
}
play();
function stop() {
    clearInterval(timer);
}
wrap.onmousemove = stop;
wrap.onmouseout = play;