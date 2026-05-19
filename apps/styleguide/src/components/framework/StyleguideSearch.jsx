import { useMemo } from 'react'
import CmdKSearch from '@components/site/CmdKSearch'
import { NAV_TREE } from './sidebars.config'
import { BRAND_COLORS_SECTIONS } from '../../data/color'
import { TYPOGRAPHY_SECTIONS } from '../../data/typography'

const rowHaystack = (row) =>
  Object.values(row)
    .filter((v) => typeof v === 'string')
    .join(' ')
    .toLowerCase()

const rowLabel = (row) =>
  row.token || row.property || row.state || row.name || row.class || row.id || ''

function buildPageEntries() {
  const entries = []
  for (const node of NAV_TREE) {
    if (node.to) {
      entries.push({
        to:       node.to,
        label:    node.label,
        section:  'Pages',
        external: node.external,
      })
    }
    if (!node.children || !node.to) continue
    for (const child of node.children) {
      if (child.id) {
        entries.push({
          to:      `${node.to}#${child.id}`,
          label:   child.label,
          section: node.label,
        })
      }
      if (!child.children) continue
      for (const grandchild of child.children) {
        if (!grandchild.id) continue
        entries.push({
          to:       grandchild.to ?? `${node.to}#${grandchild.id}`,
          label:    grandchild.label,
          section:  `${node.label} / ${child.label}`,
        })
      }
    }
  }
  return entries
}

function buildReferenceEntries() {
  const entries = []
  const refHref = (sectionId) => `/reference#${sectionId}`

  for (const section of [...BRAND_COLORS_SECTIONS, ...TYPOGRAPHY_SECTIONS]) {
    entries.push({
      to:      refHref(section.id),
      label:   section.title || section.label,
      section: 'Reference',
      haystack: [section.id, section.label, section.title, section.intro]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    })

    for (const table of section.tables ?? []) {
      for (const row of table.rows ?? []) {
        const label = rowLabel(row)
        if (!label) continue
        entries.push({
          to:       refHref(section.id),
          label,
          section:  `Reference / ${section.label?.split('—').slice(1).join('—').trim() || section.title || section.id}`,
          haystack: rowHaystack(row),
        })
      }
    }
  }
  return entries
}

export default function StyleguideSearch({ open, setOpen }) {
  const entries = useMemo(
    () => [...buildPageEntries(), ...buildReferenceEntries()],
    [],
  )

  return (
    <CmdKSearch
      open={open}
      setOpen={setOpen}
      entries={entries}
      placeholder="Search pages, tokens, classes…"
    />
  )
}
