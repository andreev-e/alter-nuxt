import ItemsListModule from './base/ItemsListModule';

class Countries extends ItemsListModule {
    constructor() {
        super('/countries');
    }
}

export default new Countries().getModule();
