module.exports = function () {
    let proxy = this;

    proxy.on('error', function (err, req, res) {
        // 输出空白响应数据
        res.write('error!');
        res.end();
    });
}