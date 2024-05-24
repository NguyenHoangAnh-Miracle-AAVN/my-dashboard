export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';

export const showToast = (message: string, type: string) =>({
    type: SHOW_TOAST,
    payload: {
        message,
        type,
        show: true
    }
});

export const hideToast = () => ({
    type: HIDE_TOAST,
    payload: {
        message: '',
        type: '',
        show: false
    }
});