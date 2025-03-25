import { Toaster as SonnerToaster, toast } from 'sonner';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

export const NotificationProvider = () => {
    return <SonnerToaster position="top-right" richColors />;
};

export const useNotification = () => {
    const notify = (
        type: NotificationType,
        title: string,
        description?: string,
        options?: any
    ) => {
        switch (type) {
            case 'success':
                toast.success(title, { description, ...options });
                break;
            case 'error':
                toast.error(title, { description, ...options });
                break;
            case 'warning':
                toast.warning(title, { description, ...options });
                break;
            default:
                toast(title, { description, ...options });
        }
    };

    return { notify };
};