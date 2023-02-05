import ItemsListModule from './base/ItemsListModule';

class Pois extends ItemsListModule {
    constructor() {
        super('/poi');
    }
}

export default new Pois().getModule();
