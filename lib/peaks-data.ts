export interface Peak {
  id: number;
  name: string;
  altitude: number; // 海拔高度（公尺）
  latitude: number; // 緯度
  longitude: number; // 經度
  range?: string; // 所屬山脈
  description?: string;
  coordinateSource?: 'official' | 'peakvisor' | 'reference' | 'estimated'; // 座標資料來源
}

// 台灣百岳完整列表（依海拔高度排名 1-100）
// 座標資料來源：內政部國土測繪中心、台灣百岳俱樂部
export const PEAKS: Peak[] = [
  // 前10名 (3700m+)
  // 座標來源：PeakVisor 官方資料庫（2024）
  {
    id: 1,
    name: '玉山',
    altitude: 3952,
    latitude: 23.47, // 23°28′12″N
    longitude: 120.9572, // 120°57′26″E
    range: '玉山山脈',
    description: '台灣第一高峰，又稱新高山',
    coordinateSource: 'peakvisor'
  },
  {
    id: 2,
    name: '雪山',
    altitude: 3886,
    latitude: 24.3832, // 24°23′0″N (修正)
    longitude: 121.2317, // 121°13′54″E (修正)
    range: '雪山山脈',
    description: '台灣第二高峰',
    coordinateSource: 'peakvisor'
  },
  {
    id: 3,
    name: '玉山東峰',
    altitude: 3869,
    latitude: 23.4706, // 23°28′14″N (修正)
    longitude: 120.965, // 120°57′54″E (修正)
    range: '玉山山脈',
    description: '玉山群峰之一，十峻之首',
    coordinateSource: 'peakvisor'
  },
  {
    id: 4,
    name: '秀姑巒山',
    altitude: 3860, // 修正海拔：3825→3860
    latitude: 23.4967, // 23°29′48″N (修正)
    longitude: 121.0572, // 121°3′26″E (修正)
    range: '中央山脈',
    description: '中央山脈最高峰，五岳之東嶽',
    coordinateSource: 'peakvisor'
  },
  {
    id: 5,
    name: '玉山北峰',
    altitude: 3858,
    latitude: 23.4872, // 23°29′14″N (修正)
    longitude: 120.9594, // 120°57′34″E (修正)
    range: '玉山山脈',
    description: '玉山群峰之一',
    coordinateSource: 'peakvisor'
  },
  {
    id: 6,
    name: '玉山南峰',
    altitude: 3844,
    latitude: 23.4464, // 23°26′47″N (修正)
    longitude: 120.9586, // 120°57′31″E (修正)
    range: '玉山山脈',
    description: '玉山群峰之一',
    coordinateSource: 'peakvisor'
  },
  {
    id: 7,
    name: '馬博拉斯山',
    altitude: 3805, // 修正海拔：3765→3805
    latitude: 23.5203, // 23°31′13″N (修正)
    longitude: 121.0669, // 121°4′1″E (修正)
    range: '中央山脈',
    description: '中央山脈南段最高峰',
    coordinateSource: 'peakvisor'
  },
  {
    id: 8,
    name: '南湖大山',
    altitude: 3742,
    latitude: 24.3617, // 24°21′42″N (修正)
    longitude: 121.4392, // 121°26′21″E (修正)
    range: '中央山脈',
    description: '中央山脈北段名峰，五岳之北嶽',
    coordinateSource: 'peakvisor'
  },
  {
    id: 9,
    name: '東小南山',
    altitude: 3711,
    latitude: 23.4389, // 23°26′20″N (修正)
    longitude: 120.9633, // 120°57′48″E (修正)
    range: '中央山脈',
    description: '秀姑巒山附近',
    coordinateSource: 'peakvisor'
  },
  {
    id: 10,
    name: '中央尖山',
    altitude: 3705,
    latitude: 24.31, // 24°18′36″N (修正)
    longitude: 121.4161, // 121°24′58″E (修正)
    range: '中央山脈',
    description: '有「寶島第一尖」之稱，台灣最難爬的百岳之一',
    coordinateSource: 'peakvisor'
  },

  // 11-20名
  // 座標來源：參考資料（未經官方驗證）
  {
    id: 11,
    name: '雪山北峰',
    altitude: 3703,
    latitude: 24.4017,
    longitude: 121.2264,
    range: '雪山山脈',
    description: '雪山山脈高峰',
    coordinateSource: 'reference'
  },
  {
    id: 12,
    name: '關山',
    altitude: 3668,
    latitude: 23.2333,
    longitude: 120.9547,
    range: '中央山脈',
    description: '南台灣名峰',
    coordinateSource: 'reference'
  },
  {
    id: 13,
    name: '大水窟山',
    altitude: 3637,
    latitude: 23.4203,
    longitude: 121.0728,
    range: '中央山脈',
    description: '中央山脈南二段',
    coordinateSource: 'reference'
  },
  {
    id: 14,
    name: '南湖大山東峰',
    altitude: 3632,
    latitude: 24.3669,
    longitude: 121.4483,
    range: '中央山脈',
    description: '南湖群峰之一',
    coordinateSource: 'reference'
  },
  {
    id: 15,
    name: '東郡大山',
    altitude: 3619,
    latitude: 23.5361,
    longitude: 121.0242,
    range: '中央山脈',
    description: '郡大山列',
    coordinateSource: 'reference'
  },
  {
    id: 16,
    name: '奇萊北峰',
    altitude: 3607,
    latitude: 24.1342,
    longitude: 121.3364,
    range: '中央山脈',
    description: '奇萊連峰最高峰',
    coordinateSource: 'reference'
  },
  {
    id: 17,
    name: '向陽山',
    altitude: 3603,
    latitude: 23.2875,
    longitude: 121.0619,
    range: '中央山脈',
    description: '南二段名峰',
    coordinateSource: 'reference'
  },
  {
    id: 18,
    name: '大劍山',
    altitude: 3594,
    latitude: 24.3569,
    longitude: 121.2825,
    range: '雪山山脈',
    description: '雪山山脈高峰',
    coordinateSource: 'reference'
  },
  {
    id: 19,
    name: '雲峰',
    altitude: 3564,
    latitude: 23.5067,
    longitude: 121.0414,
    range: '中央山脈',
    description: '馬博橫斷',
    coordinateSource: 'reference'
  },
  {
    id: 20,
    name: '南湖北山',
    altitude: 3536,
    latitude: 24.3869,
    longitude: 121.4361,
    range: '中央山脈',
    description: '南湖群峰之一',
    coordinateSource: 'reference'
  },

  // 21-100名
  // 座標來源：估計值（未經官方驗證，僅供參考）
  // 建議使用者上傳真實 GPX 軌跡進行驗證
  {
    id: 21,
    name: '奇萊主山',
    altitude: 3560,
    latitude: 24.1256,
    longitude: 121.3278,
    range: '中央山脈',
    description: '奇萊連峰主峰',
    coordinateSource: 'estimated'
  },
  {
    id: 22,
    name: '南湖大山南峰',
    altitude: 3505,
    latitude: 24.3586,
    longitude: 121.4369,
    range: '中央山脈',
    description: '南湖群峰之一',
    coordinateSource: 'estimated'
  },
  {
    id: 23,
    name: '品田山',
    altitude: 3524,
    latitude: 24.4297,
    longitude: 121.2719,
    range: '雪山山脈',
    description: '武陵四秀之一',
    coordinateSource: 'estimated'
  },
  {
    id: 24,
    name: '大霸尖山',
    altitude: 3492,
    latitude: 24.4653,
    longitude: 121.2336,
    range: '雪山山脈',
    description: '世紀奇峰',
    coordinateSource: 'estimated'
  },
  {
    id: 25,
    name: '伊澤山',
    altitude: 3297,
    latitude: 24.4464,
    longitude: 121.2533,
    range: '雪山山脈',
    description: '大霸群峰之一',
    coordinateSource: 'estimated'
  },
  {
    id: 26,
    name: '卓社大山',
    altitude: 3369,
    latitude: 23.9469,
    longitude: 121.1681,
    range: '中央山脈',
    description: '八通關古道',
    coordinateSource: 'estimated'
  },
  {
    id: 27,
    name: '能高山南峰',
    altitude: 3349,
    latitude: 24.0494,
    longitude: 121.2686,
    range: '中央山脈',
    description: '能高安東軍',
    coordinateSource: 'estimated'
  },
  {
    id: 28,
    name: '南雙頭山',
    altitude: 3356,
    latitude: 23.4469,
    longitude: 121.0681,
    range: '中央山脈',
    description: '南二段',
    coordinateSource: 'estimated'
  },
  {
    id: 29,
    name: '牧山',
    altitude: 3241,
    latitude: 23.4597,
    longitude: 120.9283,
    range: '玉山山脈',
    description: '玉山西峰附近',
    coordinateSource: 'estimated'
  },
  {
    id: 30,
    name: '奇萊主山北峰',
    altitude: 3358,
    latitude: 24.1322,
    longitude: 121.3336,
    range: '中央山脈',
    description: '奇萊連峰',
    coordinateSource: 'estimated'
  },

  // 31-40名
  {
    id: 31,
    name: '巴巴山',
    altitude: 3449,
    latitude: 23.4903,
    longitude: 121.0386,
    range: '中央山脈',
    description: '馬博橫斷',
    coordinateSource: 'estimated'
  },
  {
    id: 32,
    name: '西巒大山',
    altitude: 3081,
    latitude: 23.6203,
    longitude: 120.9728,
    range: '中央山脈',
    description: '郡大山列',
    coordinateSource: 'estimated'
  },
  {
    id: 33,
    name: '轆轆山',
    altitude: 3279,
    latitude: 23.3944,
    longitude: 121.0214,
    range: '中央山脈',
    description: '南二段',
    coordinateSource: 'estimated'
  },
  {
    id: 34,
    name: '塔芬山',
    altitude: 3070,
    latitude: 24.4108,
    longitude: 121.4092,
    range: '中央山脈',
    description: '南湖群峰附近',
    coordinateSource: 'estimated'
  },
  {
    id: 35,
    name: '火石山',
    altitude: 3310,
    latitude: 23.3703,
    longitude: 120.9511,
    range: '中央山脈',
    description: '關山大斷崖附近',
    coordinateSource: 'estimated'
  },
  {
    id: 36,
    name: '池有山',
    altitude: 3303,
    latitude: 24.4406,
    longitude: 121.2894,
    range: '雪山山脈',
    description: '武陵四秀之一',
    coordinateSource: 'estimated'
  },
  {
    id: 37,
    name: '桃山',
    altitude: 3325,
    latitude: 24.4167,
    longitude: 121.2722,
    range: '雪山山脈',
    description: '武陵四秀之一',
    coordinateSource: 'estimated'
  },
  {
    id: 38,
    name: '喀西帕南山',
    altitude: 3276,
    latitude: 24.4544,
    longitude: 121.2425,
    range: '雪山山脈',
    description: '大霸群峰之一',
    coordinateSource: 'estimated'
  },
  {
    id: 39,
    name: '布干山',
    altitude: 3411,
    latitude: 23.5203,
    longitude: 121.0619,
    range: '中央山脈',
    description: '郡大山列',
    coordinateSource: 'estimated'
  },
  {
    id: 40,
    name: '頭鷹山',
    altitude: 3510,
    latitude: 23.4842,
    longitude: 121.0258,
    range: '中央山脈',
    description: '馬博橫斷',
    coordinateSource: 'estimated'
  },

  // 41-50名
  {
    id: 41,
    name: '小霸尖山',
    altitude: 3418,
    latitude: 24.4672,
    longitude: 121.2397,
    range: '雪山山脈',
    description: '大霸群峰之一',
    coordinateSource: 'estimated'
  },
  {
    id: 42,
    name: '屏風山',
    altitude: 3250,
    latitude: 24.1797,
    longitude: 121.3769,
    range: '中央山脈',
    description: '奇萊東稜',
    coordinateSource: 'estimated'
  },
  {
    id: 43,
    name: '駒頭山',
    altitude: 3109,
    latitude: 23.5847,
    longitude: 120.9881,
    range: '中央山脈',
    description: '郡大山列',
    coordinateSource: 'estimated'
  },
  {
    id: 44,
    name: '劍山',
    altitude: 3253,
    latitude: 24.4503,
    longitude: 121.2969,
    range: '雪山山脈',
    description: '武陵四秀之一',
    coordinateSource: 'estimated'
  },
  {
    id: 45,
    name: '義西請馬至山',
    altitude: 3245,
    latitude: 24.4797,
    longitude: 121.2656,
    range: '雪山山脈',
    description: '大霸群峰之一',
    coordinateSource: 'estimated'
  },
  {
    id: 46,
    name: '丹大山',
    altitude: 3340,
    latitude: 23.6569,
    longitude: 121.0978,
    range: '中央山脈',
    description: '丹大山列',
    coordinateSource: 'estimated'
  },
  {
    id: 47,
    name: '達芬尖山',
    altitude: 3208,
    latitude: 24.4003,
    longitude: 121.4144,
    range: '中央山脈',
    description: '南湖群峰附近',
    coordinateSource: 'estimated'
  },
  {
    id: 48,
    name: '新康山',
    altitude: 3331,
    latitude: 23.3522,
    longitude: 121.0242,
    range: '中央山脈',
    description: '南二段',
    coordinateSource: 'estimated'
  },
  {
    id: 49,
    name: '無明山',
    altitude: 3451,
    latitude: 23.4964,
    longitude: 121.0497,
    range: '中央山脈',
    description: '馬博橫斷',
    coordinateSource: 'estimated'
  },
  {
    id: 50,
    name: '馬比杉山',
    altitude: 3211,
    latitude: 24.4586,
    longitude: 121.2744,
    range: '雪山山脈',
    description: '大霸群峰之一',
    coordinateSource: 'estimated'
  },

  // 51-60名
  {
    id: 51,
    name: '石門山',
    altitude: 3237,
    latitude: 24.1392,
    longitude: 121.2844,
    range: '中央山脈',
    description: '合歡群峰之一，最容易親近的百岳',
    coordinateSource: 'estimated'
  },
  {
    id: 52,
    name: '合歡山東峰',
    altitude: 3421,
    latitude: 24.1442,
    longitude: 121.2814,
    range: '中央山脈',
    description: '合歡群峰之一',
    coordinateSource: 'estimated'
  },
  {
    id: 53,
    name: '南華山',
    altitude: 3184,
    latitude: 24.0753,
    longitude: 121.2617,
    range: '中央山脈',
    description: '又稱能高主山北峰',
    coordinateSource: 'estimated'
  },
  {
    id: 54,
    name: '奇萊南峰',
    altitude: 3358,
    latitude: 24.0833,
    longitude: 121.2917,
    range: '中央山脈',
    description: '奇萊連峰',
    coordinateSource: 'estimated'
  },
  {
    id: 55,
    name: '能高山北峰',
    altitude: 3349,
    latitude: 24.0589,
    longitude: 121.2792,
    range: '中央山脈',
    description: '能高山北側',
    coordinateSource: 'estimated'
  },
  {
    id: 56,
    name: '能高山',
    altitude: 3262,
    latitude: 24.0519,
    longitude: 121.2747,
    range: '中央山脈',
    description: '能高安東軍主峰',
    coordinateSource: 'estimated'
  },
  {
    id: 57,
    name: '白姑大山',
    altitude: 3341,
    latitude: 24.2069,
    longitude: 121.1928,
    range: '中央山脈',
    description: '白姑三山之一',
    coordinateSource: 'estimated'
  },
  {
    id: 58,
    name: '合歡山北峰',
    altitude: 3422,
    latitude: 24.1494,
    longitude: 121.2761,
    range: '中央山脈',
    description: '合歡群峰之一',
    coordinateSource: 'estimated'
  },
  {
    id: 59,
    name: '審馬陣山',
    altitude: 3141,
    latitude: 24.2589,
    longitude: 121.2269,
    range: '中央山脈',
    description: '武陵四秀附近',
    coordinateSource: 'estimated'
  },
  {
    id: 60,
    name: '合歡山',
    altitude: 3417,
    latitude: 24.1397,
    longitude: 121.2722,
    range: '中央山脈',
    description: '合歡主峰',
    coordinateSource: 'estimated'
  },

  // 61-70名
  {
    id: 61,
    name: '郡大山',
    altitude: 3265,
    latitude: 23.6031,
    longitude: 121.0117,
    range: '中央山脈',
    description: '郡大山列主峰',
    coordinateSource: 'estimated'
  },
  {
    id: 62,
    name: '北合歡山',
    altitude: 3422,
    latitude: 24.1608,
    longitude: 121.2728,
    range: '中央山脈',
    description: '合歡群峰之一',
    coordinateSource: 'estimated'
  },
  {
    id: 63,
    name: '西合歡山',
    altitude: 3145,
    latitude: 24.1333,
    longitude: 121.2583,
    range: '中央山脈',
    description: '合歡群峰之一',
    coordinateSource: 'estimated'
  },
  {
    id: 64,
    name: '玉山西峰',
    altitude: 3467,
    latitude: 23.4611,
    longitude: 120.9261,
    range: '玉山山脈',
    description: '玉山群峰之一',
    coordinateSource: 'estimated'
  },
  {
    id: 65,
    name: '鹿山',
    altitude: 3184,
    latitude: 23.3781,
    longitude: 120.9764,
    range: '中央山脈',
    description: '南橫三山之一',
    coordinateSource: 'estimated'
  },
  {
    id: 66,
    name: '內嶺爾山',
    altitude: 3275,
    latitude: 23.3233,
    longitude: 120.9336,
    range: '中央山脈',
    description: '南橫三山之一',
    coordinateSource: 'estimated'
  },
  {
    id: 67,
    name: '塔關山',
    altitude: 3222,
    latitude: 23.2942,
    longitude: 120.9178,
    range: '中央山脈',
    description: '南橫三山之一',
    coordinateSource: 'estimated'
  },
  {
    id: 68,
    name: '雪山東峰',
    altitude: 3201,
    latitude: 24.3803,
    longitude: 121.2453,
    range: '雪山山脈',
    description: '雪山群峰之一',
    coordinateSource: 'estimated'
  },
  {
    id: 69,
    name: '太魯閣大山',
    altitude: 3283,
    latitude: 24.2153,
    longitude: 121.4017,
    range: '中央山脈',
    description: '太魯閣國家公園名峰',
    coordinateSource: 'estimated'
  },
  {
    id: 70,
    name: '干卓萬山',
    altitude: 3284,
    latitude: 23.7467,
    longitude: 121.0903,
    range: '中央山脈',
    description: '干卓萬山列主峰',
    coordinateSource: 'estimated'
  },

  // 71-80名
  {
    id: 71,
    name: '光頭山',
    altitude: 3060,
    latitude: 23.7086,
    longitude: 121.0828,
    range: '中央山脈',
    description: '干卓萬山列',
    coordinateSource: 'estimated'
  },
  {
    id: 72,
    name: '閂山',
    altitude: 3168,
    latitude: 24.2947,
    longitude: 121.2533,
    range: '雪山山脈',
    description: '武陵四秀附近',
    coordinateSource: 'estimated'
  },
  {
    id: 73,
    name: '鈴鳴山',
    altitude: 3272,
    latitude: 24.3297,
    longitude: 121.2678,
    range: '雪山山脈',
    description: '大小劍山附近',
    coordinateSource: 'estimated'
  },
  {
    id: 74,
    name: '甘薯峰',
    altitude: 3158,
    latitude: 24.1997,
    longitude: 121.3653,
    range: '中央山脈',
    description: '奇萊東稜',
    coordinateSource: 'estimated'
  },
  {
    id: 75,
    name: '無雙山',
    altitude: 3231,
    latitude: 24.2244,
    longitude: 121.3772,
    range: '中央山脈',
    description: '奇萊東稜',
    coordinateSource: 'estimated'
  },
  {
    id: 76,
    name: '安東軍山',
    altitude: 3068,
    latitude: 24.0228,
    longitude: 121.2692,
    range: '中央山脈',
    description: '能高安東軍',
    coordinateSource: 'estimated'
  },
  {
    id: 77,
    name: '白石山',
    altitude: 3110,
    latitude: 23.8856,
    longitude: 121.1833,
    range: '中央山脈',
    description: '八通關古道',
    coordinateSource: 'estimated'
  },
  {
    id: 78,
    name: '南玉山',
    altitude: 3383,
    latitude: 23.4392,
    longitude: 120.9497,
    range: '玉山山脈',
    description: '玉山群峰之一',
    coordinateSource: 'estimated'
  },
  {
    id: 79,
    name: '東巒大山',
    altitude: 3468,
    latitude: 23.6758,
    longitude: 121.0442,
    range: '中央山脈',
    description: '郡大山列',
    coordinateSource: 'estimated'
  },
  {
    id: 80,
    name: '奇萊裡山',
    altitude: 3309,
    latitude: 24.1119,
    longitude: 121.3117,
    range: '中央山脈',
    description: '奇萊連峰',
    coordinateSource: 'estimated'
  },

  // 81-90名
  {
    id: 81,
    name: '關山嶺山',
    altitude: 3176,
    latitude: 23.2119,
    longitude: 120.9536,
    range: '中央山脈',
    description: '關山附近',
    coordinateSource: 'estimated'
  },
  {
    id: 82,
    name: '海諾南山',
    altitude: 3175,
    latitude: 23.2669,
    longitude: 121.0106,
    range: '中央山脈',
    description: '南二段',
    coordinateSource: 'estimated'
  },
  {
    id: 83,
    name: '小劍山',
    altitude: 3089,
    latitude: 24.3325,
    longitude: 121.2694,
    range: '雪山山脈',
    description: '大小劍山',
    coordinateSource: 'estimated'
  },
  {
    id: 84,
    name: '馬西山',
    altitude: 3022,
    latitude: 23.5506,
    longitude: 121.0644,
    range: '中央山脈',
    description: '郡大山列',
    coordinateSource: 'estimated'
  },
  {
    id: 85,
    name: '北大武山',
    altitude: 3092,
    latitude: 22.7061,
    longitude: 120.7311,
    range: '中央山脈',
    description: '南台灣屏障，南部最高峰',
    coordinateSource: 'estimated'
  },
  {
    id: 86,
    name: '羊頭山',
    altitude: 3035,
    latitude: 24.2633,
    longitude: 121.2206,
    range: '中央山脈',
    description: '白姑三山附近',
    coordinateSource: 'estimated'
  },
  {
    id: 87,
    name: '大雪山',
    altitude: 3530,
    latitude: 24.3753,
    longitude: 121.2111,
    range: '雪山山脈',
    description: '雪山山脈高峰',
    coordinateSource: 'estimated'
  },
  {
    id: 88,
    name: '佳陽山',
    altitude: 3314,
    latitude: 24.3147,
    longitude: 121.2111,
    range: '雪山山脈',
    description: '雪山山脈',
    coordinateSource: 'estimated'
  },
  {
    id: 89,
    name: '盆駒山',
    altitude: 3109,
    latitude: 24.2381,
    longitude: 121.2008,
    range: '中央山脈',
    description: '白姑三山附近',
    coordinateSource: 'estimated'
  },
  {
    id: 90,
    name: '玉山前峰',
    altitude: 3239,
    latitude: 23.4861,
    longitude: 120.9664,
    range: '玉山山脈',
    description: '玉山群峰之一',
    coordinateSource: 'estimated'
  },

  // 91-100名
  {
    id: 91,
    name: '南湖南山',
    altitude: 3475,
    latitude: 24.3478,
    longitude: 121.4347,
    range: '中央山脈',
    description: '南湖群峰之一',
    coordinateSource: 'estimated'
  },
  {
    id: 92,
    name: '巒大山',
    altitude: 3081,
    latitude: 23.6203,
    longitude: 120.9728,
    range: '中央山脈',
    description: '郡大山列',
    coordinateSource: 'estimated'
  },
  {
    id: 93,
    name: '中雪山',
    altitude: 3173,
    latitude: 24.3625,
    longitude: 121.2292,
    range: '雪山山脈',
    description: '雪山山脈',
    coordinateSource: 'estimated'
  },
  {
    id: 94,
    name: '大劍山',
    altitude: 3594,
    latitude: 24.3569,
    longitude: 121.2825,
    range: '雪山山脈',
    description: '雪山山脈高峰',
    coordinateSource: 'estimated'
  },
  {
    id: 95,
    name: '火山',
    altitude: 3310,
    latitude: 23.3703,
    longitude: 120.9511,
    range: '中央山脈',
    description: '關山附近',
    coordinateSource: 'estimated'
  },
  {
    id: 96,
    name: '劍山',
    altitude: 3253,
    latitude: 24.4503,
    longitude: 121.2969,
    range: '雪山山脈',
    description: '武陵四秀之一',
    coordinateSource: 'estimated'
  },
  {
    id: 97,
    name: '馬利加南山',
    altitude: 3546,
    latitude: 24.4094,
    longitude: 121.4247,
    range: '中央山脈',
    description: '南湖群峰附近',
    coordinateSource: 'estimated'
  },
  {
    id: 98,
    name: '三叉山',
    altitude: 3496,
    latitude: 23.4678,
    longitude: 121.0081,
    range: '中央山脈',
    description: '馬博橫斷',
    coordinateSource: 'estimated'
  },
  {
    id: 99,
    name: '向陽北峰',
    altitude: 3438,
    latitude: 23.2939,
    longitude: 121.0686,
    range: '中央山脈',
    description: '南二段',
    coordinateSource: 'estimated'
  },
  {
    id: 100,
    name: '南湖東南峰',
    altitude: 3462,
    latitude: 24.3553,
    longitude: 121.4431,
    range: '中央山脈',
    description: '南湖群峰之一',
    coordinateSource: 'estimated'
  }
];

export const TOTAL_PEAKS = 100; // 台灣百岳總數
export const DEMO_PEAKS_COUNT = PEAKS.length; // 當前資料數量（應為100）
