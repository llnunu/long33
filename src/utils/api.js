import axios from 'axios'
import {Message} from 'element-ui';
import {mymessage} from '@/utils/mymessage';
import store from "@/store";
import router from "@/router";


axios.interceptors.response.use(success => {
    if (success.status && success.status == 200 && success.data.status == 500) {
        Message.error({message: success.data.msg})
        return;
    }
    if (success.data.msg) {
        Message.success({message: success.data.msg})
    }
    //文件下载特殊处理
    if(success.data && success.data instanceof Blob && success.config && success.config.responseType == 'blob'){
        let blob = new Blob([success.data]);
        let fileName = decodeURI(success.headers["content-disposition"].replace('attachment;filename=',''));
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = fileName; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href);
        return true;
    }
    return success.data;
}, error => {
    if (error.response.status == 504 || error.response.status == 404) {
        Message.error({message: '服务器被吃了( ╯□╰ )'})
    } else if (error.response.status == 403) {
        Message.error({message: '权限不足，请联系管理员'})
    } else if (error.response.status == 401) {
        Message.error({message: error.response.data.msg ? error.response.data.msg : '尚未登录，请登录'})
        //清理缓存和状态
        window.sessionStorage.removeItem("user");
        store.commit('initRoutes', []);
        if (router.currentRoute.path != '/login') {
            router.push({
                path: '/login',
                query: {redirect: window.location.href}
            });
        }
    } else {
        if (error.response.data.msg) {
            Message.error({message: error.response.data.msg})
        } else {
            Message.error({message: '未知错误!'})
        }
    }
    return;
});


let base = '';

export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params
    })
}
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        params: params
    })
}

export const uploadRequest = (url, params) => {
    return axios({
        method: 'post',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        url: `${base}${url}`,
        data: params
    })
}

export const downloadRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        responseType: 'blob',
        data: params
    })
}

export const initCurrUser = () => {
    if (window.sessionStorage.getItem("user")) {
        return new Promise((resolve, reject) => resolve(JSON.parse(window.sessionStorage.getItem("user"))));
    } else {
        return getRequest("login/current");
    }
}
