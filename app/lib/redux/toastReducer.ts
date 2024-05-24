import { HIDE_TOAST, SHOW_TOAST } from "./toastAction";

const initialState = {
    type: SHOW_TOAST,
    payload: {
        message:'',
        type:'',
        show: false
    }
};

export const toastReducer = (state = initialState, action:any) => {
    switch (action.type) {
        case SHOW_TOAST:
            return {
                ...state,
                payload: {
                    message: action.payload.message,
                    type: action.payload.type,
                    show: true
                }
                   
            };
        case HIDE_TOAST:
                return {
                    ...state,
                    payload: {
                        message: '',
                        type: '',
                        show: false
                        
                    }
                };
        default:
            return state;
    }
}