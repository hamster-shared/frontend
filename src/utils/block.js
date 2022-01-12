/// 链区块工具类

import api from "../api";
import {timeToDay} from "@/utils/common";

// 获取链上当前区块
export const getCurrentBlockState = async () => {
    let apiPro = await api;
    let header = await apiPro.rpc.chain.getHeader();
    return {
        block: parseInt(header.number.toNumber()),
        time: new Date()
    }
}

// 根据区块查询区块生成的时间（有细微误差）
export const blockNumberToTime = (param,blockSate) => {

    let blockNumber
    if (typeof param === 'number'){
        blockNumber = param
    }else {
        blockNumber = parseInt(param.replace(",",""))
    }

    if(!blockSate){
        throw new Error("blockState cannot be undefined")
    }

    let space = blockNumber - blockSate.block;
    return timeToDay(blockSate.time.getTime() + space * 6 * 1000)
}
