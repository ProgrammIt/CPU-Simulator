/**
 * This class represents a generic register.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export default abstract class Register<T> {
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
     * @constructor
     */
    public constructor(name: string, content: T) {
        this.name = name.toUpperCase();
        this._content = content;
    }

    /**
     * Accessor for retrieving a copy of the current registers content.
     * @returns A copy of the current registers content.
     */
    public abstract get content(): T;

    /**
     * Accessor for setting a new value as registers content.
     */
    public abstract set content(newValue: T);
}