'use client'

interface ManualInputProps {
  yaos: number[]
  onChange: (yaos: number[]) => void
}

const yaoOptions = [
  { value: 6, label: '6 (老阴)', description: '⚋⚋' },
  { value: 7, label: '7 (少阳)', description: '⚊' },
  { value: 8, label: '8 (少阴)', description: '⚋⚋' },
  { value: 9, label: '9 (老阳)', description: '⚊' },
]

const yaoNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']

export default function ManualInput({ yaos, onChange }: ManualInputProps) {
  const handleYaoChange = (index: number, value: number) => {
    const newYaos = [...yaos]
    newYaos[index] = value
    onChange(newYaos)
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
        手动占筮 - 请选择每一爻的结果
      </h3>
      <div className="space-y-4">
        {yaoNames.map((name, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-16 text-sm font-medium text-slate-600 dark:text-slate-400">
              {name}
            </div>
            <div className="flex space-x-2">
              {yaoOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleYaoChange(index, option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    yaos[index] === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span>{option.label}</span>
                    <span className="text-xs">{option.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {yaos.length > 0 && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            当前选择：
          </h4>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {yaoNames.map((name, index) => (
              <span key={index} className="mr-4">
                {name}: {yaos[index] || '未选择'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
