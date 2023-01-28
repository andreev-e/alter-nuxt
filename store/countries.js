import ItemsListModule from './base/ItemsListModule';

class Countries extends ItemsListModule {
    constructor() {
        super('/countries', { c });
    }
}

export default new Countries().getModule();
