import { Component } from "./Component";
import { Message } from "./Message";

/**
 * This class represents a tree structure for organizing the graphical user interfaces components.
 * The tree structure allows for hierarchical organization of elements, making it easier to manage 
 * and render complex UI components.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class RenderTree {
    public readonly root: InnerNode;

    constructor(htmlElement: HTMLElement) {
        this.root = new InnerNode(htmlElement, null);
    }
}

/**
 * This class represents a node in the render tree.
 * It contains a reference to its parent node, an HTML element and a unique ID.
 * @author Erik Burmester
 */
export abstract class RenderNode {
    /**
     * This class member stores the id which to assign to the next node generated.
     */
    private static _idCounter = 1;

    /**
     * This member stores the reference to the parent node associated with this node.
     */
    public parent: RenderNode | null;

    /**
     * This member stores the id of this node.
     * @readonly
     */
    public readonly id: number;

    /**
     * Constructs an instance of with the given node assigned as the parent node.
     * @param parent The node to assign as parent.
     */
    protected constructor(parent: RenderNode | null = null) {
        this.id = RenderNode._idCounter++;
        this.parent = parent;
    }

    /**
     * This method triggers the creation of the graphical user interface. It returns a HTMLElement,
     * which can be used to append the created element to existing parts of the document object model.
     * @returns A HTMLElement to append to a part of the document object model.
     */
    public abstract init(): HTMLElement;

    /**
     * This method sends the given message to all connected nodes in the render tree. This process is
     * called "flooding".
     * @param msg The message to flood in the render tree.
     */
    public abstract sendMessage(msg: Message): void;

    /**
     * This method forwards the given message to all connected nodes, except the one, which sends the
     * message.
     * @param msg The incoming message.
     */
    public abstract receiveMessage(msg: Message): void;
}

/**
 * This class represents an inner node in the render tree.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class InnerNode extends RenderNode {
    /**
     * This member stores a reference to a HTMLElement in the document object model (DOM).
     * The element is used to append children nodes HTML content to the DOM.
     */
    private _element: HTMLElement;

    /**
     * This member stores a list of children associated with this inner node.
     */
    private _children: Array<RenderNode>;

    /**
     * This member stores a list of the child nodes ids for faster reference.
     */
    private _childIds: Array<number>;

    /**
     * Constructs an instance with the given HTMLElement and parent node assigned.
     * @param element The HTMLElement to assign to this node.
     * @param parent The parent node to assign to this node.
     */
    public constructor(element: HTMLElement, parent: RenderNode | null) {
        super(parent);
        this._children = new Array<RenderNode>();
        this._element = element;
        this._childIds = [];
    }

    /**
     * This method appends a child node at the end of the list containing the children.
     * @param child The child node to append to the list.
     */
    public appendChild(child: RenderNode): void {
        this._children.push(child);
        this._childIds.push(child.id);
    }

    /**
     * This method inserts a child at a specific index in the list of the
     * child nodes.
     * @param index The index to insert the child at. 
     * @param child The child node to insert.
     */
    public insertChildAt(index: number, child: RenderNode): void {
        if (index < 0 || index > this._children.length) {
            throw new Error("Index out of bounds");
        }
        const arr = Array.from(this._children);
        arr.splice(index, 0, child);
        this._children = arr;
        this._childIds.push(child.id);
    }

    /**
     * This method checks, whether this node has children assigned, or not.
     * @returns True, if this inner node has children, false otherwise.
     */
    public hasChildren(): boolean {
        return (this._children.length > 0) ? true : false;
    }

    /**
     * This method is used to remove a child node from the current node.
     * It finds the child node in the _children array and removes it if found.
     * @param child The child node to remove.
     */
    public removeChild(child: RenderNode): void {
        const indexId = this._childIds.indexOf(child.id);
        const indexChild = this._children.indexOf(child);
        this._children.splice(indexChild, 0);
        this._childIds.splice(indexId, 0);
    }

    /**
     * This accessor returns a read-only copy of the list of children.
     * @returns A read-only copy of the list of children.
     */
    public get children(): ReadonlyArray<RenderNode> {
        return this._children;
    }

    /**
     * This method triggers the creation of the graphical user interface. It returns a HTMLElement,
     * which can be used to append the created element to existing parts of the document object model.
     * @returns A HTMLElement to append to a part of the document object model.
     * @override
     */
    public init(): HTMLElement {
        this._element.innerHTML = "";
        for (const node of this._children) {
            this._element.appendChild(node.init());
        }
        return this._element;
    }

    /**
     * This method forwards the given message to all connected nodes, except the one, which sends the
     * message.
     * @param msg The incoming message.
     * @override
     */
    public receiveMessage(msg: Message): void {
        this.sendMessage(msg);
    }

    /**
     * This method sends the given message to all connected nodes in the render tree. This process is
     * called "flooding".
     * @param msg The message to flood in the render tree.
     * @override
     */
    public sendMessage(msg: Message): void {
        if (this._children.length > 0) {
            msg.forwardedBy = this.id;
            this._children.forEach(node => {
                if (msg.from !== node.id) {
                    node.receiveMessage(msg);
                }
            });
        }
        if (this.parent && this.parent.id !== msg.forwardedBy) {
            this.parent.receiveMessage(msg);
        }
    }
}

/**
 * This class represents a leaf node in the render tree.
 * A leaf node is a node, which does not have any child nodes.
 * @author Erik Burmester
 */
export class LeafNode extends RenderNode {

    /**
     * This member stores a component of the graphical user interface this
     * node is assigned to.
     */
    private _component: Component;

    /**
     * Constructs an instance with the given component and parent assigned.
     * @param component A component of the graphical user interface.
     * @param parent The parent node this node is attached to.
     */
    public constructor(component: Component, parent: RenderNode) {
        super(parent);
        this._component = component;
        this._component.associatedNode = this;
    }

    /**
     * This method triggers the creation of the graphical user interface. It returns a HTMLElement,
     * which can be used to append the created element to existing parts of the document object model.
     * @returns A HTMLElement to append to a part of the document object model.
     * @override
     */
    public init(): HTMLElement {
        var template = document.createElement('template');
        template.innerHTML = this._component.init();
        return template;
    }

    /**
     * This method decides whether an incoming message can be processed or not. As there are no nodes
     * to flood the message to, the message is discarded.
     * @param msg The incoming message.
     * @override
     */
    public receiveMessage(msg: Message): void {
        if (msg.to == this.id) {
            this.processMessage(msg);
        }
    }

    /**
     * This method sends the given message to all connected nodes in the render tree. This process is
     * called "flooding".
     * @param msg The message to flood in the render tree.
     * @override
     */
    public sendMessage(msg: Message): void {
        msg.from = this.id;
        msg.forwardedBy = this.id;
        if (this.parent) {
            this.parent.sendMessage(msg);
        }
    }

    /**
     * This method processes a given message.
     * @param msg The message to process.
     * @override
     */
    public processMessage(msg: Message): void {
        this._component.processMessage(msg);
    }
}