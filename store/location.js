import ModelModule from './base/ModelModule';

class Location extends ModelModule {
    constructor() {
        super('/location', { cached: true });
    }
}

export default new Location().getModule();
