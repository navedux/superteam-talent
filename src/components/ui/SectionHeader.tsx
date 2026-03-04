import { RiPencilLine, RiCheckLine, RiCloseLine } from '@remixicon/react'
import { Button } from '@/components/ui/Button'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  editing?: boolean
  onEdit?: () => void
  onSave?: () => void
  onCancel?: () => void
}

export function SectionHeader({ title, subtitle, editing, onEdit, onSave, onCancel }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-bg-card">
      <div className="min-w-0">
        <h3 className="text-lg font-medium text-text-primary">{title}</h3>
        {subtitle && <p className="text-[13px] text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {(onEdit || onSave || onCancel) && (
        <div className="flex items-center gap-1 shrink-0">
          {editing ? (
            <>
              {onCancel && (
                <Button size="sm" variant="secondary" onClick={onCancel}>
                  <RiCloseLine size={14} />
                  Cancel
                </Button>
              )}
              {onSave && (
                <Button size="sm" onClick={onSave}>
                  <RiCheckLine size={14} />
                  Save
                </Button>
              )}
            </>
          ) : (
            onEdit && (
              <Button size="sm" variant="secondary" onClick={onEdit}>
                <RiPencilLine size={14} />
                Edit
              </Button>
            )
          )}
        </div>
      )}
    </div>
  )
}
