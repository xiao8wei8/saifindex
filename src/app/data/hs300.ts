const data = [
    {id:"688981",name:"中芯国际",value:4.807,colorValue:300},
    {id:"688599",name:"天合光能",value:3.252,colorValue:299},
    {id:"688396",name:"华润微",value:3.015,colorValue:298},
    {id:"688363",name:"华熙生物",value:2.316,colorValue:297},
    {id:"688303",name:"大全能源",value:1.747,colorValue:296},
    {id:"688271",name:"联影医疗",value:1.69,colorValue:295},
    {id:"688256",name:"寒武纪",value:1.467,colorValue:294},
    {id:"688223",name:"晶科能源",value:1.428,colorValue:293},
    {id:"688187",name:"时代电气",value:1.388,colorValue:292},
    {id:"688126",name:"沪硅产业",value:1.375,colorValue:291},
    {id:"688111",name:"金山办公",value:1.332,colorValue:290},
    {id:"688082",name:"盛美上海",value:1.33,colorValue:289},
    {id:"688041",name:"海光信息",value:1.063,colorValue:288},
    {id:"688036",name:"传音控股",value:1.061,colorValue:287},
    {id:"688012",name:"中微公司",value:1.042,colorValue:286},
    {id:"688009",name:"中国通号",value:0.982,colorValue:285},
    {id:"688008",name:"澜起科技",value:0.979,colorValue:284},
    {id:"605499",name:"东鹏饮料",value:0.89,colorValue:283},
    {id:"605117",name:"德业股份",value:0.865,colorValue:282},
    {id:"603993",name:"洛阳钼业",value:0.859,colorValue:281},
    {id:"603986",name:"兆易创新",value:0.81,colorValue:280},
    {id:"603899",name:"晨光股份",value:0.756,colorValue:279},
    {id:"603833",name:"欧派家居",value:0.71,colorValue:278},
    {id:"603806",name:"福斯特",value:0.668,colorValue:277},
    {id:"603799",name:"华友钴业",value:0.662,colorValue:276},
    {id:"603659",name:"璞泰来",value:0.659,colorValue:275},
    {id:"603501",name:"韦尔股份",value:0.658,colorValue:274},
    {id:"603392",name:"万泰生物",value:0.648,colorValue:273},
    {id:"603369",name:"今世缘",value:0.643,colorValue:272},
    {id:"603296",name:"华勤技术",value:0.631,colorValue:271},
    {id:"603288",name:"海天味业",value:0.628,colorValue:270},
    {id:"603260",name:"合盛硅业",value:0.625,colorValue:269},
    {id:"603259",name:"药明康德",value:0.6,colorValue:268},
    {id:"603195",name:"公牛集团",value:0.598,colorValue:267},
    {id:"603019",name:"中科曙光",value:0.597,colorValue:266},
    {id:"601998",name:"中信银行",value:0.579,colorValue:265},
    {id:"601995",name:"中金公司",value:0.57,colorValue:264},
    {id:"601989",name:"中国重工",value:0.563,colorValue:263},
    {id:"601988",name:"中国银行",value:0.554,colorValue:262},
    {id:"601985",name:"中国核电",value:0.553,colorValue:261},
    {id:"601939",name:"建设银行",value:0.548,colorValue:260},
    {id:"601919",name:"中远海控",value:0.543,colorValue:259},
    {id:"601916",name:"浙商银行",value:0.522,colorValue:258},
    {id:"601901",name:"方正证券",value:0.52,colorValue:257},
    {id:"601899",name:"紫金矿业",value:0.509,colorValue:256},
    {id:"601898",name:"中煤能源",value:0.507,colorValue:255},
    {id:"601888",name:"中国中免",value:0.5,colorValue:254},
    {id:"601881",name:"中国银河",value:0.499,colorValue:253},
    {id:"601878",name:"浙商证券",value:0.497,colorValue:252},
    {id:"601877",name:"正泰电器",value:0.495,colorValue:251},
    {id:"601872",name:"招商轮船",value:0.491,colorValue:250},
    {id:"601868",name:"中国能建",value:0.488,colorValue:249},
    {id:"601857",name:"中国石油",value:0.483,colorValue:247},
    {id:"601865",name:"福莱特",value:0.483,colorValue:248},
    {id:"601838",name:"成都银行",value:0.479,colorValue:246},
    {id:"601818",name:"光大银行",value:0.477,colorValue:245},
    {id:"601816",name:"京沪高铁",value:0.476,colorValue:244},
    {id:"601808",name:"中海油服",value:0.473,colorValue:243},
    {id:"601800",name:"中国交建",value:0.466,colorValue:242},
    {id:"601799",name:"星宇股份",value:0.464,colorValue:241},
    {id:"601788",name:"光大证券",value:0.46,colorValue:240},
    {id:"601766",name:"中国中车",value:0.458,colorValue:239},
    {id:"601728",name:"中国电信",value:0.457,colorValue:238},
    {id:"601698",name:"中国卫通",value:0.452,colorValue:236},
    {id:"601699",name:"潞安环能",value:0.452,colorValue:237},
    {id:"601689",name:"拓普集团",value:0.449,colorValue:235},
    {id:"601688",name:"华泰证券",value:0.427,colorValue:234},
    {id:"601669",name:"中国电建",value:0.426,colorValue:233},
    {id:"601668",name:"中国建筑",value:0.422,colorValue:232},
    {id:"601658",name:"邮储银行",value:0.419,colorValue:231},
    {id:"601633",name:"长城汽车",value:0.418,colorValue:230},
    {id:"601628",name:"中国人寿",value:0.416,colorValue:229},
    {id:"601618",name:"中国中冶",value:0.412,colorValue:228},
    {id:"601607",name:"上海医药",value:0.403,colorValue:227},
    {id:"601601",name:"中国太保",value:0.389,colorValue:226},
    {id:"601600",name:"中国铝业",value:0.386,colorValue:225},
    {id:"601398",name:"工商银行",value:0.366,colorValue:224},
    {id:"601390",name:"中国中铁",value:0.365,colorValue:223},
    {id:"601377",name:"兴业证券",value:0.363,colorValue:222},
    {id:"601360",name:"三六零",value:0.358,colorValue:221},
    {id:"601336",name:"新华保险",value:0.357,colorValue:220},
    {id:"601328",name:"交通银行",value:0.354,colorValue:219},
    {id:"601319",name:"中国人保",value:0.35,colorValue:218},
    {id:"601318",name:"中国平安",value:0.341,colorValue:217},
    {id:"601288",name:"农业银行",value:0.339,colorValue:216},
    {id:"601238",name:"广汽集团",value:0.332,colorValue:215},
    {id:"601229",name:"上海银行",value:0.33,colorValue:213},
    {id:"601236",name:"红塔证券",value:0.33,colorValue:214},
    {id:"601225",name:"陕西煤业",value:0.322,colorValue:212},
    {id:"601211",name:"国泰君安",value:0.321,colorValue:211},
    {id:"601186",name:"中国铁建",value:0.316,colorValue:210},
    {id:"601169",name:"北京银行",value:0.313,colorValue:209},
    {id:"601166",name:"兴业银行",value:0.303,colorValue:208},
    {id:"601117",name:"中国化学",value:0.301,colorValue:206},
    {id:"601138",name:"工业富联",value:0.301,colorValue:207},
    {id:"601100",name:"恒立液压",value:0.299,colorValue:204},
    {id:"601111",name:"中国国航",value:0.299,colorValue:205},
    {id:"601088",name:"中国神华",value:0.298,colorValue:203},
    {id:"601066",name:"中信建投",value:0.29,colorValue:202},
    {id:"601059",name:"信达证券",value:0.289,colorValue:201},
    {id:"601012",name:"隆基绿能",value:0.286,colorValue:199},
    {id:"601021",name:"春秋航空",value:0.286,colorValue:200},
    {id:"601009",name:"南京银行",value:0.285,colorValue:198},
    {id:"601006",name:"大秦铁路",value:0.284,colorValue:197},
    {id:"600989",name:"宝丰能源",value:0.281,colorValue:195},
    {id:"600999",name:"招商证券",value:0.281,colorValue:196},
    {id:"600958",name:"东方证券",value:0.277,colorValue:194},
    {id:"600938",name:"中国海油",value:0.276,colorValue:192},
    {id:"600941",name:"中国移动",value:0.276,colorValue:193},
    {id:"600926",name:"杭州银行",value:0.272,colorValue:191},
    {id:"600919",name:"江苏银行",value:0.269,colorValue:190},
    {id:"600918",name:"中泰证券",value:0.267,colorValue:189},
    {id:"600905",name:"三峡能源",value:0.266,colorValue:188},
    {id:"600900",name:"长江电力",value:0.256,colorValue:187},
    {id:"600893",name:"航发动力",value:0.255,colorValue:186},
    {id:"600887",name:"伊利股份",value:0.25,colorValue:185},
    {id:"600886",name:"国投电力",value:0.247,colorValue:184},
    {id:"600875",name:"东方电气",value:0.245,colorValue:183},
    {id:"600845",name:"宝信软件",value:0.243,colorValue:182},
    {id:"600809",name:"山西汾酒",value:0.241,colorValue:180},
    {id:"600837",name:"海通证券",value:0.241,colorValue:181},
    {id:"600803",name:"新奥股份",value:0.24,colorValue:179},
    {id:"600795",name:"国电电力",value:0.239,colorValue:178},
    {id:"600760",name:"中航沈飞",value:0.237,colorValue:177},
    {id:"600745",name:"闻泰科技",value:0.228,colorValue:176},
    {id:"600741",name:"华域汽车",value:0.227,colorValue:175},
    {id:"600732",name:"爱旭股份",value:0.226,colorValue:174},
    {id:"600674",name:"川投能源",value:0.225,colorValue:172},
    {id:"600690",name:"海尔智家",value:0.225,colorValue:173},
    {id:"600660",name:"福耀玻璃",value:0.221,colorValue:171},
    {id:"600600",name:"青岛啤酒",value:0.218,colorValue:170},
    {id:"600585",name:"海螺水泥",value:0.216,colorValue:168},
    {id:"600588",name:"用友网络",value:0.216,colorValue:169},
    {id:"600570",name:"恒生电子",value:0.215,colorValue:166},
    {id:"600584",name:"长电科技",value:0.215,colorValue:167},
    {id:"600547",name:"山东黄金",value:0.211,colorValue:165},
    {id:"600519",name:"贵州茅台",value:0.21,colorValue:164},
    {id:"600515",name:"海南机场",value:0.208,colorValue:163},
    {id:"600489",name:"中金黄金",value:0.206,colorValue:162},
    {id:"600438",name:"通威股份",value:0.205,colorValue:160},
    {id:"600460",name:"士兰微",value:0.205,colorValue:161},
    {id:"600436",name:"片仔癀",value:0.204,colorValue:159},
    {id:"600426",name:"华鲁恒升",value:0.202,colorValue:158},
    {id:"600415",name:"小商品城",value:0.201,colorValue:157},
    {id:"600406",name:"国电南瑞",value:0.2,colorValue:156},
    {id:"600372",name:"中航机载",value:0.196,colorValue:155},
    {id:"600362",name:"江西铜业",value:0.194,colorValue:154},
    {id:"600332",name:"白云山",value:0.192,colorValue:152},
    {id:"600346",name:"恒力石化",value:0.192,colorValue:153},
    {id:"600309",name:"万华化学",value:0.191,colorValue:151},
    {id:"600276",name:"恒瑞医药",value:0.19,colorValue:150},
    {id:"600219",name:"南山铝业",value:0.186,colorValue:148},
    {id:"600233",name:"圆通速递",value:0.186,colorValue:149},
    {id:"600188",name:"兖矿能源",value:0.183,colorValue:146},
    {id:"600196",name:"复星医药",value:0.183,colorValue:147},
    {id:"600183",name:"生益科技",value:0.179,colorValue:145},
    {id:"600176",name:"中国巨石",value:0.176,colorValue:144},
    {id:"600161",name:"天坛生物",value:0.175,colorValue:143},
    {id:"600132",name:"重庆啤酒",value:0.173,colorValue:141},
    {id:"600150",name:"中国船舶",value:0.173,colorValue:142},
    {id:"600111",name:"北方稀土",value:0.171,colorValue:139},
    {id:"600115",name:"中国东航",value:0.171,colorValue:140},
    {id:"600085",name:"同仁堂",value:0.17,colorValue:136},
    {id:"600089",name:"特变电工",value:0.17,colorValue:137},
    {id:"600104",name:"上汽集团",value:0.17,colorValue:138},
    {id:"600050",name:"中国联通",value:0.169,colorValue:134},
    {id:"600061",name:"国投资本",value:0.169,colorValue:135},
    {id:"600048",name:"保利发展",value:0.167,colorValue:133},
    {id:"600031",name:"三一重工",value:0.166,colorValue:130},
    {id:"600036",name:"招商银行",value:0.166,colorValue:131},
    {id:"600039",name:"四川路桥",value:0.166,colorValue:132},
    {id:"600030",name:"中信证券",value:0.165,colorValue:129},
    {id:"600029",name:"南方航空",value:0.164,colorValue:128},
    {id:"600026",name:"中远海能",value:0.163,colorValue:125},
    {id:"600027",name:"华电国际",value:0.163,colorValue:126},
    {id:"600028",name:"中国石化",value:0.163,colorValue:127},
    {id:"600025",name:"华能水电",value:0.161,colorValue:124},
    {id:"600019",name:"宝钢股份",value:0.16,colorValue:122},
    {id:"600023",name:"浙能电力",value:0.16,colorValue:123},
    {id:"600018",name:"上港集团",value:0.159,colorValue:121},
    {id:"600011",name:"华能国际",value:0.158,colorValue:118},
    {id:"600015",name:"华夏银行",value:0.158,colorValue:119},
    {id:"600016",name:"民生银行",value:0.158,colorValue:120},
    {id:"600010",name:"包钢股份",value:0.156,colorValue:117},
    {id:"600000",name:"浦发银行",value:0.155,colorValue:115},
    {id:"600009",name:"上海机场",value:0.155,colorValue:116},
    {id:"301269",name:"华大九天",value:0.154,colorValue:114},
    {id:"300999",name:"金龙鱼",value:0.152,colorValue:113},
    {id:"300979",name:"华利集团",value:0.149,colorValue:112},
    {id:"300919",name:"中伟股份",value:0.148,colorValue:110},
    {id:"300957",name:"贝泰妮",value:0.148,colorValue:111},
    {id:"300782",name:"卓胜微",value:0.147,colorValue:107},
    {id:"300832",name:"新产业",value:0.147,colorValue:108},
    {id:"300896",name:"爱美客",value:0.147,colorValue:109},
    {id:"300760",name:"迈瑞医疗",value:0.146,colorValue:106},
    {id:"300751",name:"迈为股份",value:0.145,colorValue:104},
    {id:"300759",name:"康龙化成",value:0.145,colorValue:105},
    {id:"300750",name:"宁德时代",value:0.144,colorValue:103},
    {id:"300661",name:"圣邦股份",value:0.143,colorValue:102},
    {id:"300628",name:"亿联网络",value:0.142,colorValue:101},
    {id:"300498",name:"温氏股份",value:0.14,colorValue:100},
    {id:"300496",name:"中科创达",value:0.139,colorValue:99},
    {id:"300450",name:"先导智能",value:0.138,colorValue:97},
    {id:"300454",name:"深信服",value:0.138,colorValue:98},
    {id:"300442",name:"润泽科技",value:0.137,colorValue:96},
    {id:"300413",name:"芒果超媒",value:0.136,colorValue:93},
    {id:"300418",name:"昆仑万维",value:0.136,colorValue:94},
    {id:"300433",name:"蓝思科技",value:0.136,colorValue:95},
    {id:"300408",name:"三环集团",value:0.135,colorValue:92},
    {id:"300347",name:"泰格医药",value:0.134,colorValue:91},
    {id:"300316",name:"晶盛机电",value:0.131,colorValue:90},
    {id:"300274",name:"阳光电源",value:0.13,colorValue:88},
    {id:"300308",name:"中际旭创",value:0.13,colorValue:89},
    {id:"300223",name:"北京君正",value:0.128,colorValue:87},
    {id:"300142",name:"沃森生物",value:0.127,colorValue:86},
    {id:"300122",name:"智飞生物",value:0.126,colorValue:84},
    {id:"300124",name:"汇川技术",value:0.126,colorValue:85},
    {id:"300059",name:"东方财富",value:0.123,colorValue:83},
    {id:"300015",name:"爱尔眼科",value:0.122,colorValue:81},
    {id:"300033",name:"同花顺",value:0.122,colorValue:82},
    {id:"003816",name:"中国广核",value:0.121,colorValue:79},
    {id:"300014",name:"亿纬锂能",value:0.121,colorValue:80},
    {id:"002812",name:"恩捷股份",value:0.119,colorValue:73},
    {id:"002821",name:"凯莱英",value:0.119,colorValue:74},
    {id:"002841",name:"视源股份",value:0.119,colorValue:75},
    {id:"002916",name:"深南电路",value:0.119,colorValue:76},
    {id:"002920",name:"德赛西威",value:0.119,colorValue:77},
    {id:"002938",name:"鹏鼎控股",value:0.119,colorValue:78},
    {id:"002714",name:"牧原股份",value:0.118,colorValue:71},
    {id:"002736",name:"国信证券",value:0.118,colorValue:72},
    {id:"002648",name:"卫星化学",value:0.117,colorValue:69},
    {id:"002709",name:"天赐材料",value:0.117,colorValue:70},
    {id:"002601",name:"龙佰集团",value:0.116,colorValue:67},
    {id:"002603",name:"以岭药业",value:0.116,colorValue:68},
    {id:"002555",name:"三七互娱",value:0.114,colorValue:65},
    {id:"002594",name:"比亚迪",value:0.114,colorValue:66},
    {id:"002493",name:"荣盛石化",value:0.113,colorValue:64},
    {id:"002466",name:"天齐锂业",value:0.112,colorValue:62},
    {id:"002475",name:"立讯精密",value:0.112,colorValue:63},
    {id:"002459",name:"晶澳科技",value:0.11,colorValue:60},
    {id:"002460",name:"赣锋锂业",value:0.11,colorValue:61},
    {id:"002410",name:"广联达",value:0.109,colorValue:58},
    {id:"002415",name:"海康威视",value:0.109,colorValue:59},
    {id:"002311",name:"海大集团",value:0.108,colorValue:55},
    {id:"002352",name:"顺丰控股",value:0.108,colorValue:56},
    {id:"002371",name:"北方华创",value:0.108,colorValue:57},
    {id:"002304",name:"洋河股份",value:0.107,colorValue:54},
    {id:"002241",name:"歌尔股份",value:0.105,colorValue:51},
    {id:"002252",name:"上海莱士",value:0.105,colorValue:52},
    {id:"002271",name:"东方雨虹",value:0.105,colorValue:53},
    {id:"002236",name:"大华股份",value:0.104,colorValue:50},
    {id:"002230",name:"科大讯飞",value:0.103,colorValue:49},
    {id:"002180",name:"纳思达",value:0.102,colorValue:48},
    {id:"002142",name:"宁波银行",value:0.1,colorValue:46},
    {id:"002179",name:"中航光电",value:0.1,colorValue:47},
    {id:"002074",name:"国轩高科",value:0.099,colorValue:44},
    {id:"002129",name:"TCL中环",value:0.099,colorValue:45},
    {id:"002027",name:"分众传媒",value:0.098,colorValue:41},
    {id:"002049",name:"紫光国微",value:0.098,colorValue:42},
    {id:"002050",name:"三花智控",value:0.098,colorValue:43},
    {id:"002001",name:"新和成",value:0.097,colorValue:39},
    {id:"002007",name:"华兰生物",value:0.097,colorValue:40},
    {id:"001965",name:"招商公路",value:0.095,colorValue:37},
    {id:"001979",name:"招商蛇口",value:0.095,colorValue:38},
    {id:"001289",name:"龙源电力",value:0.094,colorValue:36},
    {id:"000999",name:"华润三九",value:0.092,colorValue:35},
    {id:"000977",name:"浪潮信息",value:0.091,colorValue:33},
    {id:"000983",name:"山西焦煤",value:0.091,colorValue:34},
    {id:"000938",name:"紫光股份",value:0.09,colorValue:31},
    {id:"000963",name:"华东医药",value:0.09,colorValue:32},
    {id:"000895",name:"双汇发展",value:0.089,colorValue:30},
    {id:"000807",name:"云铝股份",value:0.088,colorValue:27},
    {id:"000858",name:"五 粮 液",value:0.088,colorValue:28},
    {id:"000876",name:"新 希 望",value:0.088,colorValue:29},
    {id:"000800",name:"一汽解放",value:0.085,colorValue:26},
    {id:"000776",name:"广发证券",value:0.083,colorValue:23},
    {id:"000786",name:"北新建材",value:0.083,colorValue:24},
    {id:"000792",name:"盐湖股份",value:0.083,colorValue:25},
    {id:"000733",name:"振华科技",value:0.081,colorValue:21},
    {id:"000768",name:"中航西飞",value:0.081,colorValue:22},
    {id:"000725",name:"京东方A",value:0.076,colorValue:20},
    {id:"000708",name:"中信特钢",value:0.075,colorValue:19},
    {id:"000651",name:"格力电器",value:0.071,colorValue:17},
    {id:"000661",name:"长春高新",value:0.071,colorValue:18},
    {id:"000617",name:"中油资本",value:0.07,colorValue:15},
    {id:"000625",name:"长安汽车",value:0.07,colorValue:16},
    {id:"000596",name:"古井贡酒",value:0.064,colorValue:14},
    {id:"000568",name:"泸州老窖",value:0.063,colorValue:13},
    {id:"000538",name:"云南白药",value:0.061,colorValue:12},
    {id:"000425",name:"徐工机械",value:0.06,colorValue:11},
    {id:"000408",name:"藏格矿业",value:0.058,colorValue:10},
    {id:"000333",name:"美的集团",value:0.054,colorValue:8},
    {id:"000338",name:"潍柴动力",value:0.054,colorValue:9},
    {id:"000301",name:"东方盛虹",value:0.051,colorValue:7},
    {id:"000166",name:"申万宏源",value:0.047,colorValue:6},
    {id:"000157",name:"中联重科",value:0.045,colorValue:5},
    {id:"000100",name:"TCL科技",value:0.044,colorValue:4},
    {id:"000063",name:"中兴通讯",value:0.042,colorValue:3},
    {id:"000002",name:"万科A",value:0.026,colorValue:2},
    {id:"000001",name:"平安银行",value:0.014,colorValue:1},
    
    ]
export default data;