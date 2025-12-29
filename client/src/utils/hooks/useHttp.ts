import { useEffect, useState } from "react";
import { Axios } from "../../api";
import axios from "axios";

type ReturnValue<T> = {
    isLoading: boolean,
    error: string,
    data: T,
    refetch: () => void
}

export const useHttpGet = <T>(url: string): ReturnValue<T | null> => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        refetch();
    }, [url]);

    const refetch = () => {
        setIsLoading(true);

        Axios.get<T>(url)
            .then((response) => {
                setData(response.data);
                setError("");
            })
            .catch((err) => {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message);
                }
            })
            .finally(() => setIsLoading(false));
    };
    
    return { isLoading, data, error, refetch };
};