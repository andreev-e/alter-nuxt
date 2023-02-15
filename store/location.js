import ModelModule from './base/ModelModule';

class Location extends ModelModule {
    constructor() {
        super('/location');
    }
}

export default new Location().getModule();
