export function formatReference(value) {
  if (!value) return 'Unassigned'
  if (typeof value === 'object') {
    return value.displayName || value.name || value.username || value._id || 'Unknown'
  }

  const text = String(value)
  return text.length > 14 ? `#${text.slice(-6)}` : text
}

export function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function recordKey(record, index) {
  return record._id || record.username || record.title || `${record.name || 'record'}-${index}`
}