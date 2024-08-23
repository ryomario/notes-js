import Content from "./Content";

class NotFoundContent extends Content {
    /**
     * 
     * @param {AppContext} ctx 
     */
    constructor(ctx) {
        super();
        this.title = ctx.getObject().translate('__content.empty.title__');
        this.message = ctx.getObject().translate('__content.empty.message__');
    }
}

export default NotFoundContent;