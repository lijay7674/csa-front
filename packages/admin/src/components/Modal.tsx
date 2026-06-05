import { ReactNode, useState } from 'react';

/**
 * 通用 Modal 遮罩弹窗组件
 */
interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}

export default function Modal({ open, title, children, onClose, footer }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div>{children}</div>
        {footer && <div className="flex justify-end gap-3 mt-6 pt-4 border-t">{footer}</div>}
      </div>
    </div>
  );
}

/**
 * 确认弹窗 — 替代 window.confirm()
 */
interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title = '确认操作', message, confirmLabel = '确定', cancelLabel = '取消', danger, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel}
      footer={
        <>
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--admin-text-secondary)' }}>{cancelLabel}</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: danger ? '#EF4444' : 'var(--admin-accent)' }}>{confirmLabel}</button>
        </>
      }>
      <p className="text-sm" style={{ color: 'var(--admin-text)' }}>{message}</p>
    </Modal>
  );
}

/**
 * 输入弹窗 — 替代 window.prompt()
 */
interface PromptDialogProps {
  open: boolean;
  title: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  multiline?: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function PromptDialog({ open, title, label, placeholder, defaultValue = '', confirmLabel = '确定', cancelLabel = '取消', multiline, onConfirm, onCancel }: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);

  const handleConfirm = () => {
    onConfirm(value);
    setValue('');
  };

  const handleCancel = () => {
    setValue('');
    onCancel();
  };

  if (!open) return null;

  return (
    <Modal open={open} title={title} onClose={handleCancel}
      footer={
        <>
          <button onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--admin-text-secondary)' }}>{cancelLabel}</button>
          <button onClick={handleConfirm} className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'var(--admin-accent)' }}>{confirmLabel}</button>
        </>
      }>
      <div>
        {label && <p className="text-sm mb-2" style={{ color: 'var(--admin-text-secondary)' }}>{label}</p>}
        {multiline ? (
          <textarea className="admin-input min-h-[80px]" value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} />
        ) : (
          <input className="admin-input" value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} />
        )}
      </div>
    </Modal>
  );
}
