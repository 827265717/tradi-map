// 加载民俗数据
// 数据文件：public/data/folklore.json（由 scripts/convert_data.py 生成）
// 新增数据：修改 xlsx 后重新运行转换脚本，提交生成的 JSON 文件

export async function loadFolkloreData() {
  const res = await fetch('/data/folklore.json')
  if (!res.ok) throw new Error(`数据加载失败: ${res.status}`)
  return res.json()
}
