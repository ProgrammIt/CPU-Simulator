
/**
 * This class represents a generic register.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export abstract class Register<T extends number> {
    /**
     * The registers content.
     */
    protected _content: T;

    /**
     * The name of the register.
     * @readonly
     */
    public readonly name: string;

    /**
     * This method constructs an instance of the Register class.
     * @param name The name of the register.
     * @param content The initial content of the register.
     */
    public constructor(name: string, content: T) {
        this.name = name.toUpperCase();
        this._content = content;
    }

    /**
     * Accessor for retrieving a copy of the current registers content.
     * @returns A copy of the current registers content.
     */
    public get content(): T {
        return this._content;
    }    

    /**
     * Accessor for setting a new value as registers content.
     */
    public set content(newValue: T) {
        this._content = newValue;
    }
}