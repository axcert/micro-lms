import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { PageProps } from '@/types';

export const useFlashMessages = () => {
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        if (flash.warning) {
            toast(flash.warning, { icon: '⚠️' });
        }
        if (flash.info) {
            toast(flash.info, { icon: 'ℹ️' });
        }
    }, [flash]);
};