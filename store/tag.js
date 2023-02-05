import ModelModule from './base/ModelModule';

class Tag extends ModelModule {
    constructor() {
        super('/tag', { cached: true });
    }
}

export default new Tag().getModule();
