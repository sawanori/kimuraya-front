'use client'

import { useMultilingual } from '@/hooks/useMultilingual'

interface MultilingualTextProps {
  contentKey: string
  content?: any
  className?: string
  asHtml?: boolean
  splitChar?: string
  mobileClass?: string
}

export default function MultilingualText({ 
  contentKey, 
  content, 
  className = '', 
  asHtml = false,
  splitChar,
  mobileClass
}: MultilingualTextProps) {
  const { getContent } = useMultilingual()
  const text = getContent(contentKey, content)

  if (asHtml) {
    return (
      <span 
        className={className}
        dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }}
      />
    )
  }

  if (splitChar && mobileClass) {
    const parts = text.split(splitChar)
    return (
      <>
        <span className={`desktop-text ${className}`}>{text}</span>
        <span className={`mobile-text ${mobileClass}`}>
          {parts.map((part: string, i: number) => (
            <span key={i}>
              {i === 0 ? `${part}${splitChar}` : <><br />{part}</>}
            </span>
          ))}
        </span>
      </>
    )
  }

  return <span className={className}>{text}</span>
}