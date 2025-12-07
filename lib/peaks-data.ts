export interface Peak {
  id: number;
  name: string;
  altitude: number; // 海拔高度（公尺）
  latitude: number; // 緯度
  longitude: number; // 經度
  description?: string;
}

// 台灣百岳資料（前20座作為 Demo）
export const PEAKS: Peak[] = [
  {
    id: 1,
    name: '玉山',
    altitude: 3952,
    latitude: 23.47,
    longitude: 120.957,
    description: '台灣第一高峰'
  },
  {
    id: 2,
    name: '雪山',
    altitude: 3886,
    latitude: 24.3895,
    longitude: 121.2342,
    description: '台灣第二高峰'
  },
  {
    id: 3,
    name: '玉山東峰',
    altitude: 3869,
    latitude: 23.4742,
    longitude: 120.9628,
    description: '玉山群峰之一'
  },
  {
    id: 4,
    name: '玉山北峰',
    altitude: 3858,
    latitude: 23.4836,
    longitude: 120.9553,
    description: '玉山群峰之一'
  },
  {
    id: 5,
    name: '玉山南峰',
    altitude: 3844,
    latitude: 23.4589,
    longitude: 120.9547,
    description: '玉山群峰之一'
  },
  {
    id: 6,
    name: '秀姑巒山',
    altitude: 3825,
    latitude: 23.4561,
    longitude: 121.0192,
    description: '中央山脈最高峰'
  },
  {
    id: 7,
    name: '馬博拉斯山',
    altitude: 3765,
    latitude: 23.5153,
    longitude: 121.0411,
    description: '中央山脈北段最高峰'
  },
  {
    id: 8,
    name: '南湖大山',
    altitude: 3742,
    latitude: 24.3647,
    longitude: 121.4322,
    description: '中央山脈北段名峰'
  },
  {
    id: 9,
    name: '東小南山',
    altitude: 3711,
    latitude: 23.4653,
    longitude: 121.0175,
    description: '中央山脈高峰'
  },
  {
    id: 10,
    name: '中央尖山',
    altitude: 3705,
    latitude: 24.3883,
    longitude: 121.4225,
    description: '有「寶島第一尖」之稱'
  },
  {
    id: 11,
    name: '雪山北峰',
    altitude: 3703,
    latitude: 24.4017,
    longitude: 121.2264,
    description: '雪山山脈高峰'
  },
  {
    id: 12,
    name: '關山',
    altitude: 3668,
    latitude: 23.2333,
    longitude: 120.9547,
    description: '南台灣名峰'
  },
  {
    id: 13,
    name: '大水窟山',
    altitude: 3637,
    latitude: 23.4203,
    longitude: 121.0728,
    description: '中央山脈高峰'
  },
  {
    id: 14,
    name: '南湖大山東峰',
    altitude: 3632,
    latitude: 24.3669,
    longitude: 121.4483,
    description: '南湖群峰之一'
  },
  {
    id: 15,
    name: '東郡大山',
    altitude: 3619,
    latitude: 23.5361,
    longitude: 121.0242,
    description: '中央山脈高峰'
  },
  {
    id: 16,
    name: '奇萊北峰',
    altitude: 3607,
    latitude: 24.1342,
    longitude: 121.3364,
    description: '奇萊連峰最高峰'
  },
  {
    id: 17,
    name: '向陽山',
    altitude: 3603,
    latitude: 23.2875,
    longitude: 121.0619,
    description: '南二段名峰'
  },
  {
    id: 18,
    name: '大劍山',
    altitude: 3594,
    latitude: 24.3569,
    longitude: 121.2825,
    description: '雪山山脈高峰'
  },
  {
    id: 19,
    name: '雲峰',
    altitude: 3564,
    latitude: 23.5067,
    longitude: 121.0414,
    description: '中央山脈高峰'
  },
  {
    id: 20,
    name: '南湖北山',
    altitude: 3536,
    latitude: 24.3869,
    longitude: 121.4361,
    description: '南湖群峰之一'
  }
];

export const TOTAL_PEAKS = 100; // 實際台灣百岳總數
export const DEMO_PEAKS_COUNT = PEAKS.length; // Demo 版本的百岳數量
