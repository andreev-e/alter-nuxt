import ItemsListModule from './base/ItemsListModule';

class Locations extends ItemsListModule {
    constructor() {
        super('/location');
    }
}

export default new Locations().getModule();
