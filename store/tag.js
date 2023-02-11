import ModelModule from './base/ModelModule';

class Tag extends ModelModule {
    constructor() {
        super('/tag');
    }
}

export default new Tag().getModule();
