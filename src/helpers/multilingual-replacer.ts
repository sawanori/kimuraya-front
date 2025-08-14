// すべてのテキストを多言語対応に置換するヘルパー関数

export function applyMultilingualToAllText(element: HTMLElement, t: (key: string) => string, getContent: (path: string, content?: any) => string, _content: any) {
  // もつ鍋セクション
  const motsunabeDescription = element.querySelector('.motsunabe-description')
  if (motsunabeDescription) {
    motsunabeDescription.textContent = t('motsunabe.description')
  }

  // ダイニングスタイルの特徴
  const partyFeatures = element.querySelectorAll('.dining-feature-text')
  if (partyFeatures.length >= 3) {
    partyFeatures[0].textContent = t('dining.partyFeature1')
    partyFeatures[1].textContent = t('dining.partyFeature2')
    partyFeatures[2].textContent = t('dining.partyFeature3')
  }

  // 営業情報のラベル
  const infoLabels = element.querySelectorAll('.info-list dt')
  const labelKeys = ['info.label.address', 'info.label.access', 'info.label.phone', 'info.label.hours', 'info.label.closed', 'info.label.seats']
  infoLabels.forEach((label, index) => {
    if (labelKeys[index]) {
      label.textContent = t(labelKeys[index])
    }
  })

  // 営業情報の内容
  const infoContents = element.querySelectorAll('.info-list dd')
  const contentPaths = ['shopInfo.address', 'shopInfo.access', 'phone', 'shopInfo.businessHours', 'shopInfo.closedDays', 'shopInfo.seatsCount']
  infoContents.forEach((content, index) => {
    if (contentPaths[index] && contentPaths[index] !== 'phone') {
      const text = getContent(contentPaths[index], content)
      if (text) {
        content.innerHTML = text.replace(/\n/g, '<br />')
      }
    }
  })
}