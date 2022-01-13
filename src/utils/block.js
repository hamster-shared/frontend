///Blockchain tool class

import api from "../api";
import {timeToDay} from "@/utils/common";

// Get the current block on the chain
export const getCurrentBlockState = async () => {
    let apiPro = await api;
    let header = await apiPro.rpc.chain.getHeader();
    return {
        block: parseInt(header.number.toNumber()),
        time: new Date()
    }
}

// Query the generation time of the block according to the block (with slight error)
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
