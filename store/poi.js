import ModelModule from './base/ModelModule';

class Poi extends ModelModule {
    constructor() {
        super('/poi', { cached: false });
    }
}

export default new Poi().getModule();
