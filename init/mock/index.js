exports.mock = `export default {
    'POST /api/table': {
        code: 0,
        data: {
            total: 100,
            records: [
                { key: '1', protocol: 'TCP', ip: '192.168.1.1;192.168.1.1;192.168.1.1;192.168.1.1;192.168.1.1;192.168.1.1', note: '备注1' },
                { key: '2', protocol: 'UDP', ip: '192.168.1.2', note: '备注2' },
            ]
        }
    },
    'POST /api/createWhiteList': {
        code: 0,
        data: {}
    },
    'POST /api/deleteWhiteList': {
        code: 0,
        data: {}
    },
}`