import { getIpLocation } from './ip-location.js';

async function runTest() {
    const testIps = [
        '223.86.253.98',      // IPv4
        '240a:42b8:20:4023:6df5:b6cb:e7d7:2672',

    ];

    console.log('--- IP 定位测试开始 ---');

    for (const ip of testIps) {
        const info = await getIpLocation(ip);
        
        if (info) {
            console.log(`${ip.padEnd(20)} => ${info.country} ${info.province} ${info.city} (${info.isp})`);
        } else {
            console.log(`[FAILED] ${ip.padEnd(18)} => 无法解析`);
        }
    }
}

runTest().catch(console.error);
