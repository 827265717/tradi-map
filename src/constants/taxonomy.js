export const TYPES = ['曲艺·戏曲', '节庆·花会', '信仰·仪式', '工艺·作坊', '游艺·队列']

export const ARCHETYPES = [
  '串珠回路 Beaded Loop',
  '段落遊游 Parade',
  '多点触发 Immersive',
]

export const ARCHETYPE_TYPES = {
  '串珠回路 Beaded Loop': ['曲艺·戏曲', '工艺·作坊'],
  '段落遊游 Parade':      ['节庆·花会', '游艺·队列'],
  '多点触发 Immersive':   ['信仰·仪式'],
}

export const FESTIVALS = [
  '腊八', '上元', '二月二', '清明', '端午',
  '七夕', '中元', '中秋', '重阳', '冬至',
]

export const FESTIVAL_MONTHS = {
  '腊八':   [1],
  '上元':   [2],
  '二月二': [3],
  '清明':   [4],
  '端午':   [5, 6],
  '七夕':   [7],
  '中元':   [8],
  '中秋':   [9],
  '重阳':   [10, 11],
  '冬至':   [12],
}

export const TYPE_COLORS = {
  '曲艺·戏曲': '#d95a5a',
  '节庆·花会': '#e8962e',
  '信仰·仪式': '#7c5cbf',
  '工艺·作坊': '#2ea87a',
  '游艺·队列': '#3a82d4',
}
