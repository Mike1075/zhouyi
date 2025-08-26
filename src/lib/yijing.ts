// 周易卦象映射表
export const hexagramNames: { [key: string]: string } = {
  '111111': '乾为天',
  '000000': '坤为地',
  '100010': '水雷屯',
  '010001': '山水蒙',
  '111010': '水天需',
  '010111': '天水讼',
  '010000': '地水师',
  '000010': '水地比',
  '111011': '风天小畜',
  '110111': '天泽履',
  '111000': '地天泰',
  '000111': '天地否',
  '101111': '天火同人',
  '111101': '火天大有',
  '001000': '地山谦',
  '000100': '雷地豫',
  '100110': '泽雷随',
  '011001': '山风蛊',
  '110000': '地泽临',
  '000011': '风地观',
  '100101': '火雷噬嗑',
  '101001': '山火贲',
  '000001': '山地剥',
  '100000': '地雷复',
  '100111': '天雷无妄',
  '111001': '山天大畜',
  '100001': '山雷颐',
  '011110': '泽风大过',
  '010010': '坎为水',
  '101101': '离为火',
  '001110': '泽山咸',
  '011100': '雷风恒',
  '001111': '天山遁',
  '111100': '雷天大壮',
  '000101': '火地晋',
  '101000': '地火明夷',
  '101011': '风火家人',
  '110101': '火泽睽',
  '001010': '水山蹇',
  '010100': '雷水解',
  '110001': '山泽损',
  '100011': '风雷益',
  '111110': '泽天夬',
  '011111': '天风姤',
  '000110': '泽地萃',
  '011000': '地风升',
  '010110': '泽水困',
  '011010': '水风井',
  '101110': '泽火革',
  '011101': '火风鼎',
  '100100': '震为雷',
  '001001': '艮为山',
  '001101': '风山渐',
  '101100': '雷泽归妹',
  '101010': '雷火丰',
  '010101': '火山旅',
  '011011': '巽为风',
  '110110': '兑为泽',
  '010011': '风水涣',
  '110010': '水泽节',
  '110011': '风泽中孚',
  '001100': '雷山小过',
  '101010': '水火既济',
  '010101': '火水未济'
}

// 生成随机卦象（自动占筮）
export function generateHexagram(): number[] {
  const yaoResults: number[] = []
  for (let i = 0; i < 6; i++) {
    const coin1 = Math.round(Math.random()) + 2 // 2 or 3
    const coin2 = Math.round(Math.random()) + 2 // 2 or 3
    const coin3 = Math.round(Math.random()) + 2 // 2 or 3
    yaoResults.push(coin1 + coin2 + coin3) // Result is 6, 7, 8, or 9
  }
  return yaoResults
}

// 解析卦象
export function parseHexagram(yaoResults: number[]) {
  // 解析本卦 (Ben Gua)
  const benGuaBinary = yaoResults.map(yao => (yao === 6 || yao === 8) ? '0' : '1').join('')
  const benGuaName = hexagramNames[benGuaBinary] || '未知卦象'

  // 解析变爻 (Bian Yao)
  const bianYaoPositions = yaoResults
    .map((yao, index) => (yao === 6 || yao === 9) ? index + 1 : null)
    .filter(pos => pos !== null) as number[]

  // 解析之卦 (Zhi Gua)
  const zhiGuaBinary = yaoResults.map(yao => {
    if (yao === 6) return '1' // 老阴变阳
    if (yao === 9) return '0' // 老阳变阴
    return yao === 7 ? '1' : '0' // 少阳保持阳，少阴保持阴
  }).join('')
  const zhiGuaName = hexagramNames[zhiGuaBinary] || '未知卦象'

  return {
    benGua: benGuaName,
    bianYao: bianYaoPositions,
    zhiGua: zhiGuaName,
    yaoResults
  }
}

// 格式化查询字符串
export function formatQuery(question: string, hexagramData: ReturnType<typeof parseHexagram>): string {
  const bianYaoText = hexagramData.bianYao.length > 0 
    ? `第${hexagramData.bianYao.join('、')}爻动` 
    : '无变爻'

  return `用户问题：${question}

---
占筮信息如下：
本卦：${hexagramData.benGua}
变爻：${bianYaoText}
之卦：${hexagramData.zhiGua}`
}
