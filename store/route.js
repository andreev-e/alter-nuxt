import ModelModule from './base/ModelModule';

class Route extends ModelModule {
    constructor() {
        super('/route');
    }
}

export default new Route().getModule();
