import { toast } from "react-toastify";

export default {
    info: (message, id = "toolbox-toast") => {
        toast.info(message, {
            className: "toast-notification-info",
            bodyClassName: "toast-notification-body",
            toastId: id
        });
    },

    success: (message, id = "toolbox-toast") => {
        toast.success(message, {
            className: "toast-notification-success",
            bodyClassName: "toast-notification-body",
            toastId: id
        });
    },

    error: (message, id = "toolbox-toast") => {
        toast.error(message, {
            className: "toast-notification-error",
            bodyClassName: "toast-notification-body",
            toastId: id
        });
    },

    warning: (message, id = "toolbox-toast") => {
        toast.warn(message, {
            className: "toast-notification-warning",
            bodyClassName: "toast-notification-body",
            toastId: id
        });
    }
};
