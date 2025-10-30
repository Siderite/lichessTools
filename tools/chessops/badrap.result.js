class _Result {
    unwrap(ok, err) {
        const r = this._chain((value) => Result.ok(ok ? ok(value) : value), (error) => (err ? Result.ok(err(error)) : Result.err(error)));
        if (r.isErr) {
            throw r.error;
        }
        return r.value;
    }
    map(ok, err) {
        return this._chain((value) => Result.ok(ok(value)), (error) => Result.err(err ? err(error) : error));
    }
    chain(ok, err) {
        return this._chain(ok, err !== null && err !== void 0 ? err : ((error) => Result.err(error)));
    }
}
class _Ok extends _Result {
    constructor(value) {
        super();
        this.value = value;
        this.isOk = true;
        this.isErr = false;
    }
    _chain(ok, _err) {
        return ok(this.value);
    }
}
class _Err extends _Result {
    constructor(error) {
        super();
        this.error = error;
        this.isOk = false;
        this.isErr = true;
    }
    _chain(_ok, err) {
        return err(this.error);
    }
}
export var Result;
(function (Result) {
    function ok(value) {
        return new _Ok(value);
    }
    Result.ok = ok;
    function err(error) {
        return new _Err(error || new Error());
    }
    Result.err = err;
    function all(obj) {
        if (Array.isArray(obj)) {
            const res = [];
            for (let i = 0; i < obj.length; i++) {
                const item = obj[i];
                if (item.isErr) {
                    return item;
                }
                res.push(item.value);
            }
            return Result.ok(res);
        }
        const res = {};
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const item = obj[keys[i]];
            if (item.isErr) {
                return item;
            }
            res[keys[i]] = item.value;
        }
        return Result.ok(res);
    }
    Result.all = all;
})(Result || (Result = {}));
//# sourceMappingURL=index.js.map