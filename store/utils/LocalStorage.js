export default new class LocalStorage {
    constructor() {
        if (process.client) {
            this.storage = window.localStorage;
        }
    }

    set(key, value) {
        if (typeof value === 'object' && value !== null) {
            // eslint-disable-next-line no-param-reassign
            value = JSON.stringify(value);
        }
        this.storage.setItem(key, value);
    }

    get(key, defaultValue = null) {
        const value = this.storage.getItem(key) ?? defaultValue;

        try {
            return JSON.parse(value);
        } catch (exception) {
            return value;
        }
    }

    has(key) {
        return this.get(key) !== null;
    }

    remove(key) {
        this.storage.removeItem(key);
    }

    clear() {
        this.storage.clear();
    }
}();
