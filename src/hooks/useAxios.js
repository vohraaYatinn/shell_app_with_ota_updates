import { useState, useEffect } from "react";

const useAxios = () => {
    const [response, setResponse] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); //different!
    const [controller, setController] = useState();
    const [isPermissionDenied, setIsPermissionDenied] = useState(false);

    const axiosFetch = async (configObj) => {
        const {
            axiosInstance,
            method,
            url,
            requestConfig = {}
        } = configObj;

        try {
            setLoading(true);
            const ctrl = new AbortController();
            setController(ctrl);
            const headers = {
                'Content-Type': 'application/json',
            };

            // Add Authorization header with Bearer token if available
            const token = localStorage.getItem('access_token');
            console.log(token, "token",method.toLowerCase());
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const res = await axiosInstance[method.toLowerCase()](url, {
                ...requestConfig,
                headers: headers, // Add headers to the request
            });
            // if(method.toLowerCase()=='post'){
            //     res = await axiosInstance.post(url, requestConfig.data, {
            //         headers: headers, // Add headers to the request
                // });
            // }
            // const res = await axiosInstance[method.toLowerCase()](url, {
            //     ...requestConfig
            // });
            setResponse(res.data);
        } catch (err) {
            if (err?.response?.status === 403) {
                setIsPermissionDenied(true);
            }
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        return () => controller && controller.abort();
    }, [controller]);

    useEffect(() => {
        if (isPermissionDenied) {
            setIsPermissionDenied(false);
            throw 403;
        }
    }, [isPermissionDenied])

    return [response, error, loading, axiosFetch, setError];
}

export default useAxios