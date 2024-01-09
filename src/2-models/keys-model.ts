class KeysModel {
    public app: string;
    public keyTap: {
        key: string;
        modifiers: string[];
    };

    public constructor(data: any) {
        this.app = data.app;
        this.keyTap = {
            key: data.keyTap.key,
            modifiers: data.keyTap.modifiers,
        };
    }
}

export default KeysModel;