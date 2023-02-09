import ModelModule from './base/ModelModule';

class Route extends ModelModule {
    constructor() {
        super('/route', { cached: false });
    }
}

export default new Route().getModule();
