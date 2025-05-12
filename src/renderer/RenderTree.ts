import { Component } from "./Component";

export class RenderTree {
    private readonly root: RenderNode;

    constructor(htmlElement: HTMLElement) {
        this.root = new RenderNode(htmlElement, null, null);
    }
}

/**
 * This class represents a node in the render tree.
 * It contains a reference to its parent node, an array of child nodes,
 * an HTML element, and a unique ID.
 * 
 * The class provides methods to add and remove child nodes.
 * It is used to build a tree structure for rendering purposes.
 * The tree structure allows for hierarchical organization of elements,
 * making it easier to manage and render complex UI components.
 * @author Erik Burmester
 */
export class RenderNode {
    private static _idCounter = 0;
    public parent: RenderNode | null;
    private _children: RenderNode[];
    private _element: HTMLElement;
    public readonly id: number;
    private _component: Component | null;

    public constructor(element: HTMLElement, parent: RenderNode | null, component: Component | null) {
        this.id = RenderNode.generateId();
        this._element = element;
        this._children = [];
        this.parent = null;
        this._component = null;
    }

    private static generateId(): number {
        return RenderNode._idCounter++;
    }

    public appendChild(child: RenderNode): void {
        this._children.push(child);
    }

    public insertChildAt(index: number, child: RenderNode): void {
        if (index < 0 || index > this._children.length) {
            throw new Error("Index out of bounds");
        }
        this._children.splice(index, 0, child);
    }

    /**
     * This method is used to remove a child node from the current node.
     * It finds the child node in the _children array and removes it if found.
     * @param child The child node to remove.
     */
    public removeChild(child: RenderNode): void {
        const index = this._children.indexOf(child);
        if (index !== -1) {
            this._children.splice(index, 1);
        }
    }

    public children(): ReadonlyArray<RenderNode> {
        return this._children;
    }

    public render(): HTMLElement | null {
        if (this._component) {
            this._element.textContent = this._component.render();
        }
        for (const child of this._children) {
            const htmlElement: HTMLElement | null = child.render();
            if (htmlElement) {
                this._element.appendChild(htmlElement);
            }
        }
        return this._element;
    }
}