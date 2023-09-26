export interface ITaskDialogProps {
    onSave: (header: string, content: string, author: string) => Promise<void>;
    onClose: () => Promise<void>;
}