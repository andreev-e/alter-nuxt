import ModelModule from './base/ModelModule';

class Poi extends ModelModule {
    constructor() {
        super('/poi');
    }
}

export default new Poi().getModule();
