/**
 * This class represents a generic register.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class Register<T> {
    /**
     * The registers content.
     */
    public content: T;

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
        this.content = content;
    }
}