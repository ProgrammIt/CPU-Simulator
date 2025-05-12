/**
 * This class represents a generic component of the graphical user interface.
 * A component is a bundle of a TypeScript class and an accompanied HTML template file.
 * It provides an interface for (re-)render the components with the members values of the TypeScript class.
 * Rendering means the creation of a DocumentFragment, which can be inserted into the document object model (DOM).
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export abstract class Component {
    /**
     * This member stores the string representation of the HTML template file.
     */
    protected _template: string;

    /**
     * This member stores a mapping between keys in the template file and their associated values.
     */    
    protected _args: Map<string, string>;

    /**
     * Constructs a generic component from the given mapping between keys in the template file and their 
     * associated values.
     * @param args A mapping between keys in the template file and their associated values.
     */
    public constructor(args: Map<string, string>) {
        this._args = args;
        this._template = "";
    }

    /**
     * This method creates a HTML string from its template and replaces the placeholders with
     * its current arguments.
     */
    public abstract render(): string;
}