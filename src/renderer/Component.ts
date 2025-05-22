import { Message } from "./Message";
import { LeafNode } from "./RenderTree";

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
     * This member stores the current mapping between keys in the template file and their associated values
     * as displayed in the graphical user interface.
     */    
    protected _args: Map<string, string>;

    /**
     * This member stores a reference to the leaf node associated with this component.
     * The reference is used to send messages to other nodes in the tree.
     */
    protected _associatedNode: LeafNode | null;

    /**
     * Constructs a generic component from the given mapping between keys in the template file and their 
     * associated values.
     * @param args A mapping between keys in the template file and their associated values.
     */
    public constructor(args: Map<string, string>) {
        this._args = args;
        this._template = "";
        this._associatedNode = null;
    }

    /**
     * This accessor allows late setting of the leaf node associated with this component.
     */
    public set associatedNode(node: LeafNode) {
        this._associatedNode = node;
    }

    /**
     * This method creates a HTML string from its template and replaces the placeholders with
     * its current arguments.
     */
    public abstract init(): string;

    /**
     * This method updates the rendered component.
     */
    public abstract update(): void;

    /**
     * This method processes the message received by the render node, this component is attached to.
     * @param msg A message received by the render node.
     */
    public abstract processMessage(msg: Message): void;

    /**
     * This method emits a message to the associated leaf node. The leaf node will send the message to its
     * parent node, which will forward the message to other nodes in the render tree.
     * @param msg The message to send.
     */
    protected emitMessage(msg: Message): void {
        if (this._associatedNode) {
            this._associatedNode.receiveMessage(msg);
        }
    }

    /**
     * This method checks, whether a given key in the list of arguments is present. If it is present
     * if checks whether the value differs from the given one.
     * @param argKey The key to look up in the list of arguments.
     * @param value The value to check for changes.
     * @returns 
     */
    protected differ(argKey: string, value: string): boolean {
        return this._args.has(argKey) && (value !== this._args.get(argKey))
    }
}