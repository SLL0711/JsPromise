function myPromise(callback) {
    if (typeof callback !== 'function') {
        throw new Error("入参必须为函数");
    }

    var STATUS_PENDING = 'PENDING';
    var STATUS_RESOLVE = 'FULLFILLED';
    var STATUS_REJECT = 'REJECTED';

    this._status = STATUS_PENDING;//当前执行阶段
    this.thenCallback = [];//成功回调函数队列
    this.rejectCallback = [];//失败回调函数队列
    this.resolve = function (res) {
        // this.thenCallback.forEach(function (v, i) {
        //     v(res);
        // })
        while (cb = this.thenCallback.shift()) {
            cb(res)
        }
        this._status = STATUS_RESOLVE;
    }

    //注册失败回调函数
    this.reject = function (err) {
        while (cb = this.rejectCallback.shift()) {
            cb(err)
        }
        this._status = STATUS_REJECT;
    }

    //注册成功回调函数
    //判断当前执行阶段，只有当pending时允许注册，如果状态为fullfilled直接执行成功回调、否则直接执行失败回调
    this.then = function (fullFilledCallback, rejectCallback) {
        var status = this._status;
        var fulfillArr = this.thenCallback;
        var rejArr = this.rejectCallback;
        return new myPromise(function (res, rej) {
            var resolveCb = function (value) {
                if (typeof (fullFilledCallback) == 'function') {
                    var result = fullFilledCallback(value);
                    //判断返回值类型是否等于Promise
                    if (result instanceof myPromise) {
                        result.then(res, rej);
                    } else {
                        res(result);
                    }
                } else {
                    res();
                }
            }
            var rejectCb = function (err) {
                if (typeof (rejectCallback) == 'function') {
                    var result = rejectCallback(err);
                    if (result instanceof myPromise) {
                        result.then(res, rej);
                    } else {
                        rej(result);
                    }
                } else {
                    rej();
                }
            }

            if (status == STATUS_PENDING) {
                fulfillArr.push(resolveCb);
                rejArr.push(rejectCb);
            } else if (status == STATUS_RESOLVE) {
                // fullFilledCallback();
                resolveCb();
            } else {
                // rejectCallback();
                rejectCb();
            }
        });
    }

    callback(this.resolve.bind(this), this.reject.bind(this));
}
