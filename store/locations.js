import ItemsListModule from './base/ItemsListModule';

class Locations extends ItemsListModule {
    constructor() {
        super('/location', { cached: true });
    }
}

export default new Locations().getModule();
