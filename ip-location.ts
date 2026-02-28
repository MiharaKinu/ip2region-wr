import path from 'path';
import fs from 'fs';
import { IPv4, IPv6, newWithBuffer } from 'ip2region.js';

const DB_PATH_V4 = path.join(process.cwd(), 'data', 'ip2region_v4.xdb');
const DB_PATH_V6 = path.join(process.cwd(), 'data', 'ip2region_v6.xdb');

interface IpInfo {
    raw: string;
    country: string;
    province: string;
    city: string;
    isp: string;
}

let searcherV4: any = null;
let searcherV6: any = null;

/**
 * 初始化 Searcher
 * 将 xdb 文件一次性加载到内存中
 */
function initSearchers() {
    if (!searcherV4 && fs.existsSync(DB_PATH_V4)) {
        const bufferV4 = fs.readFileSync(DB_PATH_V4);
        searcherV4 = newWithBuffer(IPv4, bufferV4);
    }

    if (!searcherV6 && fs.existsSync(DB_PATH_V6)) {
        const bufferV6 = fs.readFileSync(DB_PATH_V6);
        searcherV6 = newWithBuffer(IPv6, bufferV6);
    }
}

/**
 * 获取 IP 定位信息
 * @param ip IPv4 或 IPv6 地址
 */
export async function getIpLocation(ip: string): Promise<IpInfo | null> {
    try {
        initSearchers();
        const isIPv6 = ip.includes(':');
        const searcher = isIPv6 ? searcherV6 : searcherV4;

        if (!searcher) {
            throw new Error(`${isIPv6 ? 'IPv6' : 'IPv4'} 数据库文件不存在`);
        }

        const region = await searcher.search(ip);

        if (!region) return null;

        const parts = region.split('|');
        
        return {
            raw: region,
            country: parts[0] || '',
            province: parts[2] || '',
            city: parts[3] || '',   
            isp: parts[4] || '',    
        };
    } catch (error) {
        console.error(`IP 查询失败 [${ip}]:`, error);
        return null;
    }
}