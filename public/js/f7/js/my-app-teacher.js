// Initialize your app
var myApp = new Framework7({
    precompileTemplates: true
    //template7Pages: true
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

$$('#submitlesson').on('click', function () {
    //提交数据至服务器
});

//上机登记教师端选择器
var classes = ['2011级1班', '2011级2班', '2011级3班', '2012级1班', '2012级2班', '2012级3班', '2013级1班', '2013级2班', '2013级3班', '2014级1班', '2014级2班', '2014级3班']
var teachers = ['徐明', '杨广生'];
var lesstime = ["08:20 — 09:00", "09:10 — 09:50", "10:15 — 10:55", "11:10 — 11:40", "14:50 — 15:20", "15:35 — 16:15", "16:25 — 17:05"]
var picker1 = myApp.picker({
    input: '#picker-info1',
    container: '#picker-info-container1',
    toolbar: false,
    rotateEffect: true,


    onChange: function (picker, values, displayValues) {
        $$('#classname').val(values[0]);
        $$('#node').val(values[1]);
    },

    formatValue: function (p, values, displayValues) {
        return '班级：' + values[0] + ' 第 ' + values[1] + ' 节 ';
    },

    cols: [
        // 班级
        {
            values: classes,
            //displayValues: ('January February March April May June July August September October November December').split(' '),
            textAlign: 'left'
        },
        // 分隔
        {
            divider: true,
            content: ' 第 '
        },
        // 节次
        {
            values: [1, 2, 3, 4, 5, 6, 7]
        },
        // 分隔
        {
            divider: true,
            content: ' 节 '
        }
    ]
});


var picker2 = myApp.picker({
    input: '#picker-info2',
    container: '#picker-info-container2',
    toolbar: false,
    rotateEffect: true,

    onChange: function (picker, values, displayValues) {
        $$('#time').val(values[0]);
        $$('#teacher').val(values[1]);
    },

    formatValue: function (p, values, displayValues) {
        return ' 时段：' + values[0] + ' 上课教师：' + values[1];
    },

    cols: [
        // 分隔
        {
            divider: true,
            content: ' 时段 '
        },
        // 时段
        {
            values: lesstime,
        },
        // 分隔
        {
            divider: true,
            content: ' 教师 '
        },
        // 教师
        {
            values: teachers,
            textAlign: 'left'
        }
    ]
});        