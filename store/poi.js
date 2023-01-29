import ItemsListModule from './base/ItemsListModule';

class Poi extends ItemsListModule {
    constructor() {
        super('/poi');
    }
}

export default new Poi().getModule();
