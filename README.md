# JsPromise
模拟Promise的内部实现

####  _status对象
    PENDING --等待中
    FULLFILLED --已完成
    REJECTED --已拒绝
####  thenCallback
    调用then函数传入的成功回调函数所属队列
####  rejectCallback
    调用then函数传入的失败回调函数所属队列
####  resolve
    调用resolve时执行成功回调函数队列中的所有函数，并设置当前promise对象的执行状态为'已完成'
####  reject
    调用reject时执行成功失败函数队列中的所有函数，并设置当前promise对象的执行状态为'已拒绝'
####  then
    用于绑定后续成功回调、失败回调
    
    返回一个新的myPromise实例对象，不直接返回this的原因，Promise对象的状态需要初始化为Pending，用于实现如下功能：
    
    当then回调返回一个Promise对象时，需要设置then回调返回的promise对象resolve时才去执行后续绑定的then回调函数
    
        具体实现如下：将第二个Promise对象的resolve函数引用存储到回调promise中的成功队列中，由回调promise的resolve函数执行 决定 第二个promise对象的何时设置为'已完成'
            //判断返回值类型是否等于Promise
            if (result instanceof myPromise) {
                result.then(res, rej);
            } 
####  callback
    实例化myPromise对象时传入的立即执行函数,手动bind resolve中的this指向实例化Promise对象
