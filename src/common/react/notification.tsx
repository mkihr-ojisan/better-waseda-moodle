import { Alert, AlertColor, AlertTitle, Snackbar } from "@mui/material";
import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { errorToString } from "../error";

export type Notification = {
    type: AlertColor;
    title?: string;
    message: string;
};

const NotificationContext = createContext<((notification: Notification) => void) | undefined>(undefined);

export type NotificationContextProviderProps = PropsWithChildren<{
    /** 通知を表示する位置のオフセット */
    offset?: [number, number];
}>;

export const NotificationContextProvider: FC<NotificationContextProviderProps> = ({ offset, children }) => {
    const [notification, setNotification] = useState<Notification>();
    const [open, setOpen] = useState(false);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const notify = useCallback((notification: Notification) => {
        setNotification(notification);
        setOpen(true);
    }, []);

    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                sx={{
                    transform: offset && `translate(${offset[0]}px, ${offset[1]}px)`,
                }}
            >
                <Alert severity={notification?.type}>
                    {notification?.title && <AlertTitle>{notification.title}</AlertTitle>}
                    {notification?.message}
                </Alert>
            </Snackbar>
            <NotificationContext.Provider value={notify}>{children}</NotificationContext.Provider>
        </>
    );
};

/**
 * 通知を表示する関数を使用するためのフック
 *
 * @returns 通知を表示する関数
 * @throws NotificationContext内でない場合
 */
export function useNotify(): (notification: Notification) => void {
    const notify = useContext(NotificationContext);
    if (!notify) {
        throw new Error("useNotify must be used within a NotificationContextProvider");
    }
    return notify;
}

/**
 * エラーを通知するフック
 *
 * @param error - 通知するエラー
 * @param title - 通知のタイトル
 */
export function useNotifyError(error: unknown, title?: string): void {
    const notify = useNotify();
    useEffect(() => {
        if (error) {
            notify({
                type: "error",
                title,
                message: errorToString(error),
            });
        }
    }, [error, notify, title]);
}
