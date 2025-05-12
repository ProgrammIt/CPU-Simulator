import { Component } from "../Component";
import template from "./register.component.html";

/**
 * This class accompanies the template register.component.html.
 * It is used to (re-)render the component with the members values of this class.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class RegisterComponent extends Component {

    /**
     * This member stores the id of the register widget.
     */
    private _id: string;

    /**
     * This member stores the representation of the data contained in the register.
     */
    private _dataRepresentation: string;

    /**
     * This member stores the title of the register.
     */
    private _title: string;

    /**
     * This member stores a short description of the register.
     */
    private _description: string;

    /**
     * This member stores the registers content.
     */
    private _registerContent: string;

    /**
     * Constructs an instance of the register component with the given values for its members.
     * @param id The id of the register widget.
     * @param dataRepresentation The representation of the data contained in the register.
     * @param title The title of the register.
     * @param description A short description of the register.
     * @param registerContent The registers content.
     */
    public constructor(
        id: string, 
        dataRepresentation: string, 
        title: string, 
        description: string, 
        registerContent: string
    ) {
        super(new Map([
            ["{{ id }}", id],
            ["{{ data-representation }}", dataRepresentation],
            ["{{ title }}", title],
            ["{{ description }}", description],
            ["{{ register-content }}", registerContent]
        ]));
        this._template = template;
        this._id = id;
        this._dataRepresentation = dataRepresentation;
        this._title = title;
        this._description = description;
        this._registerContent = registerContent;
    }

    /**
     * This method creates a document fragment from the template and replaces all placeholders in the template
     * by the members values associated with this class.
     * @returns A document fragment ready to be inserted into the document object model (DOM).
     * @override
     */
    public render(): string {
        let templateCopy: string = this._template;
        this._args.forEach((value, key) => {
            templateCopy = templateCopy.replace(key, value);
        });
        return templateCopy;
    }

    /**
     * This accessor returns the id of this widget.
     * @returns The id of this widget.
     */
    public get id(): string {
        return this._id;
    }

    /**
     * This accessor returns the current representation configured for this register widget.
     * @returns The current data representation.
     */
    public get dataRepresentation(): string {
        return this._dataRepresentation;
    }

    /**
     * This accessor sets the representation of the data currently contained in this register widget.
     * @param newDataRepresentation The representation of the data to set.
     */
    public set dataRepresentation(newDataRepresentation: string) {
        if (newDataRepresentation.toUpperCase() in ["BINARY, DECIMAL, HEXADECIMAL"]) {
            this._dataRepresentation = newDataRepresentation;
            this._args.set("{{ data-representation }}", newDataRepresentation);
        }
    }

    /**
     * This accessor returns the title of this register widget.
     * @returns The title of this register widget.
     */
    public get title(): string {
        return this._title;
    }

    /**
     * This accessor returns the current description for this register widget.
     * @returns The description of this register widget.
     */
    public get description(): string {
        return this._description;
    }

    /**
     * This accessor returns the current content of this register widget.
     * @returns The content of this register widget.
     */
    public get registerContent(): string {
        return this._registerContent;
    }

    /**
     * This accessor sets the register content of this widget to the new value if it is not empty.
     * @param newRegisterContent The new content of this register widget.
     */
    public set registerContent(newRegisterContent: string) {
        this._registerContent = (newRegisterContent.trim() !== "") ? 
            newRegisterContent : 
            this._registerContent;
        this._args.set("{{ register-content }}", this._registerContent);
    }
}