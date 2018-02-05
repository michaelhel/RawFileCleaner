'use strict'

function Storage(environment) {
}

Storage.prototype.set = function(items, callbackFunction) {
    this.base.set(items, callbackFunction)
}

Storage.prototype.get = function(keys, callbackFunction) {
    this.base.get(keys, callbackFunction)
}

Storage.prototype.remove = function(keys, callbackFunction) {
    this.base.remove(keys, callbackFunction)
}

function StorageBase(environment) {
    var _this = this

    if (!environment) {
        environment = 'chrome'
    }
    if (environment === 'chrome') {
        this.localStorage = chrome.storage.local
        this.runtime = chrome.runtime
        this.extension = chrome.extension
    } else {
        throw 'Invalid environment'
    }

    this.isBackgroundPage = (location.protocol === "chrome-extension:" &&
                             this.extension.getBackgroundPage() === window)

    this.storageLoadedPromise = new Promise(function(resolve, reject) {
        _this.localStorage.get(null, function(data) {
            _this.data = data
            resolve('loaded!')
        })
    })

    this.runtime.onMessage.addListener(this.proxyClient.bind(this))
}

StorageBase.prototype.proxyClient = function(request, sender, sendResponse) {
    if (request.messageLocation &&
        request.messageLocation !== "storage") {
        return false
    }
    if (typeof(request.method) === "undefined") {
        return false
    }

    if (this.isBackgroundPage) {
        if (request.method === 'get') {
            return this.get(request.key, sendResponse)
        } else if (request.method === 'set') {
            return this.set(request.items, sendResponse)
        } else if (request.method === 'remove') {
            return this.remove(request.keys, sendResponse)
        }
    }
}

StorageBase.prototype.set = function(items, callbackFunction) {
    var _this = this

    this.storageLoadedPromise.then(function() {
        _.merge(_this.data, items)
        if (_this.isBackgroundPage) {
            _this.localStorage.set(_this.data, callbackFunction)
        } else {
            if (!callbackFunction) {
                callbackFunction = function() {}
            }
            _this.runtime.sendMessage({
                method: "set",
                items: items,
                messageLocation: "storage"
            }, callbackFunction)
        }
    })

    return true
}

StorageBase.prototype.get = function(key, callbackFunction) {
    var _this = this
    
    this.storageLoadedPromise.then(function() {
        if (typeof callbackFunction !== "function") {
            return
        }
        if (_this.isBackgroundPage) {
            if (key === null) {
                // Return all data
                callbackFunction(_this.data)
            } else {
                // Return the data for a particular key
                if (!_this.data[key]) {
                    // If there's no hit, return null
                    callbackFunction(null)
                } else {
                    callbackFunction(_this.data[key])
                }
            }
        } else {
            _this.runtime.sendMessage({
                method: "get",
                key: key,
                messageLocation: "storage"
            }, callbackFunction)
        }
    })

    return true
}

StorageBase.prototype.remove = function(keys, callbackFunction) {
    var _this = this
    if (!(keys instanceof Array)) keys = [keys]
    
    this.storageLoadedPromise.then(function() {
        if (_this.isBackgroundPage) {
            for (var i = 0; i < keys.length; i++) {
                delete(_this.data[keys[i]])
            }
            _this.localStorage.remove(keys, callbackFunction)
        } else {
            if (!callbackFunction) {
                callbackFunction = function() {}
            }
            _this.runtime.sendMessage({
                method: "remove",
                keys: keys,
                messageLocation: "storage"
            }, callbackFunction)
        }
    })

    return true
}

Storage.prototype.base = new StorageBase()

module.exports = Storage