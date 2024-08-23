export function createListener() {
    const listener = [];
    function addListener(callback) {
        if(listener.includes(callback))return;
        listener.push(callback);
    }
    function removeListener(callback) {
        let id = listener.findIndex(f => f === callback);
        if(id == -1)return;
        listener.splice(id,1);
    }
    function hasListener() {
        return listener.length > 0;
    }
    function trigger($this,...args) {
        for (const callback of listener) {
            if(typeof callback === 'function')callback.apply($this,args);
        }
    }
    return {
        listener,
        addListener,
        removeListener,
        hasListener,
        trigger,
    }
}